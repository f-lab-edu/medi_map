import React, { useState, useEffect } from "react";
import { API_URLS } from "@/constants/urls";
import { getAuthHeader } from "@/utils/authUtils";
import axios from "axios";
import { validateNickname, validatePasswordChange } from "@/utils/validation";
import { ALERT_MESSAGES } from "@/constants/alert_message";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UserInfo() {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    // 이메일 및 유저 이름 로드
    const fetchUserInfo = async () => {
      try {
        const emailResponse = await axios.get(`${API_URLS.MYPAGE}/email`, {
          headers: getAuthHeader(),
        });
        setEmail(emailResponse.data.email);

        const usernameResponse = await axios.get(`${API_URLS.MYPAGE}/username`, {
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
      await axios.put(
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
      await axios.put(
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
    if (window.confirm(ALERT_MESSAGES.CONFIRM.ACCOUNT_DELETE)) {
      try {
        await axios.delete(`${API_URLS.MYPAGE}`, {
          headers: getAuthHeader(),
        });
        Cookies.remove("accessToken");
        await signOut({ callbackUrl: "/" });
        router.push("/");
        alert(ALERT_MESSAGES.SUCCESS.ACCOUNT_DELETE);
      } catch {
        alert(ALERT_MESSAGES.ERROR.DELETE_ACCOUNT);
      }
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
  );
}