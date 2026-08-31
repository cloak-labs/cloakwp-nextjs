import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LoginForm } from "@cloakwp/react";
export function CloakWpLoginPage({ redirect = "/", error, title = "Sign in", }) {
    return (_jsxs("main", { style: {
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.25rem",
            padding: "2rem",
        }, children: [_jsx("h1", { style: { fontSize: "1.5rem", margin: 0 }, children: title }), error ? (_jsx("p", { role: "alert", style: { color: "#b42318", margin: 0 }, children: "Invalid username or password." })) : null, _jsx(LoginForm, { redirect: redirect })] }));
}
