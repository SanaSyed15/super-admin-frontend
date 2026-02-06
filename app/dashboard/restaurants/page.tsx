"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

type Status = "ACTIVE" | "INACTIVE";

type Restaurant = {
  id: string;
  name: string;
  owner_name: string | null;
  city: string;
  status: Status;
};

type FormState = {
  restaurantName: string;
  restaurantType: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
};

/* ================= PAGE ================= */

export default function RestaurantsPage() {
  const router = useRouter();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("superadmin_token");
    if (!t) {
      router.push("/login");
      return;
    }
    setToken(t);
  }, [router]);

  const fetchRestaurants = async () => {
    if (!token) return;
    setLoading(true);
    const res = await fetch(
      "http://localhost:5000/api/super-admin/restaurants",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setRestaurants(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRestaurants();
  }, [token]);

  if (loading) {
    return <p className="text-[#7B1F1F]">Loading restaurants…</p>;
  }

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1
            className="text-2xl font-semibold"
            style={{ color: "#3B0A0D", fontFamily: "var(--font-heading)" }}
          >
            Restaurants
          </h1>
          <p className="text-sm text-[#7B1F1F]">
            Manage and onboard restaurants
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-white"
          style={{
            backgroundColor: "#7B1F1F",
            boxShadow: "0 0 18px rgba(176,48,48,0.9)",
          }}
        >
          + Add Restaurant
        </button>
      </div>

      {/* SUCCESS BANNER */}
      {successMessage && (
  <div
    className="mb-6 px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
    style={{
      backgroundColor: "rgba(34,197,94,0.15)", // soft green
      color: "#14532d", // dark green text
      border: "1px solid rgba(34,197,94,0.4)",
      boxShadow: "0 0 18px rgba(34,197,94,0.35)",
      transform: "translateY(0)",
      transition: "all 0.3s ease",
    }}
  >
    {/* CHECK SVG */}
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#16a34a"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>

    <span>{successMessage}</span>
  </div>
)}


      {/* TABLE */}
      <div
        className="rounded-2xl overflow-hidden border"
        style={{
          borderColor: "#C8A951",
          boxShadow: "0 0 28px rgba(200,169,81,0.45)",
        }}
      >
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: "#FBF6EE" }}>
            <tr className="text-left font-semibold text-[#3B0A0D]">
              <th className="px-6 py-4">Restaurant</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">City</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {restaurants.map((r, i) => (
              <tr
                key={r.id}
                className="border-t"
                style={{
                  backgroundColor:
                    i % 2 === 0
                      ? "#FFFFFF"
                      : "rgba(200,169,81,0.12)",
                }}
              >
                <td className="px-6 py-4 font-semibold text-[#3B0A0D]">
                  {r.name}
                </td>
                <td className="px-6 py-4 text-[#7B1F1F]">
                  {r.owner_name || "—"}
                </td>
                <td className="px-6 py-4 text-[#7B1F1F]">
                  {r.city}
                </td>
                <td className="px-6 py-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor:
                        r.status === "ACTIVE"
                          ? "rgba(200,169,81,0.35)"
                          : "rgba(155,43,43,0.25)",
                      color:
                        r.status === "ACTIVE"
                          ? "#3B0A0D"
                          : "#7B1F1F",
                    }}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/restaurants/${r.id}`)
                    }
                    className="px-4 py-1.5 rounded-lg text-xs font-medium text-white"
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

      {showAdd && (
        <AddRestaurantModal
          token={token!}
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            fetchRestaurants();
            setSuccessMessage("Restaurant added successfully");
            setTimeout(() => setSuccessMessage(null), 4000);
          }}
        />
      )}
    </>
  );
}

/* ================= MODAL ================= */

function AddRestaurantModal({
  token,
  onClose,
  onSuccess,
}: {
  token: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<FormState>({
    restaurantName: "",
    restaurantType: "Restaurant",
    address: "",
    city: "",
    state: "",
    pincode: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
  });

  const update = (k: keyof FormState, v: string) =>
    setForm({ ...form, [k]: v });

  const submit = async () => {
    if (!form.restaurantName || !form.city || !form.ownerName) return;

    setSaving(true);
    const res = await fetch(
      "http://localhost:5000/api/super-admin/onboard-restaurant",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurant: {
            name: form.restaurantName,
            restaurantType: form.restaurantType,
            address: form.address,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            status: "INACTIVE",
          },
          admin: {
            name: form.ownerName,
            email: form.ownerEmail,
            phone: form.ownerPhone,
            password: "Temp@123",
          },
        }),
      }
    );

    if (res.ok) {
      onClose();
      onSuccess();
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-2xl w-full max-w-3xl flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        <div className="px-6 py-5 border-b border-[#C8A951]">
          <h2 className="text-lg font-semibold text-[#3B0A0D]">
            Restaurant Onboarding
          </h2>
        </div>

        <div className="px-6 py-6 overflow-y-auto flex-1">
          <Section title="Restaurant Information" icon={
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C8A951"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-6h6v6" />
    </svg>
  }>
            <Input label="Restaurant Name *" value={form.restaurantName} onChange={(v) => update("restaurantName", v)} />
            <Input label="Restaurant Type" value={form.restaurantType} onChange={(v) => update("restaurantType", v)} />
            <Input label="Address" value={form.address} onChange={(v) => update("address", v)} />
            <Input label="City *" value={form.city} onChange={(v) => update("city", v)} />
          </Section>

          <Section title="Owner Information" icon={
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C8A951"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  }>
            <Input label="Owner Name *" value={form.ownerName} onChange={(v) => update("ownerName", v)} />
            <Input label="Owner Email" value={form.ownerEmail} onChange={(v) => update("ownerEmail", v)} />
            <Input label="Owner Phone" value={form.ownerPhone} onChange={(v) => update("ownerPhone", v)} />
          </Section>
        </div>

        <div className="px-6 py-4 border-t border-[#C8A951] flex justify-end gap-4">
          <button onClick={onClose} className="text-[#7B1F1F]">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="px-6 py-2 rounded-lg text-white"
            style={{ backgroundColor: "#7B1F1F" }}
          >
            {saving ? "Saving…" : "Complete Onboarding"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= UI HELPERS ================= */

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="border rounded-xl p-4 mb-6"
      style={{ borderColor: "#C8A951" }}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-sm font-semibold text-[#3B0A0D]">
          {title}
        </h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-[#3B0A0D]">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2"
        style={{
          borderColor: "#C8A951",
          color: "#3B0A0D",
        }}
      />
    </div>
  );
}
