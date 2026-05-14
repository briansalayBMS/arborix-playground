"use client";

import { useId, useState } from "react";
import styles from "./UploadZone.module.css";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile?: File | null;
}

export default function UploadZone({ onFileSelect, selectedFile }: UploadZoneProps) {
  const inputId = useId();
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const triggerFilePicker = (e: React.MouseEvent) => {
    e.preventDefault();
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  return (
    <label
      htmlFor={inputId}
      className={`${styles.zone} ${dragOver && !selectedFile ? styles.dragOver : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {selectedFile ? (
        <div className={styles.content}>
          <p className={styles.filename}>{selectedFile.name}</p>
          <button
            type="button"
            className={styles.changeLink}
            onClick={triggerFilePicker}
          >
            Choose a different file
          </button>
        </div>
      ) : (
        <div className={styles.content}>
          <p className={styles.label}>DROP YOUR RESUME</p>
          <button
            type="button"
            className={styles.chooseLink}
            onClick={triggerFilePicker}
          >
            Choose file
          </button>
          <p className={styles.hint}>PDF, DOCX, or LinkedIn export.</p>
        </div>
      )}
      <input
        id={inputId}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={(e) => handleFileSelect(e.target.files)}
        className={styles.input}
        aria-label="Choose a file"
      />
    </label>
  );
}
