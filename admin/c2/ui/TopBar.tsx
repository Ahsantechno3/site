"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Bell, CheckCheck } from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import ThemeToggle from "@/c2/models/ThemeToggle";

// Dynamic Interfaces
export interface UserProfile {
  name: string;
  role: string;
  avatar: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  isUnread: boolean;
}

export interface MessageItem {
  id: string;
  sender: string;
  text: string;
  time: string;
  isUnread: boolean;
}

interface TopBarProps<T = any> {
  title: string;
  subtitle?: string;
  user: UserProfile;
  notifications?: NotificationItem[];
  messages?: MessageItem[];
  searchPlaceholder?: string;
  // Generic Search Bar Props
  searchData?: T[];
  searchFields?: (keyof T)[];
  onSearchResults?: (results: T[]) => void;
}

export const TopBar = <T extends Record<string, any>>({
  title,
  subtitle,
  user,
  notifications = [],
  messages = [],
  searchPlaceholder = "Search...",
  searchData = [],
  searchFields = [],
  onSearchResults,
}: TopBarProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePopup, setActivePopup] = useState<"msg" | "notif" | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActivePopup(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadMsgCount = messages.filter((m) => m.isUnread).length;
  const unreadNotifCount = notifications.filter((n) => n.isUnread).length;

  return (
    <header className="w-full min-h-14 bg-(--background) rounded-xl shadow-md border border-(--border) px-3  flex items-center justify-between select-none">
      {/* Dynamic Page Title & Subtitle */}
      <div>
        <h1 className="text-md md:text-xl font-bold text-(--text) leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[10px] text-(--text-muted) font-medium w-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1" ref={containerRef}>
        {/* Modular Search Bar Component */}
        {searchData.length > 0 && onSearchResults && (
          <SearchBar
            data={searchData}
            searchFields={searchFields}
            onSearchResults={onSearchResults}
            placeholder={searchPlaceholder}
          />
        )}

        {/* Action Icons With Popups */}
        <div className="flex items-center gap-1 relative">
          {/* Message Button & Popup */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setActivePopup(activePopup === "msg" ? null : "msg")
              }
              className={`relative p-0.5 md:p-2 rounded-xl transition-colors ${
                activePopup === "msg"
                  ? "bg-(--primary-light) text-(--primary-dark)"
                  : "text-(--text-muted) hover:text-(--text) hover:bg-(--primary-soft)"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              {unreadMsgCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-(--primary) rounded-full ring-2 ring-(--background)" />
              )}
            </button>

            {activePopup === "msg" && (
              <div className="absolute right-0 mt-2 w-80 bg-(--background) rounded-2xl shadow-xl border border-(--border) z-50 p-4">
                <div className="flex items-center justify-between pb-3 border-b border-(--border)">
                  <h4 className="text-sm font-bold text-(--text)">Messages</h4>
                  <span className="text-[10px] bg-(--primary-light) text-(--primary-dark) px-2 py-0.5 rounded-full font-bold">
                    {unreadMsgCount} New
                  </span>
                </div>
                <div className="divide-y divide-(--border) max-h-60 overflow-y-auto">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="py-3 px-1 flex flex-col gap-1 hover:bg-(--primary-soft) rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-(--text)">
                          {msg.sender}
                        </span>
                        <span className="text-[10px] text-(--text-muted)">
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-xs text-(--text-muted) line-clamp-1">
                        {msg.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notification Button & Popup */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setActivePopup(activePopup === "notif" ? null : "notif")
              }
              className={`relative p-0.5 md:p-2 rounded-xl transition-colors ${
                activePopup === "notif"
                  ? "bg-(--primary-light) text-(--primary-dark)"
                  : "text-(--text-muted) hover:text-(--text) hover:bg-(--primary-soft)"
              }`}
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-(--background)" />
              )}
            </button>

            {activePopup === "notif" && (
              <div className="absolute right-0 mt-2 w-80 bg-(--background) rounded-2xl shadow-xl border border-(--border) z-50 p-4">
                <div className="flex items-center justify-between pb-3 border-b border-(--border)">
                  <h4 className="text-sm font-bold text-(--text)">Notifications</h4>
                  <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                    {unreadNotifCount} Unread
                  </span>
                </div>
                <div className="divide-y divide-(--border) max-h-60 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="py-3 px-1 flex items-start gap-2 hover:bg-(--primary-soft) rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="mt-0.5">
                        <CheckCheck className="w-4 h-4 text-(--primary)" />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1">
                        <span className="text-xs font-semibold text-(--text)">
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-(--text-muted)">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-0.5 bg-(--border) mx-1" />

        {/* Profile Card */}
        <div className="flex items-center gap-3 cursor-pointer hover:bg-(--primary-soft) p-1.5 rounded-xl">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 min-w-9 min-h-9 shrink-0 rounded-full object-cover border border-(--primary-light)"
          />
          <div className="md:flex flex-col text-left hidden">
            <span className="text-xs font-bold text-(--text) leading-tight">
              {user.name}
            </span>
            <span className="text-[11px] text-(--text-muted) font-medium">
              {user.role}
            </span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default TopBar;