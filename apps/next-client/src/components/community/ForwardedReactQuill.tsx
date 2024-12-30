"use client";

import React, { forwardRef, useRef, useImperativeHandle } from "react";
import ReactQuill, { ReactQuillProps } from "react-quill";
import type Quill from "quill";
import { ERROR_MESSAGES } from "@/constants/errors";

export type ReactQuillInstance = {
  getEditor(): Quill;
};

const ForwardedReactQuill = forwardRef<ReactQuillInstance, ReactQuillProps>(
  function ForwardedReactQuill(props, ref) {
    const quillRef = useRef<ReactQuill | null>(null);

    useImperativeHandle(ref, () => ({
      getEditor() {
        if (quillRef.current) {
          return quillRef.current.getEditor();
        }
        throw new Error(ERROR_MESSAGES.EDITOR_NOT_INITIALIZED);
      },
    }));

    return (
      <ReactQuill ref={quillRef} {...props} />
    );
  }
);

ForwardedReactQuill.displayName = "ForwardedReactQuill";
export default ForwardedReactQuill;