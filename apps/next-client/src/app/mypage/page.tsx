"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import "@/styles/pages/mypage/edit.scss";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ROUTES, API_URLS } from "@/constants/urls";
import { FetchUsernameError, UpdateNicknameError, UpdatePasswordError, DeleteAccountError } from "@/error/MypageError";
import { ALERT_MESSAGES } from "@/constants/alert_message";
import { getAuthHeader } from "@/utils/authUtils";

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("userInfo");
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

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
              <p>약물 정보 즐겨찾기 기능은 여기에~</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
