"use client";

import React from "react";
import "@/styles/pages/search/modal.scss"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null; // isOpen이 false이면 팝업을 렌더링하지 않음

  return (
    <div className="modal_overlay">
      <div className="modal_content">
        <button className="modal_close_btn" onClick={onClose}>
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}
