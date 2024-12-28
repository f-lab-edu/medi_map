"use client";

import React, { forwardRef, useRef, useImperativeHandle, useEffect, useState } from "react";
import type { ReactQuillProps } from "react-quill";
import type Quill from "quill";

export type ReactQuillInstance = {
  getEditor(): Quill;
};

const ForwardedReactQuill = forwardRef<ReactQuillInstance, ReactQuillProps>(
  function ForwardedReactQuill(props, ref) {
    const [ReactQuill, setReactQuill] = useState<null | typeof import("react-quill")>(null);
    const quillRef = useRef<Quill | null | undefined>(null);

    useEffect(() => {
      import("react-quill").then((mod) => {
        setReactQuill(() => mod.default);
      });
    }, []);

    useImperativeHandle(ref, () => ({
      getEditor() {
        if (quillRef.current) {
          return quillRef.current;
        }
        throw new Error("Quill editor instance is not initialized yet.");
      },
    }));

    if (!ReactQuill) {
      return null;
    }

    return (
      <ReactQuill
        ref={(instance) => (quillRef.current = instance?.getEditor() ?? null)}
        {...props}
      />
    );
  }
);

ForwardedReactQuill.displayName = "ForwardedReactQuill";

export default ForwardedReactQuill;