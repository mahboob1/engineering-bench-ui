"use client";

import { useState } from "react";

import Sidebar from "@/components/Sidebar";

import ChatPanel from "@/components/ChatPanel";
import CollectionPanel from "@/components/CollectionPanel";
import UploadPanel from "@/components/UploadPanel";
import GithubPanel from "@/components/GithubPanel";
import SettingsPanel from "@/components/SettingsPanel";

export default function Home() {

    const [panel, setPanel] =
        useState("Chat");

    return (

        <div
            style={{
                display: "flex",
                height: "100vh"
            }}
        >

            <Sidebar
                selected={panel}
                onSelect={setPanel}
            />

            <div
                style={{
                    flex: 1,
                    padding: 30
                }}
            >

                {panel === "Chat" &&
                    <ChatPanel />}

                {panel === "Collections" &&
                    <CollectionPanel />}

                {panel === "Upload" &&
                    <UploadPanel />}

                {panel === "GitHub" &&
                    <GithubPanel />}

                {panel === "Settings" &&
                    <SettingsPanel />}

            </div>

        </div>

    );

}