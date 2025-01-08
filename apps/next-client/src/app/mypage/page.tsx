"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import Link from 'next/link';
import Image from "next/image";
import "@/styles/pages/mypage/edit.scss";
import "@/styles/pages/search/search.scss";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ROUTES, API_URLS } from "@/constants/urls";
import { FetchUsernameError, UpdateNicknameError, UpdatePasswordError, DeleteAccountError } from "@/error/MypageError";
import { ALERT_MESSAGES } from "@/constants/alert_message";
import { getAuthHeader } from "@/utils/authUtils";
import { MedicineFavorite } from '@/types/medicine.types';

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("userInfo");
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [favorites, setFavorites] = useState<MedicineFavorite[]>([]);

  // 이메일 조회
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await axios.get(`${API_URLS.MYPAGE}/email`, {
          headers: getAuthHeader(),
        });
        setEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching email:", error);
        alert(ALERT_MESSAGES.ERROR.FETCH_EMAIL);
      }
    };

    fetchEmail();
  }, []);

  // 닉네임 조회
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(`${API_URLS.MYPAGE}/username`, {
          headers: getAuthHeader(),
        });
        setUsername(response.data.username);
      } catch (error) {
        const errorMessage =
          error instanceof AxiosError && error.response?.data?.error;
        console.error(new FetchUsernameError(errorMessage));
        alert(ALERT_MESSAGES.ERROR.FETCH_USERNAME);
      }
    };
    fetchUsername();
  }, []);

  // 닉네임 변경
  const handleNicknameChange = async () => {
    try {
      await axios.put(
        `${API_URLS.MYPAGE}/username`,
        { nickname },
        { headers: getAuthHeader() }
      );

      alert(ALERT_MESSAGES.SUCCESS.NICKNAME_UPDATE);
      setUsername(nickname);
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.error;
      console.error(new UpdateNicknameError(errorMessage));
      alert(ALERT_MESSAGES.ERROR.UPDATE_NICKNAME);
    }
  };

  // 비밀번호 변경
  const handlePasswordChange = async () => {
    try {
      await axios.put(
        `${API_URLS.MYPAGE}/password`,
        { oldPassword, newPassword, confirmPassword },
        { headers: getAuthHeader() }
      );

      alert(ALERT_MESSAGES.SUCCESS.PASSWORD_UPDATE);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      let errorMessage = ALERT_MESSAGES.ERROR.UPDATE_PASSWORD;

      if (error instanceof AxiosError && error.response?.data?.code) {
        const errorCode = error.response.data.code;

        if (errorCode === "PASSWORD_MISMATCH") {
          errorMessage = ALERT_MESSAGES.ERROR.PASSWORD_MISMATCH;
        } else if (errorCode === "PASSWORD_CONFIRMATION_ERROR") {
          errorMessage = ALERT_MESSAGES.ERROR.PASSWORD_CONFIRMATION_ERROR;
        } else if (errorCode === "PASSWORD_SAME_AS_OLD") {
          errorMessage = ALERT_MESSAGES.ERROR.PASSWORD_SAME_AS_OLD;
        } else {
          errorMessage =
            error.response.data.message || ALERT_MESSAGES.ERROR.UNKNOWN_ERROR;
        }
      }

      console.error(new UpdatePasswordError(errorMessage));
      alert(errorMessage);
    }
  };

  // 회원탈퇴
  const handleDeleteAccount = async () => {
    if (window.confirm(ALERT_MESSAGES.CONFIRM.ACCOUNT_DELETE)) {
      try {
        await axios.delete(`${API_URLS.MYPAGE}`, {
          headers: getAuthHeader(),
        });

        Cookies.remove("accessToken");

        await signOut({ callbackUrl: ROUTES.HOME });

        alert(ALERT_MESSAGES.SUCCESS.ACCOUNT_DELETE);

        router.push(ROUTES.HOME);
      } catch (error) {
        const errorMessage =
          error instanceof AxiosError && error.response?.data?.error;
        console.error(new DeleteAccountError(errorMessage));
        alert(ALERT_MESSAGES.ERROR.DELETE_ACCOUNT);
      }
    }
  };

  // 즐겨찾기 데이터 가져오기
  const fetchFavorites = async (): Promise<MedicineFavorite[]> => {
    const response = await axios.get(API_URLS.FAVORITES, {
      headers: getAuthHeader(),
      withCredentials: true,
    });

    console.log("Fetched Favorites:", response.data);
    return response.data;
  };

  // 즐겨찾기 삭제 API
  const deleteFavoriteApi = async (medicineId: string): Promise<void> => {
    await axios.delete(`${API_URLS.FAVORITES}/${medicineId}`, {
      headers: getAuthHeader(),
      withCredentials: true,
    });
  };

  // 삭제 버튼 핸들러
  const handleDeleteFavorite = async (medicineId: string) => {
    if (window.confirm("이 약물을 즐겨찾기에서 삭제하시겠습니까?")) {
      try {
        await deleteFavoriteApi(medicineId);
        alert("즐겨찾기에서 삭제되었습니다.");

        // 삭제 후 상태 업데이트
        setFavorites((prev) => prev.filter((item) => item.medicineId !== medicineId));
      } catch (error) {
        console.error("Error deleting favorite:", error);
        alert("즐겨찾기 삭제에 실패했습니다.");
      }
    }
  };

   // 즐겨찾기 데이터 가져오기
   useEffect(() => {
    if (activeTab === "userBookmark") {
      const fetchUserBookmarks = async () => {
        try {
          const data = await fetchFavorites();
          setFavorites(data); // 가져온 데이터 설정
        } catch (error) {
          console.error("Error fetching favorites:", error);
          alert("즐겨찾기 정보를 불러오지 못했습니다.");
        }
      };

      fetchUserBookmarks();
    }
  }, [activeTab]);


  return (
    
    <div>
      <h1 className="title">마이페이지</h1>

      <div className="mypage_cont">
        <div className="left_cont">
          <ul className="menu_list">
            <li
              className={activeTab === "userInfo" ? "active" : ""}
              onClick={() => setActiveTab("userInfo")}
            >
              <a href="#">회원 정보 수정</a>
            </li>
            <li
              className={activeTab === "userBookmark" ? "active" : ""}
              onClick={() => setActiveTab("userBookmark")}
            >
              <a href="#">약물 정보 즐겨찾기</a>
            </li>
          </ul>
        </div>

        <div className="right_cont">
          {activeTab === "userInfo" && (
            <div className="user_info">
              <h2 className="title">회원정보 수정</h2>
              <p className="sub_title">
                <span>{username}</span>님 안녕하세요! 오늘도 좋은 하루 되세요🍀
              </p>

              <div className="item username">
                <h3>이메일</h3>
                <div className="item_desc">
                  <input
                    type="text"
                    placeholder="내 현재 이메일"
                    value={email}
                    readOnly
                  />
                </div>
              </div>

              <div className="item username">
                <h3>닉네임 변경</h3>
                <div className="item_desc">
                  <input
                    type="text"
                    placeholder="새로운 닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                  <button onClick={handleNicknameChange}>닉네임 변경</button>
                </div>
              </div>

              <div className="item password">
                <h3>비밀번호 변경</h3>
                <input
                  type="password"
                  placeholder="현재 비밀번호"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="새 비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="새 비밀번호 확인"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button onClick={handlePasswordChange}>비밀번호 변경</button>
              </div>

              <button onClick={handleDeleteAccount} className="resign">
                회원탈퇴
              </button>
            </div>
          )}

            {activeTab === "userBookmark" && (
              <div className="user_bookmark">
                <h2 className="title">약물 정보 즐겨찾기</h2>
                {favorites.length > 0 ? (
                  <ul className="medicine_results">
                    {favorites.map((item, index) => (
                      <li
                        className="medicine_desc"
                        key={item.medicineId}
                      >
                        <Link href={`/search/${item.medicineId}`} passHref>
                          {item.itemImage && (
                            <Image
                              src={item.itemImage}
                              alt={item.itemName}
                              width={100}
                              height={50}
                            />
                          )}
                          <div className="medicine_info">
                            <h3 className="name">{item.itemName}</h3>
                            <div className="details">
                              <p className="classification">약물 분류: {item.className}</p>
                              <p className="type">전문/일반 구분: {item.etcOtcName}</p>
                              <p className="manufacturer">제조사: {item.entpName}</p>
                            </div>
                          </div>
                          <button
                            className="delete_button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleDeleteFavorite(item.medicineId);
                            }}
                          >
                            삭제
                          </button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>즐겨찾기한 약물이 없습니다.</p>
                )}
              </div>
            )}

        </div>
      </div>
    </div>
  );
}
