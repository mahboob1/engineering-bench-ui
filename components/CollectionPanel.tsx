"use client";

import { useState } from "react";
import api from "@/lib/api";

interface Props {
    collections: string[];
    onCollectionsChanged: () => void;
}

export default function CollectionsPanel({
    collections,
    onCollectionsChanged
}: Props) {

    const [newCollection, setNewCollection] =
        useState("");

    const [selectedCollection, setSelectedCollection] =
        useState("");

    const [message, setMessage] =
        useState("");

    async function createCollection() {

        const name =
            newCollection.trim();

        if (!name) return;

        try {

            await api.post(
                "/collections",
                {
                    collectionName: name
                }
            );

            setNewCollection("");

            setMessage(
                `Collection '${name}' created.`
            );

            onCollectionsChanged();

        } catch (error) {

            console.error(error);

            setMessage(
                "Failed to create collection."
            );
        }
    }

    async function deleteCollection() {

        if (!selectedCollection) return;

        try {

            await api.delete(
                `/collections/${selectedCollection}`
            );

            setMessage(
                `Collection '${selectedCollection}' deleted.`
            );

            setSelectedCollection("");

            onCollectionsChanged();

        } catch (error) {

            console.error(error);

            setMessage(
                "Failed to delete collection."
            );
        }
    }

    return (

        <div>

            <h2 className="text-2xl font-semibold mb-6">
                Collections
            </h2>


            {/* Collection list */}

            <div className="border rounded p-4 mb-8">

                {collections.length === 0 ? (

                    <p>
                        No collections available.
                    </p>

                ) : (

                    <ul>

                        {collections.map(
                            collection => (

                                <li
                                    key={collection}
                                    className="p-3 border-b"
                                >
                                    {collection}
                                </li>

                            )
                        )}

                    </ul>

                )}

            </div>


            {/* Create */}

            <div className="mb-8">

                <h3 className="font-semibold mb-2">
                    Create Collection
                </h3>

                <input
                    className="border p-2 mr-2"
                    placeholder="Collection name"
                    value={newCollection}
                    onChange={e =>
                        setNewCollection(
                            e.target.value
                        )
                    }
                />

                <button
                    className="border px-4 py-2"
                    onClick={createCollection}
                >
                    Create
                </button>

            </div>


            {/* Delete */}

            <div>

                <h3 className="font-semibold mb-2">
                    Delete Collection
                </h3>

                <select
                    className="border p-2 mr-2"
                    value={selectedCollection}
                    onChange={e =>
                        setSelectedCollection(
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        Select collection
                    </option>

                    {collections.map(
                        collection => (

                            <option
                                key={collection}
                                value={collection}
                            >
                                {collection}
                            </option>

                        )
                    )}

                </select>

                <button
                    className="border px-4 py-2"
                    disabled={!selectedCollection}
                    onClick={deleteCollection}
                >
                    Delete
                </button>

            </div>


            {message && (
                <p className="mt-4">
                    {message}
                </p>
            )}

        </div>
    );
}