"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function Repositories() {

  const [url, setUrl] =
      useState("");

  async function ingest() {

    await api.post(
      "/github",
      null,
      {
        params: {
          repoUrl: url
        }
      }
    );

    alert("Repository indexed");
  }

  return (
    <div>

      <input
        value={url}
        onChange={(e) =>
          setUrl(e.target.value)}
      />

      <button onClick={ingest}>
        Index Repository
      </button>

    </div>
  );
}