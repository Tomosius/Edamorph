// src/components/DropDownNav.tsx

import React, { useState } from "react";
import Link from "next/link";
import { menuGroups } from "@/components/navigation/NavigationLinks";

export default function DropDownNav() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openGroups, setOpenGroups] = useState<{ [key: number]: boolean }>({});

    return (
        <div className="relative md:hidden">
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label="Open main menu"
                className="text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="button"
            >
                ☰ <span className="sr-only">Open main menu</span>
            </button>
            {menuOpen && (
                <div
                    className="absolute left-0 mt-2 w-64 bg-white text-gray-800 rounded shadow-lg z-50 p-4"
                    id="mobile-menu"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile navigation"
                >
                    <nav className="space-y-4 text-sm">
                        {menuGroups.map((group, idx) => (
                            <details
                                key={group.title}
                                open={openGroups[idx] || false}
                                className="group"
                            >
                                <summary
                                    className="cursor-pointer text-xs font-bold text-gray-500 uppercase mb-1 focus:outline-none flex items-center"
                                    onClick={e => {
                                        e.preventDefault();
                                        setOpenGroups(prev => ({
                                            ...prev,
                                            [idx]: !prev[idx],
                                        }));
                                    }}
                                    aria-expanded={!!openGroups[idx]}
                                >
                                    {group.icon && <span className="mr-2">{group.icon}</span>}
                                    {group.title}
                                </summary>
                                <div className="ml-2 space-y-1 mt-1">
                                    {group.links.map(link => (
                                        <Link
                                            href={link.href}
                                            key={link.label}
                                            className="block w-full text-left hover:underline"
                                        >
                                            {link.icon && <span className="mr-1">{link.icon}</span>}
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </details>
                        ))}
                    </nav>
                </div>
            )}
        </div>
    );
}