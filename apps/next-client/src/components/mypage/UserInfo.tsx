'use client';

import React, { useState, useEffect } from 'react';
import { useSession , signOut } from 'next-auth/react';
import { API_URLS } from '@/constants/urls';
import { getAuthHeader } from '@/utils/authUtils';
import { axiosInstance } from '@/services/axiosInstance';
import { useRouter } from 'next/navigation';
import { validateNickname, validatePasswordChange } from '@/utils/validation';
import { ALERT_MESSAGES } from '@/constants/alertMessage';
import Cookies from 'js-cookie';

export default function UserInfo() {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const emailResponse = await axiosInstance.get(`${API_URLS.MYPAGE}/email`, {
          headers: getAuthHeader(),
        });
        setEmail(emailResponse.data.email);

        const usernameResponse = await axiosInstance.get(`${API_URLS.MYPAGE}/username`, {
          headers: getAuthHeader(),
        });
        setUsername(usernameResponse.data.username);
      } catch (error) {
        alert(ALERT_MESSAGES.ERROR.AUTH.FETCH_USER_INFO);
      }
    };

    fetchUserInfo();
  }, []);

  const handleNicknameChange = async () => {
    const validationError = validateNickname(nickname);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      await axiosInstance.put(
        `${API_URLS.MYPAGE}/username`,
        { nickname },
        { headers: getAuthHeader() }
      );
      alert(ALERT_MESSAGES.SUCCESS.NICKNAME_UPDATE);
      setUsername(nickname);
      setNickname("");
    } catch {
      alert(ALERT_MESSAGES.ERROR.UPDATE_NICKNAME);
    }
  };

  const handlePasswordChange = async () => {
    const validationError = validatePasswordChange({
      oldPassword,
      newPassword,
      confirmPassword,
    });
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      await axiosInstance.put(
        `${API_URLS.MYPAGE}/password`,
        { oldPassword, newPassword, confirmPassword },
        { headers: getAuthHeader() }
      );
      alert(ALERT_MESSAGES.SUCCESS.PASSWORD_UPDATE);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      alert(ALERT_MESSAGES.ERROR.UPDATE_PASSWORD);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm(ALERT_MESSAGES.CONFIRM.ACCOUNT_DELETE)) return;

    try {
      if (session?.user?.provider === "google" && session?.user?.googleAccessToken) {
        const googleAccessToken = session.user.googleAccessToken;

        try {
          const revokeResponse = await axiosInstance.post(
            `${API_URLS.MYPAGE}/disconnectGoogle`,
            { token: googleAccessToken },
            { headers: getAuthHeader() }
          );
          if (revokeResponse.data.success) {
            alert(ALERT_MESSAGES.SUCCESS.GOOGLE.DISCONNECT);
          } else {
            console.error("Failed to disconnect Google account:", revokeResponse.data.message);
            alert(ALERT_MESSAGES.ERROR.GOOGLE.DISCONNECT_FAILED);
            return;
          }
        } catch (error) {
          console.error("An error occurred while disconnecting the Google account:", error);
          alert(ALERT_MESSAGES.ERROR.GOOGLE.DISCONNECT);
          return;
        }
      }

      await axiosInstance.delete(`${API_URLS.MYPAGE}`, {
        headers: getAuthHeader(),
      });

      Cookies.remove("accessToken");
      await signOut({ callbackUrl: "/" });

      alert(ALERT_MESSAGES.SUCCESS.ACCOUNT_DELETE);
      router.push("/");
    } catch (error) {
      console.error("Account deletion failed:", error);
      alert(ALERT_MESSAGES.ERROR.DELETE_ACCOUNT);
    }
  };

  return (
    <div className="user_info">
      <h2 className="title">회원정보 수정</h2>
      <p className="sub_title">
        <span>{username}</span>님 안녕하세요! 오늘도 좋은 하루 되세요🍀
      </p>

      <div className="item username">
        <h3>이메일</h3>
        <div className="item_desc">
          <input type="text" placeholder="내 현재 이메일" value={email} readOnly />
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
  );
}