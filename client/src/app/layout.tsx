'use client';
import { AcademyProvider } from "../../src/app/context/AcademyContext";
import { AuthProvider } from "../../src/app/context/AuthContext";
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AcademyProvider>
            {children}
          </AcademyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
