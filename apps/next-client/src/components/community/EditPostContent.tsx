'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { usePostEdit } from '@/hooks/queries/usePostEdit';
import 'react-quill/dist/quill.snow.css';
import type Quill from 'quill';
import { axiosInstance } from '@/services/common/axiosInstance';
import { API_URLS } from '@/constants/urls';
import { ALERT_MESSAGES } from '@/constants/alertMessage';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface EditPostContentProps {
  params: { id: string };
  userId: string;
}

export default function EditPostContent({ params, userId }: EditPostContentProps) {
  const { id } = params;
  const { title, setTitle, content, setContent, handleUpdatePost, handleDeletePost } = usePostEdit(id, userId);

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

          const response = await axiosInstance.post(API_URLS.UPLOADS, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              requiresAuth: true
            },
          });

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

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: '1' }, { header: '2' }, { font: [] }],
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
          ],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: handleImageUpload,
        },
      },
    };
  }, []);

  const formats = useMemo(
    () => [
      'header',
      'font',
      'size',
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'list',
      'bullet',
      'indent',
      'link',
      'image',
    ],
    []
  );

  return (
    <div className="community edit_post">
      <h1>커뮤니티</h1>
      <p className="sub_title">자유롭게 건강에 관련 지식을 공유해봅시다!</p>
      <div className="form_group">
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form_group">
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          value={content}
          onChange={(val) => setContent(val)}
        />
      </div>
      <div className="actions">
        <button onClick={handleUpdatePost} className='create_button'>수정 완료</button>
        <button onClick={handleDeletePost} className="delete_button">
          삭제
        </button>
      </div>
    </div>
  );
}