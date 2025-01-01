import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "@/styles/globals.scss";
import icon from "@/public/envidtech.png";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "etran.dev URL Map",
    description: "An active URL Mapping of etran.dev URLs",
    icons: {
        icon: icon.src
    }
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        </body>
        </html>
    );
}
