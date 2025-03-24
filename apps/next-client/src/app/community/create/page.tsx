'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type Quill from 'quill'; 
import Cookies from 'js-cookie';
import { axiosInstance } from '@/services/axiosInstance';
import { API_URLS } from '@/constants/urls';
import { useCreatePost } from '@/hooks/queries/useCreatePost';
import 'react-quill/dist/quill.snow.css';
import '@/styles/pages/community/community.scss';
import { ALERT_MESSAGES } from '@/constants/alertMessage';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function CreatePost() {
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const handleCreatePost = useCreatePost(newPost);
  
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
          const response = await axiosInstance.post(API_URLS.UPLOADS, formData, {
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
          alert(ALERT_MESSAGES.ERROR.POST.IMAGE_UPLOAD_ERROR);
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

  return (
    <div className="community create_post">
      <h1>커뮤니티</h1>
      <p className="sub_title">자유롭게 건강에 관련 지식을 공유해봅시다!</p>
      <div className="form_group">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={newPost.title}
          onChange={(e) =>
            setNewPost((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </div>
      <div className="form_group">
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
      <div className="actions">
        <button className="create_button" onClick={handleCreatePost}>작성하기</button>
      </div>
    </div>
  );
}