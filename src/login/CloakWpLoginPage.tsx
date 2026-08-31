import { LoginForm } from "@cloakwp/react";

export type CloakWpLoginPageProps = {
  redirect?: string;
  error?: string;
  title?: string;
};

export function CloakWpLoginPage({
  redirect = "/",
  error,
  title = "Sign in",
}: CloakWpLoginPageProps) {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.25rem",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", margin: 0 }}>{title}</h1>
      {error ? (
        <p role="alert" style={{ color: "#b42318", margin: 0 }}>
          Invalid username or password.
        </p>
      ) : null}
      <LoginForm redirect={redirect} />
    </main>
  );
}
