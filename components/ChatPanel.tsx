"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Props {
    collections: string[];
}

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export default function ChatPanel({
    collections
}: Props) {

    const [collection, setCollection] =
        useState("");

    const [repository, setRepository] =
        useState("");

    const [question, setQuestion] =
        useState("");

    const [messages, setMessages] =
        useState<ChatMessage[]>([]);

    const [sessionId, setSessionId] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    /*
     * Create chat session.
     * Used only by the conversational /chat endpoint.
     */
    useEffect(() => {

        async function createSession() {

            try {

                const response =
                    await api.post("/session");

                setSessionId(
                    response.data.sessionId
                );

            } catch (error) {

                console.error(error);

                setError(
                    "Unable to create chat session."
                );
            }
        }

        createSession();

    }, []);


    /*
     * ------------------------------------------------
     * /ask
     * ------------------------------------------------
     *
     * Stateless question.
     *
     * GET /api/ask
     *
     * No chat history is used.
     */
    async function ask() {

        if (!collection) {

            setError(
                "Please select a collection."
            );

            return;
        }

        if (!question.trim()) {

            setError(
                "Please enter a question."
            );

            return;
        }

        setLoading(true);
        setError("");

        try {

            const response =
                await api.get(
                    "/ask",
                    {
                        params: {
                            collection,
                            question:
                                question.trim(),
                            repository:
                                repository || undefined
                        }
                    }
                );

            const answer =
                response.data;

            setMessages(previous => [

                ...previous,

                {
                    role: "user",
                    content:
                        question.trim()
                },

                {
                    role: "assistant",
                    content:
                        answer
                }

            ]);

            setQuestion("");

        } catch (error) {

            console.error(error);

            setError(
                "Unable to get an answer."
            );

        } finally {

            setLoading(false);
        }
    }


    /*
     * ------------------------------------------------
     * /chat
     * ------------------------------------------------
     *
     * Conversational question.
     *
     * POST /api/chat
     *
     * Uses sessionId and therefore chat history.
     */
    async function chat() {

        if (!collection) {

            setError(
                "Please select a collection."
            );

            return;
        }

        if (!question.trim()) {

            setError(
                "Please enter a question."
            );

            return;
        }

        if (!sessionId) {

            setError(
                "Chat session is not ready."
            );

            return;
        }

        const currentQuestion =
            question.trim();

        setLoading(true);
        setError("");

        try {

            const response =
                await api.post(
                    "/chat",
                    {
                        sessionId,

                        repository:
                            repository || undefined,

                        question:
                            currentQuestion
                    },
                    {
                        params: {
                            collection
                        }
                    }
                );

            const answer =
                response.data;

            setMessages(previous => [

                ...previous,

                {
                    role: "user",
                    content:
                        currentQuestion
                },

                {
                    role: "assistant",
                    content:
                        answer
                }

            ]);

            setQuestion("");

        } catch (error) {

            console.error(error);

            setError(
                "Unable to get chat response."
            );

        } finally {

            setLoading(false);
        }
    }


    /*
     * Enter = Chat
     * Shift + Enter = new line
     */
    function handleKeyDown(
        e: React.KeyboardEvent<HTMLTextAreaElement>
    ) {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            chat();
        }
    }


    /*
     * Start a new conversational session.
     */
    async function newChat() {

        try {

            const response =
                await api.post("/session");

            setSessionId(
                response.data.sessionId
            );

            setMessages([]);

            setQuestion("");

            setError("");

        } catch (error) {

            console.error(error);

            setError(
                "Unable to create a new chat session."
            );
        }
    }


    return (

        <div className="max-w-4xl">

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-semibold">
                    Chat
                </h2>

                <button
                    className="border px-4 py-2"
                    onClick={newChat}
                >
                    New Chat
                </button>

            </div>


            {/* Collection */}

            <label className="block mb-2 font-medium">
                Collection
            </label>

            <select
                className="border p-2 w-full mb-5"
                value={collection}
                onChange={e =>
                    setCollection(
                        e.target.value
                    )
                }
            >

                <option value="">
                    Select collection
                </option>

                {collections.map(
                    c => (

                        <option
                            key={c}
                            value={c}
                        >
                            {c}
                        </option>

                    )
                )}

            </select>


            {/* Optional repository filter */}

            <label className="block mb-2 font-medium">
                Repository (optional)
            </label>

            <input
                className="border p-2 w-full mb-5"
                placeholder="qdrant-client"
                value={repository}
                onChange={e =>
                    setRepository(
                        e.target.value
                    )
                }
            />


            {/* Conversation */}

            <div className="border rounded p-5 min-h-80 mb-5">

                {messages.length === 0 && (

                    <p className="text-gray-500">
                        Select a collection and
                        ask a question.
                    </p>

                )}

                {messages.map(
                    (message, index) => (

                        <div
                            key={index}
                            className="mb-6"
                        >

                            <div className="font-semibold mb-1">
                                {message.role === "user"
                                    ? "You"
                                    : "Engineering Bench"}
                            </div>

                            <div className="whitespace-pre-wrap">
                                {message.content}
                            </div>

                        </div>

                    )
                )}

            </div>


            {/* Question */}

            <textarea
                className="border w-full h-28 p-3 mb-3"
                placeholder="Ask a question..."
                value={question}
                onChange={e =>
                    setQuestion(
                        e.target.value
                    )
                }
                onKeyDown={handleKeyDown}
            />


            {/* Buttons */}

            <div className="flex gap-3">

                <button
                    className="border px-5 py-2"
                    disabled={
                        loading ||
                        !collection ||
                        !question.trim()
                    }
                    onClick={ask}
                >
                    {loading
                        ? "Thinking..."
                        : "Ask"}
                </button>


                <button
                    className="border px-5 py-2"
                    disabled={
                        loading ||
                        !collection ||
                        !question.trim() ||
                        !sessionId
                    }
                    onClick={chat}
                >
                    {loading
                        ? "Thinking..."
                        : "Chat"}
                </button>

            </div>


            {error && (

                <p className="mt-4 text-red-600">
                    {error}
                </p>

            )}

        </div>
    );
}