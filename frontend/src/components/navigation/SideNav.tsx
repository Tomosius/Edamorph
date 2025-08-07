// frontend/src/components/navigation/SideNav.tsx

"use client";

/**
 * SideNav.tsx
 *
 * Responsive side navigation menu designed for desktop (`md:block`).
 * Features accordion-style collapsible menu groups, loaded from central navigation config.
 *
 * - Clicking a group header expands/collapses links.
 * - ESC or clicking outside closes any open accordion group.
 * - Designed specifically for desktop sidebar navigation.
 * - Accessible and reusable.
 *
 * Navigation data (groups/links) loaded from NavigationLinks.ts.
 */

import React, { useState, useEffect, useRef } from "react";
import { menuGroups } from "@/components/navigation/NavigationLinks";

/**
 * SideNav Component:
 * Renders sidebar navigation with collapsible groups.
 */
export default function SideNav() {
  // State: Tracks currently opened group (accordion-style).
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  // Ref: Menu container reference for click-outside logic.
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * Effect: Closes the accordion group on ESC key press.
   */
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenGroup(null);
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  /**
   * Effect: Closes accordion groups when clicking outside.
   */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Toggles accordion group visibility.
   * Only one group open at a time.
   * @param title Group title used as unique ID.
   */
  const handleGroupClick = (title: string) => {
    setOpenGroup((prev) => (prev === title ? null : title));
  };

  // --- RENDER ---

  return (
    <aside
      ref={menuRef}
      className="hidden md:block w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 text-sm overflow-y-auto"
      aria-label="Sidebar navigation"
    >
      <nav>
        {menuGroups.map((group) => (
          <div key={group.title} className="mb-4">
            {/* Group Header: clickable accordion toggle */}
            <button
              className="w-full flex items-center justify-between font-bold text-xs text-gray-500 uppercase mb-2 focus:outline-none"
              onClick={() => handleGroupClick(group.title)}
              aria-expanded={openGroup === group.title}
              aria-controls={`group-${group.title}`}
              type="button"
            >
              <span className="flex items-center gap-2">
                {group.icon && <span>{group.icon}</span>}
                {group.title}
              </span>
              <span>{openGroup === group.title ? "▾" : "▸"}</span>
            </button>

            {/* Group Links: Collapsible content */}
            {openGroup === group.title && (
              <div className="ml-2" id={`group-${group.title}`}>
                {group.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block py-1 text-sm hover:underline"
                  >
                    {link.icon && <span className="mr-2">{link.icon}</span>}
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}