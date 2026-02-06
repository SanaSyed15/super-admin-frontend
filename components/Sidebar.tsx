"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="min-h-screen flex flex-col transition-all duration-300"
      style={{
        width: collapsed ? "80px" : "256px",
        background: "linear-gradient(180deg, #7B1F1F 0%, #3B0A0D 100%)",
        boxShadow: "4px 0 24px rgba(0,0,0,0.18)",
      }}
    >
      {/* ================= BRAND / TOGGLE ================= */}
      <div
        className="flex items-center justify-between px-4 py-5 border-b"
        style={{ borderColor: "rgba(200,169,81,0.35)" }}
      >
        {!collapsed && (
          <div>
            <h1
              className="text-lg font-semibold leading-tight"
              style={{
                fontFamily: "var(--font-heading)",
                color: "#FFFFFF",
              }}
            >
              Restaurant POS
            </h1>
            <p
              className="text-xs mt-1"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              Super Admin
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white text-sm px-2 py-1 rounded-md transition"
          style={{
            backgroundColor: "rgba(200,169,81,0.15)",
          }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {/* ================= NAV ================= */}
      <nav className="flex-1 px-2 py-6 space-y-1 text-sm">
        <SidebarItem
          label="Dashboard"
          href="/dashboard"
          active={pathname === "/dashboard"}
          collapsed={collapsed}
        />
        <SidebarItem
          label="Restaurants"
          href="/dashboard/restaurants"
          active={pathname.startsWith("/dashboard/restaurants")}
          collapsed={collapsed}
        />
        <SidebarItem
          label="Owners"
          href="/dashboard/owners"
          active={pathname.startsWith("/dashboard/owners")}
          collapsed={collapsed}
        />
        <SidebarItem
          label="Analytics"
          href="/dashboard/analytics"
          active={pathname.startsWith("/dashboard/analytics")}
          collapsed={collapsed}
        />
        <SidebarItem
          label="Settings"
          href="/dashboard/settings"
          active={pathname.startsWith("/dashboard/settings")}
          collapsed={collapsed}
        />
      </nav>

      {/* ================= FOOTER ================= */}
      <div
        className="px-4 py-4 border-t text-xs"
        style={{
          borderColor: "rgba(200,169,81,0.35)",
          color: "rgba(255,255,255,0.75)",
        }}
      >
        {!collapsed && (
          <>
            <p className="uppercase tracking-wide mb-1">Logged in as</p>
            <p className="font-medium text-white">Super Admin</p>
          </>
        )}
      </div>
    </aside>
  );
}

/* ================= NAV ITEM ================= */

function SidebarItem({
  label,
  href,
  active,
  collapsed,
}: {
  label: string;
  href: string;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center rounded-xl px-4 py-2.5 transition-all"
      style={{
        justifyContent: collapsed ? "center" : "flex-start",
        backgroundColor: active
          ? "rgba(200,169,81,0.18)"
          : "transparent",
        boxShadow: active
          ? "inset 4px 0 0 #C8A951"
          : "none",
      }}
      title={collapsed ? label : undefined}
    >
      {!collapsed && (
        <span
          style={{
            color: active ? "#C8A951" : "rgba(255,255,255,0.9)",
            fontWeight: active ? 500 : 400,
          }}
        >
          {label}
        </span>
      )}
    </Link>
  );
}
