"use client";

import { useState } from "react";
import api from "@/lib/api";

interface Props {
    collections: string[];
}

export default function GithubPanel({
    collections
}: Props) {

    const [collection, setCollection] =
        useState("");

    const [repoUrl, setRepoUrl] =
        useState("");

    const [message, setMessage] =
        useState("");

    async function ingestRepository() {

        if (!collection || !repoUrl) {
            setMessage(
                "Select a collection and enter a GitHub URL."
            );
            return;
        }

        try {

            const response =
                await api.post("/github", null, {
                    params: {
                        collection,
                        repoUrl
                    }
                });

            setMessage(response.data);

        } catch (error) {

            console.error(error);

            setMessage(
                "GitHub repository ingestion failed."
            );
        }
    }

    return (

        <div>

            <h2 className="text-2xl font-semibold mb-6">
                GitHub Repository
            </h2>

            <label className="block mb-2">
                Collection
            </label>

            <select
                className="border p-2 w-full mb-5"
                value={collection}
                onChange={e =>
                    setCollection(e.target.value)
                }
            >

                <option value="">
                    Select collection
                </option>

                {collections.map(
                    c => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    )
                )}

            </select>


            <label className="block mb-2">
                GitHub Repository URL
            </label>

            <input
                className="border p-2 w-full mb-5"
                placeholder="https://github.com/qdrant/qdrant-client"
                value={repoUrl}
                onChange={e =>
                    setRepoUrl(e.target.value)
                }
            />


            <button
                className="border px-4 py-2"
                onClick={ingestRepository}
            >
                Ingest Repository
            </button>


            {message && (
                <p className="mt-4">
                    {message}
                </p>
            )}

        </div>
    );
}