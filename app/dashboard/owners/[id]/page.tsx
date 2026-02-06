"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/* ---------------- TYPES ---------------- */

type Status = "Active" | "Suspended";
type RestaurantStatus = "Active" | "Inactive";

type Restaurant = {
  id: number;
  name: string;
  city: string;
  status: RestaurantStatus;
};

type Owner = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: Status;
  joinedOn: string;
  restaurants: Restaurant[];
};

const API_BASE = "http://localhost:5000/api";

/* ---------------- PAGE ---------------- */

export default function OwnerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH OWNER ---------------- */

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const token = localStorage.getItem("superadmin_token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(`${API_BASE}/super-admin/owners/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch owner");

        setOwner(data);
      } catch (err: any) {
        console.error("Owner fetch failed:", err.message);
        setOwner(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOwner();
  }, [id]);

  /* ---------------- TOGGLE STATUS ---------------- */

  const toggleOwnerStatus = async () => {
    try {
      const token = localStorage.getItem("superadmin_token");
      if (!token) throw new Error("No auth token found");

      const res = await fetch(
        `${API_BASE}/super-admin/owners/${id}/toggle`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setOwner((prev) =>
        prev ? { ...prev, status: data.status } : prev
      );
    } catch (err: any) {
      console.error("Toggle status failed:", err.message);
    }
  };

  /* ---------------- STATES ---------------- */

  if (loading) {
    return <p className="text-sm text-[#7B1F1F]">Loading owner…</p>;
  }

  if (!owner) {
    return <p className="text-sm text-[#7B1F1F]">Owner not found</p>;
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-[#3B0A0D]">
            {owner.name}
          </h1>
          <p className="text-sm mt-0.5 text-[#7B1F1F]">
            Owner management
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard/owners")}
          className="px-4 py-2 rounded-md text-sm font-medium border"
          style={{ borderColor: "#C8A951", color: "#3B0A0D" }}
        >
          ← Back
        </button>
      </div>

      {/* DIVIDER */}
      <div
        className="h-px"
        style={{
          background: "linear-gradient(to right, #C8A951, transparent)",
        }}
      />

      {/* OWNER INFO */}
      <Section title="Owner Information">
        <Info label="Name" value={owner.name} />
        <Info label="Email" value={owner.email} />
        <Info label="Phone" value={owner.phone} />
        <Info label="Joined On" value={owner.joinedOn} />
        <Info label="Status">
          <StatusBadge status={owner.status} />
        </Info>
      </Section>

      {/* RESTAURANTS */}
      <Section title="Linked Restaurants">
        <div
          className="overflow-hidden border rounded-lg"
          style={{ borderColor: "#C8A951" }}
        >
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: "#FBF6EE" }}>
              <tr className="text-left font-semibold text-[#3B0A0D]">
                <th className="px-6 py-3">Restaurant</th>
                <th className="px-6 py-3">City</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y" style={{ borderColor: "#C8A951" }}>
              {owner.restaurants.map((r) => (
                <tr key={r.id} className="hover:bg-[#FBF6EE]">
                  <td className="px-6 py-4 font-medium text-[#3B0A0D]">
                    {r.name}
                  </td>
                  <td className="px-6 py-4 text-[#7B1F1F]">
                    {r.city}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor:
                          r.status === "Active"
                            ? "rgba(200,169,81,0.25)"
                            : "rgba(155,43,43,0.18)",
                        color:
                          r.status === "Active"
                            ? "#3B0A0D"
                            : "#7B1F1F",
                      }}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/restaurants/${r.id}`)
                      }
                      className="px-4 py-1.5 rounded-md text-xs font-medium text-white"
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
      </Section>

      {/* PLATFORM ACTION */}
      <Section title="Platform Action">
        <button
          onClick={toggleOwnerStatus}
          className="px-5 py-2 rounded-md text-sm font-semibold text-white"
          style={{
            backgroundColor: owner.status === "Active" ? "#9B2B2B" : "#3B0A0D",
            border: "1px solid #C8A951",
            boxShadow: "0 0 14px rgba(155,43,43,0.45)",
          }}
        >
          {owner.status === "Active"
            ? "Suspend Owner"
            : "Activate Owner"}
        </button>
      </Section>
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl px-6 py-5 border bg-white"
      style={{
        borderColor: "#C8A951",
        boxShadow: "0 0 14px rgba(200,169,81,0.35)",
      }}
    >
      <h2 className="text-sm font-semibold text-[#3B0A0D] mb-4">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Info({ label, value, children }: any) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[#7B1F1F] font-medium">{label}</span>
      <span className="text-[#3B0A0D] font-semibold">
        {value ?? children}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold"
      style={{
        backgroundColor:
          status === "Active"
            ? "rgba(200,169,81,0.25)"
            : "rgba(155,43,43,0.18)",
        color: status === "Active" ? "#3B0A0D" : "#7B1F1F",
      }}
    >
      {status}
    </span>
  );
}
