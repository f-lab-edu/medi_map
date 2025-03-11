'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { usePost } from '@/hooks/queries/usePostEdit';
import '@/styles/pages/community/community.scss';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function EditPostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: session } = useSession();

  const userId = session?.user?.id;
  const accessToken = session?.user?.accessToken || '';

  const { title, setTitle, content, setContent, loading, handleUpdatePost, handleDeletePost } = usePost(id, userId, accessToken);

  const modules = useMemo(() => {
    return {
      toolbar: [
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

  if (loading) {
    return <p>게시글을 불러오는 중...</p>;
  }

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
          <button  onClick={handleUpdatePost} className='create_button'>수정 완료</button>
          <button onClick={handleDeletePost} className="delete_button">
            삭제
          </button>
        </div>
    </div>
  );
}