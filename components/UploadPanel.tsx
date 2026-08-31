"use client";

import { useState } from "react";
import api from "@/lib/api";

interface Props {
    collections: string[];
}

export default function UploadPanel({
    collections
}: Props) {

    const [collection, setCollection] =
        useState("");

    const [file, setFile] =
        useState<File | null>(null);

    const [message, setMessage] =
        useState("");

    async function uploadFile() {

        if (!collection || !file) {

            setMessage(
                "Select a collection and a file."
            );

            return;
        }

        try {

            const formData =
                new FormData();

            formData.append(
                "file",
                file
            );

            await api.post(
                `/upload?collection=${encodeURIComponent(collection)}`,
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );

            setMessage(
                `File '${file.name}' uploaded successfully.`
            );

            setFile(null);

        } catch (error) {

            console.error(error);

            setMessage(
                "File upload failed."
            );
        }
    }

    return (

        <div>

            <h2 className="text-2xl font-semibold mb-6">
                Upload Document
            </h2>

            <label className="block mb-2">
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


            <label className="block mb-2">
                File
            </label>

            <input
                type="file"
                className="mb-5"
                onChange={e =>
                    setFile(
                        e.target.files?.[0] ?? null
                    )
                }
            />


            <br />

            <button
                className="border px-4 py-2"
                onClick={uploadFile}
            >
                Upload
            </button>


            {message && (
                <p className="mt-4">
                    {message}
                </p>
            )}

        </div>
    );
}