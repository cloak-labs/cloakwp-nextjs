import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LoginForm } from "@cloakwp/react";
/**
 * Theme tokens (`--bg-color-root`, etc.) come from each frontend's CSS.
 * Controls are styled here because this page sits outside `#root`, where
 * Tailwind preflight otherwise strips button and label styles.
 */
const loginStyles = `
  .cloakwp-login {
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    padding: 2rem;
    background: hsl(var(--bg-color-root, 0 0% 100%));
    color: hsl(var(--text-color-root, 0 0% 7%));
  }
  .cloakwp-login h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.2;
    color: inherit;
  }
  .cloakwp-login-form {
    display: flex;
    width: 100%;
    max-width: 24rem;
    flex-direction: column;
    gap: 1rem;
  }
  .cloakwp-login-form > div {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }
  .cloakwp-login-form label {
    font-size: 0.875rem;
    font-weight: 500;
  }
  .cloakwp-login-form input[type="text"],
  .cloakwp-login-form input[type="password"] {
    box-sizing: border-box;
    height: 2.25rem;
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid hsl(var(--border-color-root, 0 0% 80%));
    background: transparent;
    color: inherit;
    padding: 0 0.75rem;
    font: inherit;
    font-size: 0.875rem;
  }
  .cloakwp-login-form button {
    margin-top: 0.25rem;
    height: 2.5rem;
    border: 0;
    border-radius: 0.375rem;
    background: hsl(var(--bg-color-root-invert, 108 16% 25%));
    color: hsl(var(--text-color-root-invert, 60 25% 95%));
    padding: 0 1rem;
    font: inherit;
    font-weight: 500;
    cursor: pointer;
  }
`;
export function CloakWpLoginPage({ redirect = "/", error, title = "Sign in", }) {
    return (_jsxs("main", { className: "cloakwp-login", children: [_jsx("style", { children: loginStyles }), _jsx("h1", { children: title }), error ? (_jsx("p", { role: "alert", style: { color: "#b42318", margin: 0 }, children: "Invalid username or password." })) : null, _jsx(LoginForm, { className: "cloakwp-login-form", redirect: redirect })] }));
}
