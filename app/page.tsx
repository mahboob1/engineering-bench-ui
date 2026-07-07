"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function Home() {

  const [question, setQuestion] =
      useState("");

  const [answer, setAnswer] =
      useState("");

  async function ask() {

    const response =
      await api.get("/ask", {
        params: {
          question
        }
      });

    setAnswer(response.data);
  }

  return (
    <div className="p-10">

      <h1 className="text-3xl">
        Engineering Bench
      </h1>

      <textarea
        className="border w-full h-32 p-2"
        placeholder="Ask a question..."
        value={question}
        onChange={(e) =>
          setQuestion(e.target.value)}
      />

      <button
        className="border px-4 py-2 mt-2"
        onClick={ask}
      >
        Ask
      </button>

      <pre>
        {answer}
      </pre>

    </div>
  );
}