"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import CollectionsPanel from "@/components/CollectionPanel";
import GithubPanel from "@/components/GithubPanel";
import UploadPanel from "@/components/UploadPanel";
import ChatPanel from "@/components/ChatPanel";

export default function Home() {

    const [collections, setCollections] =
        useState<string[]>([]);

    const [activePanel, setActivePanel] =
        useState("collections");

    async function loadCollections() {

        try {

            const response =
                await api.get("/collections");

            setCollections(response.data);

        } catch (error) {

            console.error(
                "Failed to load collections",
                error
            );
        }
    }

    useEffect(() => {
        loadCollections();
    }, []);

    return (
        <div className="flex min-h-screen">

            {/* Sidebar */}

            <aside className="w-60 border-r p-5">

                <h1 className="text-xl font-bold mb-8">
                    Engineering Bench
                </h1>

                <button
                    className="block w-full text-left p-3 mb-2"
                    onClick={() =>
                        setActivePanel("collections")
                    }
                >
                    Collections
                </button>

                <button
                    className="block w-full text-left p-3 mb-2"
                    onClick={() =>
                        setActivePanel("upload")
                    }
                >
                    Upload
                </button>

                <button
                    className="block w-full text-left p-3 mb-2"
                    onClick={() =>
                        setActivePanel("github")
                    }
                >
                    GitHub
                </button>

                <button
                    className="block w-full text-left p-3 mb-2"
                    onClick={() =>
                        setActivePanel("chat")
                    }
                >
                    Chat
                </button>

            </aside>


            {/* Main panel */}

            <main className="flex-1 p-10">

                {activePanel === "collections" && (
                    <CollectionsPanel
                        collections={collections}
                        onCollectionsChanged={
                            loadCollections
                        }
                    />
                )}

                {activePanel === "github" && (
                    <GithubPanel
                        collections={collections}
                    />
                )}

                {activePanel === "upload" && (
                    <UploadPanel
                        collections={collections}
                    />
                )}

                {activePanel === "chat" && (
                    <ChatPanel
                        collections={collections}
                    />
                )}

            </main>

        </div>
    );
}