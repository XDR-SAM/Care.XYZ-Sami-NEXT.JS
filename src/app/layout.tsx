import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
    title: "Care.xyz - Trusted Care Services",
    description: "Book reliable babysitting and elderly care services",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased bg-gray-50 dark:bg-gray-900">
                <AuthProvider>
                    <Navbar />
                    <main className="min-h-[calc(100vh-4rem)]">
                        {children}
                    </main>
                    <Toaster position="top-center" />
                </AuthProvider>
            </body>
        </html>
    );
}
