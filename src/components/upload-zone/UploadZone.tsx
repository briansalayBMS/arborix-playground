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

  return (
    <label
      htmlFor={inputId}
      className={`${styles.zone} ${dragOver ? styles.dragOver : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {selectedFile ? (
        <div className={styles.content}>
          <p className={styles.filename}>{selectedFile.name}</p>
          <p className={styles.changeLink}>change file</p>
        </div>
      ) : (
        <div className={styles.content}>
          <p className={styles.label}>DROP YOUR RESUME OR LINKEDIN PDF</p>
          <p className={styles.subtext}>or click to choose a file</p>
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
