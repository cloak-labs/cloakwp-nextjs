"use client";

import { useEffect, useRef } from "react";
import { LogoutForm } from "@cloakwp/react";

export type CloakWpLogoutPageProps = {
  redirect?: string;
};

export function CloakWpLogoutPage({ redirect = "/" }: CloakWpLogoutPageProps) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.requestSubmit();
  }, []);

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
      <p style={{ margin: 0 }}>Signing out…</p>
      <LogoutForm ref={formRef} redirect={redirect}>
        Continue
      </LogoutForm>
    </main>
  );
}
