"use client";

import React, { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import type Quill from "quill"; 

import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { API_URLS } from "@/constants/urls";
import "react-quill/dist/quill.snow.css";
import "@/styles/pages/community/community.scss";
import { ALERT_MESSAGES } from "@/constants/alert_message";

// ReactQuill 동적 로드 (SSR 비활성화)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function CreatePost() {
  const router = useRouter();
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  
  function handleImageUpload(this: { quill: Quill }) {
    const editor = this.quill;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        try {
          const formData = new FormData();
          formData.append("image", file);

          // 업로드 요청
          const response = await axios.post(API_URLS.UPLOADS, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          });

          // 에디터 인스턴스에 이미지 삽입
          const imageUrl = response.data.url;
          const range = editor.getSelection(true);
          editor.insertEmbed(range.index, "image", imageUrl);
          editor.setSelection(range.index + 1);
        } catch (error) {
          console.error("Image upload failed:", error);
          alert("이미지 업로드 중 오류가 발생했습니다.");
        }
      }
    };
  }

  // Quill 모듈 설정
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          // 함수 핸들러 등록
          image: handleImageUpload,
        },
      },
    };
  }, []);

  // Quill에서 지원하는 포맷
  const formats = useMemo(
    () => [
      "header",
      "font",
      "size",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
    ],
    []
  );

  // 글 작성 버튼 클릭 시 처리
  const handleCreatePost = useCallback(async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert(ALERT_MESSAGES.ERROR.POST.POST_EMPTY_FIELDS);
      return;
    }
    try {
      await axios.post(API_URLS.POSTS, newPost, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      alert(ALERT_MESSAGES.SUCCESS.POST.POST_CREATE);
      router.push("/community");
    } catch (error) {
      console.error("글 작성 실패:", error);
      alert(ALERT_MESSAGES.ERROR.POST.POST_CREATE_ERROR);
    }
  }, [newPost, router]);

  return (
    <div className="create-post">
      <h1>글쓰기</h1>
      <div className="form-group">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={newPost.title}
          onChange={(e) =>
            setNewPost((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </div>
      <div className="form-group">
        <ReactQuill
          theme="snow"
          placeholder="내용을 입력하세요"
          modules={modules}
          formats={formats}
          value={newPost.content}
          onChange={(val) =>
            setNewPost((prev) => ({ ...prev, content: val }))
          }
        />
      </div>
      <button onClick={handleCreatePost}>작성하기</button>
    </div>
  );
}