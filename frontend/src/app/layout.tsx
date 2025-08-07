import type {Metadata} from "next";

import "@/app/globals.css";
import TopNav from "@/components/navigation/TopNav";
import SideNav  from "@/components/navigation/SideNav";


// Optional: Set default metadata (title, description, etc.)
export const metadata: Metadata = {
    title: "EdaMorph",
    description: "Next Generation Exploratory Data Analysis of EdaMorph",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <TopNav/>
        <main className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
            <div>
                <SideNav/>
            </div>
            <div>
                            {children}

            </div>
        </main>
        </body>
        </html>
    );
}
