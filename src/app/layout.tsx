import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased bg-gray-50 dark:bg-gray-900">
                <ThemeProvider>
                <AuthProvider>
                        <div className="flex flex-col min-h-screen">
                    <Navbar />
                            <main className="grow">
                        {children}
                    </main>
                            <Footer />
                        </div>
                        <Toaster 
                            position="top-center"
                            toastOptions={{
                                style: {
                                    background: '#7c3aed',
                                    color: '#fff',
                                },
                                success: {
                                    iconTheme: {
                                        primary: '#10b981',
                                        secondary: '#fff',
                                    },
                                },
                                error: {
                                    iconTheme: {
                                        primary: '#ef4444',
                                        secondary: '#fff',
                                    },
                                },
                            }}
                        />
                </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
