"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();

  const pageTitle = getPageTitle(pathname);

  const handleLogout = () => {
    localStorage.removeItem("superadmin_token");
    router.replace("/login");
  };

  return (
    <header
      className="h-16 flex items-center justify-between px-8"
      style={{
        background:
          "linear-gradient(180deg, #7B1F1F 0%, #3B0A0D 100%)",
        borderBottom: "1px solid rgba(200,169,81,0.45)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
      }}
    >
      {/* LEFT: PAGE CONTEXT */}
      <h1
        className="text-lg font-semibold tracking-tight"
        style={{
          color: "#FBF6EE",
          fontFamily: "var(--font-heading)",
        }}
      >
        {pageTitle}
      </h1>

      {/* RIGHT: ACTIONS */}
      <button
        onClick={handleLogout}
        className="px-4 py-1.5 rounded-lg text-sm font-medium transition"
        style={{
          backgroundColor: "#C8A951",
          color: "#3B0A0D",
          boxShadow: "0 0 14px rgba(200,169,81,0.7)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#BFA043";
          e.currentTarget.style.boxShadow =
            "0 0 18px rgba(200,169,81,1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#C8A951";
          e.currentTarget.style.boxShadow =
            "0 0 14px rgba(200,169,81,0.7)";
        }}
      >
        Logout
      </button>
    </header>
  );
}

/* ================= PAGE TITLE MAPPER ================= */

function getPageTitle(pathname: string) {
  if (pathname === "/dashboard") return "Dashboard";
  if (pathname.startsWith("/dashboard/restaurants"))
    return "Restaurants";
  if (pathname.startsWith("/dashboard/owners")) return "Owners";
  if (pathname.startsWith("/dashboard/analytics"))
    return "Analytics";
  if (pathname.startsWith("/dashboard/settings")) return "Settings";

  return "Dashboard";
}
