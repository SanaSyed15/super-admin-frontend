"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

type OwnerStatus = "Active" | "Suspended";

type Owner = {
  id: string;
  name: string;
  email: string;
  phone: string;
  restaurantsCount: number;
  status: OwnerStatus;
};

/* ================= PAGE ================= */

export default function OwnersPage() {
  const router = useRouter();

  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const token = localStorage.getItem("superadmin_token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(
          "http://localhost:5000/api/super-admin/owners",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setOwners(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch owners");
        setOwners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  return (
    <div className="px-12 py-10">

      {/* ================= HEADER ================= */}
      <div className="mb-4">
  <h1 className="text-2xl font-semibold text-[#3B0A0D] leading-[1.15]">
    Owners
  </h1>
  <p className="text-sm text-[#7B1F1F] leading-tight">
    View and manage restaurant owners
  </p>
</div>

      {/* ================= TABLE ================= */}
      <div
        className="rounded-2xl overflow-hidden bg-white border"
        style={{
          borderColor: "#C8A951",
          boxShadow: "0 0 28px rgba(200,169,81,0.35)",
        }}
      >
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: "#FBF6EE" }}>
            <tr className="text-left font-semibold text-[#3B0A0D]">
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Restaurants</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-[#7B1F1F]"
                >
                  Loading owners…
                </td>
              </tr>
            )}

            {!loading && owners.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-[#7B1F1F]"
                >
                  No owners found
                </td>
              </tr>
            )}

            {!loading &&
              owners.map((o, idx) => (
                <tr
                  key={o.id}
                  className={
                    idx % 2 === 1
                      ? "bg-[#F6EEDD]"
                      : ""
                  }
                >
                  <td className="px-6 py-5 font-medium text-[#3B0A0D]">
                    {o.name}
                  </td>

                  <td className="px-6 py-5 text-[#7B1F1F]">
                    {o.email}
                  </td>

                  <td className="px-6 py-5 text-[#7B1F1F]">
                    {o.phone || "—"}
                  </td>

                  <td className="px-6 py-5 text-[#7B1F1F]">
                    {o.restaurantsCount}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className="px-4 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor:
                          o.status === "Active"
                            ? "rgba(200,169,81,0.25)"
                            : "rgba(155,43,43,0.15)",
                        color:
                          o.status === "Active"
                            ? "#3B0A0D"
                            : "#7B1F1F",
                      }}
                    >
                      {o.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/owners/${o.id}`)
                      }
                      className="px-5 py-2 rounded-md text-xs font-medium text-white"
                      style={{ backgroundColor: "#7B1F1F" }}
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
