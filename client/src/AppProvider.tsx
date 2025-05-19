"use client";

import React, { createContext, useContext, useState } from "react";

// Create context
const AppContext = createContext({
  sessionToken: "",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSessionToken: (sessionToken: string) => {},
});

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
};

// Create a provider component
export default function AppProvider({
  children,
  initialSessionToken = "",
}: {
  children: React.ReactNode;
  initialSessionToken?: string;
}) {
  const [sessionToken, setSessionToken] = useState(initialSessionToken);

  return (
    <AppContext.Provider value={{ sessionToken, setSessionToken }}>
      {children}
    </AppContext.Provider>
  );
}
