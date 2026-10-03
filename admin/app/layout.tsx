// /app/layout.tsx
"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import AdminLoginPopup from "@/components/Login";
import { AuthProvider, useAdminAuth } from "@/services/authContext";
import "./globals.css";

// Renders the shell and gates the panel behind a session. Kept separate from
// RootLayout because useAdminAuth must run *inside* the provider.
function AdminShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isRestoring, sessionNotice, clearNotice } = useAdminAuth();

  // Avoid flashing the login popup while the session probe is still running.
  const showLoginPopup = !isRestoring && !isAuthenticated;

  return (
    <main className="flex w-full min-h-screen">
      <div className="min-w-0 flex-1 flex gap-3">
        {isAuthenticated ? (
          <>
            <Sidebar />
            <div className="flex-1 min-w-0">{children}</div>
          </>
        ) : (
          // While signed out the panel stays visible but inert, so the admin
          // can see where they are going to land.
          <div className="pointer-events-none select-none min-w-0 flex-1 flex gap-3">
            <Sidebar />
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        )}
      </div>

      <AdminLoginPopup
        isOpen={showLoginPopup}
        notice={sessionNotice}
        onDismissNotice={clearNotice}
      />
    </main>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before paint so the saved theme is applied without a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem("theme");
                if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                  document.documentElement.setAttribute("data-theme", "dark");
                } else {
                  document.documentElement.setAttribute("data-theme", "light");
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-[var(--background)] text-[var(--text)] transition-colors duration-200"
        suppressHydrationWarning
      >
        <AuthProvider>
          <AdminShell>{children}</AdminShell>
        </AuthProvider>
      </body>
    </html>
  );
}
