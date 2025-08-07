"use client";

/**
 * MobileMenuButton.tsx
 *
 * Responsive hamburger menu button for mobile navigation.
 * Expands to show grouped menu links as an accordion,
 * reading groups/links from a central navigation config.
 *
 * - Clicking the button toggles the menu dropdown.
 * - ESC closes the menu.
 * - Clicking outside closes the menu.
 * - Accordion-style: Only one group is open at a time.
 * - On link click, the menu closes.
 *
 * Reusable, accessible, and completely decoupled from
 * menu data (which lives in NavigationLinks.ts).
 */

import React, { useState, useEffect, useRef } from "react";
import { menuGroups } from "@/components/navigation/NavigationLinks";

/**
 * MobileMenuButton component:
 * Shows a hamburger menu on mobile (`md:hidden`).
 * When opened, displays menu groups and links, loaded from config.
 *
 * Accessibility:
 *  - Uses ARIA attributes for screen readers.
 *  - Closes with ESC and click outside for good UX.
 */
export default function MobileMenuButton() {
  // State: Controls if the mobile menu is visible or not.
  const [open, setOpen] = useState(false);

  // State: Keeps track of which menu group (accordion section) is expanded.
  // Only one group can be open at a time (null = all closed).
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  // Ref: Reference to the menu container div, for click-outside logic.
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * Effect: Closes menu on ESC key press, for accessibility.
   * Only runs once on mount.
   */
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false); // close menu on ESC
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  /**
   * Effect: Closes menu if a click occurs outside the menu when open.
   * Only adds the event when menu is open.
   */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setOpenGroup(null); // close group as well for clean UX
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  /**
   * Handles toggling of group accordions.
   * - Clicking a group header expands/collapses it.
   * - Only one can be open at a time.
   * @param title Group title (used as unique id)
   */
  const handleGroupClick = (title: string) => {
    setOpenGroup((prev) => (prev === title ? null : title));
  };

  // --- RENDER ---

  return (
    <div className="relative md:hidden" ref={menuRef}>
      {/* Hamburger menu button: toggles mobile nav */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Open main menu"
        className="text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        type="button"
      >
        {/* Unicode hamburger icon */}
        ☰ <span className="sr-only">Open main menu</span>
      </button>
      {/* Menu Dropdown: appears when `open` is true */}
      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="absolute left-0 mt-2 w-64 bg-white text-gray-800 rounded shadow-lg z-50 p-4"
        >
          {/* Main navigation area */}
          <nav>
            {/* Loop over each menu group from config */}
            {menuGroups.map((group) => (
              <div key={group.title} className="mb-4">
                {/* Group Header: acts as a toggle for links */}
                <button
                  className="w-full flex items-center justify-between font-bold text-xs text-gray-500 uppercase mb-2 focus:outline-none"
                  onClick={() => handleGroupClick(group.title)}
                  aria-expanded={openGroup === group.title}
                  aria-controls={`group-${group.title}`}
                  type="button"
                >
                  {/* Left: Icon + Group Title */}
                  <span className="flex items-center gap-2">
                    {group.icon && <span>{group.icon}</span>}
                    {group.title}
                  </span>
                  {/* Right: Expand/collapse indicator */}
                  <span>
                    {openGroup === group.title ? "▾" : "▸"}
                  </span>
                </button>
                {/* Links: Only visible if this group is open */}
                {openGroup === group.title && (
                  <div className="ml-2" id={`group-${group.title}`}>
                    {/* Loop over each link in the group */}
                    {group.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="block py-1 text-sm hover:underline"
                        onClick={() => setOpen(false)} // closes menu on link click
                      >
                        {/* Optional icon on link */}
                        {link.icon && <span className="mr-2">{link.icon}</span>}
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}