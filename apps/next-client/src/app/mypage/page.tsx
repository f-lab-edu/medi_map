'use client';

import React, { useState } from 'react';
import '@/styles/pages/mypage/edit.scss';
import '@/styles/pages/search/search.scss';
import UserInfo from '@/components/mypage/UserInfo';
import UserBookmark from '@/components/mypage/UserBookmark';

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<"userInfo" | "userBookmark">("userInfo");

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
          {activeTab === "userInfo" && <UserInfo />}
          {activeTab === "userBookmark" && <UserBookmark />}
        </div>
      </div>
    </div>
  );
}
