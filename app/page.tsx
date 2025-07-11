"use client";

import { useState } from "react";
import { Page } from "@/components/app-page";
import { LoginPage } from "@/components/login/login-page";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // In a real app, you would verify credentials here
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Page />;
}