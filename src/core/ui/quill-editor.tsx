import ReactQuill, { type ReactQuillProps } from "react-quill";
import { FieldError } from "rizzui";
import cn from "../utils/class-names";
import "react-quill/dist/quill.snow.css";
import { useMemo } from "react";

interface QuillEditorProps extends ReactQuillProps {
  error?: string;
  label?: React.ReactNode;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  toolbarPosition?: "top" | "bottom";
}

export default function QuillEditor({
  label,
  error,
  className,
  labelClassName,
  errorClassName,
  toolbarPosition = "top",
  ...props
}: QuillEditorProps) {
  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ font: [] }, { size: ["small", false, "large", "huge"] }], // Font family and size
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"], // Basic text formatting
        [{ color: [] }, { background: [] }], // Text and background color
        [{ script: "sub" }, { script: "super" }], // Subscript and superscript
        ["blockquote", "code-block"], // Block elements
        [{ list: "ordered" }, { list: "bullet" }], // Lists
        [{ indent: "-1" }, { indent: "+1" }], // Indentation
        [{ align: [] }, { direction: "rtl" }], // Alignment and text direction
        ["link", "image", "video"], // Media and links
        ["clean"], // Clear formatting
        ["undo", "redo"], // Undo and redo (custom buttons, requires registration)
      ],
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const quillFormats = [
    "font",
    "size",
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "align",
    "direction",
    "link",
    "image",
    "video",
  ];

  return (
    <div className={cn(className)}>
      {label && (
        <label className={cn("mb-1.5 block", labelClassName)}>{label}</label>
      )}
      <ReactQuill
        modules={quillModules}
        formats={quillFormats}
        className={cn(
          "react-quill",
          toolbarPosition === "bottom" && "react-quill-toolbar-bottom relative",
          className
        )}
        {...props}
      />
      {error && (
        <FieldError size="md" error={error} className={errorClassName} />
      )}
    </div>
  );
}