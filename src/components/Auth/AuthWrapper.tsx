"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isLoggedIn } from "@/utils/auth";
import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [ready, setReady] = useState(false);

  const isLoginRoute =
    pathname === "/login" || pathname.startsWith("/login");

  useEffect(() => {
    const logged = isLoggedIn();

    console.log("🔎 PATHNAME:", pathname);
    console.log("🔒 logged:", logged);

    // 1️⃣ NOT LOGGED IN → REDIRECT EVERYTHING except /login
    if (!logged) {
      if (!isLoginRoute) {
        router.replace("/login");
        return;
      }
      setReady(true);
      return;
    }

    // 2️⃣ LOGGED IN → login page? redirect home
    if (logged && isLoginRoute) {
      router.replace("/");
      return;
    }

    // 3️⃣ LOGGED IN AND PAGE OK
    setReady(true);
  }, [pathname]);

  if (!ready) return null;

  if (isLoginRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
        <Header />
        <main className="mx-auto w-full max-w-screen-2xl p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
