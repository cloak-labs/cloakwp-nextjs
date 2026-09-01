"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { LogoutForm } from "@cloakwp/react";
export function CloakWpLogoutPage({ redirect = "/" }) {
    const formRef = useRef(null);
    useEffect(() => {
        formRef.current?.requestSubmit();
    }, []);
    return (_jsxs("main", { style: {
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.25rem",
            padding: "2rem",
        }, children: [_jsx("p", { style: { margin: 0 }, children: "Signing out\u2026" }), _jsx(LogoutForm, { ref: formRef, redirect: redirect, children: "Continue" })] }));
}
