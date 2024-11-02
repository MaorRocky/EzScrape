"use client";

import React from "react";
import { ThemeProvider } from "next-themes";

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}

export default AppProviders;
