'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '@/services/axiosInstance';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { API_URLS } from '@/constants/urls';
import '@/styles/pages/community/community.scss';
import { QueryClient } from '@tanstack/react-query';
import { ALERT_MESSAGES } from '@/constants/alertMessage';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const router = useRouter();

  const userId = session?.user?.id;
  const accessToken = session?.user?.accessToken;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`${API_URLS.POSTS}/${id}`);
        const post = response.data;

        if (post.userId !== userId) {
          alert(ALERT_MESSAGES.ERROR.POST.POST_PERMISSION_DENIED);
          router.push('/community');
          return;
        }

        setTitle(post.title);
        setContent(post.content);
      } catch (error) {
        console.error('Error fetching post:', error);
        alert(ALERT_MESSAGES.ERROR.POST.POST_FETCH_ERROR);
        router.push('/community');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, userId, router]);

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

  const queryClient = new QueryClient();

  const handleUpdatePost = async () => {
    try {
      if (!title.trim() || !content.trim()) {
        alert(ALERT_MESSAGES.ERROR.POST.POST_EMPTY_FIELDS);
        return;
      }

      await axiosInstance.put(
        `${API_URLS.POSTS}/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      alert(ALERT_MESSAGES.SUCCESS.POST.POST_CREATE);
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      router.push(`/community/${id}`);
      router.refresh();
    } catch (error) {
      console.error('Error updating post:', error);
      alert(ALERT_MESSAGES.ERROR.POST.POST_CREATE_ERROR);
    }
  };

  const handleDeletePost = async () => {
    try {
      if (!window.confirm(ALERT_MESSAGES.CONFIRM.CHECK_DELETE)) return;

      await axiosInstance.delete(`${API_URLS.POSTS}/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      alert(ALERT_MESSAGES.SUCCESS.POST.POST_DELETE);
      router.push('/community');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(ALERT_MESSAGES.ERROR.POST.POST_DELETE_ERROR);
    }
  };

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