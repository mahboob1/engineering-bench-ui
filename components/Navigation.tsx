"use client";

import Link from "next/link";

export default function Navigation() {

    return (

        <nav
            style={{
                display: "flex",
                gap: "20px",
                marginBottom: "30px"
            }}>

            <Link href="/">Home</Link>

            <Link href="/collections">
                Collections
            </Link>

            <Link href="/upload">
                Upload
            </Link>

            <Link href="/github">
                GitHub
            </Link>

            <Link href="/ask">
                Ask
            </Link>

        </nav>
    );
}