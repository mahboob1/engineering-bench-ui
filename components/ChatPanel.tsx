"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function ChatPanel() {

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

        <div>

            <h2>Chat</h2>

            <textarea
                className="border w-full h-32 p-2"
                value={question}
                placeholder="Ask a question..."
                onChange={(e) =>
                    setQuestion(e.target.value)}
            />

            <br/>

            <button
                className="border px-4 py-2 mt-2"
                onClick={ask}
            >
                Ask
            </button>

            <pre>{answer}</pre>

        </div>

    );

}