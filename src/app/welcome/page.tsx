"use client";

import { useState } from "react";
import WelcomeShell from "@/components/welcome/WelcomeShell";
import WelcomeIntro from "@/components/welcome/WelcomeIntro";
import WelcomeReading from "@/components/welcome/WelcomeReading";
import WelcomeReadback from "@/components/welcome/WelcomeReadback";

type WelcomeState = "intro" | "reading" | "readback";

export default function WelcomePage() {
  const [state, setState] = useState<WelcomeState>("intro");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setState("reading");
    setTimeout(() => setState("readback"), 2000);
  };

  const handleSubmit = (answer: string) => {
    console.log("User answered:", answer);
  };

  const placeholderReadback =
    "Brian. You've spent the last five years building product organizations from zero. The pattern is clear in the work. The one thing I want to ask isn't on your resume: what kind of leader do you actually want to be next?";

  return (
    <WelcomeShell>
      {state === "intro" && <WelcomeIntro onUpload={handleUpload} />}
      {state === "reading" && <WelcomeReading />}
      {state === "readback" && (
        <WelcomeReadback readback={placeholderReadback} onSubmit={handleSubmit} />
      )}
    </WelcomeShell>
  );
}
