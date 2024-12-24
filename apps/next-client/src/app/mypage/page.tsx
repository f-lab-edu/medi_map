"use client";

import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { API_URLS , ROUTES } from '@/constants/urls';
import { useSession } from 'next-auth/react'; // useSession 추가
import '@/styles/pages/mypage/edit.scss';
import { FetchUsernameError, UpdateNicknameError, UpdatePasswordError, DeleteAccountError } from '@/error/MypageError';
import { ALERT_MESSAGES } from '@/constants/alert_message';
import Cookies from 'js-cookie';
import { signOut } from 'next-auth/react';


export default function MyPage() {
  const { data: session } = useSession();

  const getAuthHeader = () => {
    if (!session || !session.user || !session.user.accessToken) {
      throw new Error("No token in session");
    }
    return { Authorization: `Bearer ${session.user.accessToken}` };
  };

  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  
  // 닉네임 조회
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        if (!session || !session.user || !session.user.accessToken) {
          throw new Error("No valid access token.");
        }
  
        const response = await axios.get(`${API_URLS.MYPAGE}/username`, {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error("FetchUsernameError:", error.message || error);
        alert(ALERT_MESSAGES.ERROR.FETCH_USERNAME);
      }
    };
    fetchUsername();
  }, [session]);

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

        switch (errorCode) {
          case "PASSWORD_MISMATCH":
            errorMessage = ALERT_MESSAGES.ERROR.PASSWORD_MISMATCH;
            break;
          case "PASSWORD_CONFIRMATION_ERROR":
            errorMessage = ALERT_MESSAGES.ERROR.PASSWORD_CONFIRMATION_ERROR;
            break;
          case "PASSWORD_SAME_AS_OLD":
            errorMessage = ALERT_MESSAGES.ERROR.PASSWORD_SAME_AS_OLD;
            break;
          default:
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
  
        alert(ALERT_MESSAGES.SUCCESS.ACCOUNT_DELETE);
  
        Cookies.remove("accessToken");
        await signOut({ redirect: false });
  
        router.push(ROUTES.AUTH.SIGN_IN);
      } catch (error) {
        console.error("DeleteAccountError:", error.message || error);
        alert(ALERT_MESSAGES.ERROR.DELETE_ACCOUNT);
      }
    }
  };

  return (
    <div>
      <h1 className="title">마이페이지</h1>
      <p className="sub_title">
        <span>{username}</span>님 안녕하세요!😊🍀
      </p>

      <div className="item username">
        <h3>닉네임 변경</h3>
        <div className="item_desc">
          <input type="text" placeholder="새로운 닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          <button onClick={handleNicknameChange}>닉네임 변경</button>
        </div>
      </div>

      <div className="item password">
        <h3>비밀번호 변경</h3>
        <input type="password" placeholder="현재 비밀번호" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        <input type="password" placeholder="새 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
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
  );
}