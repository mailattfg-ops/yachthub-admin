import "@/css/satoshi.css";
import "@/css/style.css";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Toaster } from "react-hot-toast";




import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { PropsWithChildren } from "react";
import { Providers } from "./providers";
import AuthWrapper from "@/components/Auth/AuthWrapper";

export const metadata: Metadata = {
  title: {
    template: "%s | NextAdmin - Next.js Dashboard Kit",
    default: "NextAdmin - Next.js Dashboard Kit",
  },
  description:
    "Next.js admin dashboard toolkit with 200+ templates, UI components, and integrations for fast dashboard development.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Toaster position="top-center" />
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />

          <AuthWrapper>
            {children}
          </AuthWrapper>

        </Providers>
      </body>
    </html>
  );
}
