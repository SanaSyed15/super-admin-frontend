"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

/* ================= ROYAL THEME ================= */

const theme = {
  /* Backgrounds */
  pageBg: "#FBF6EE",          // Ivory / Light Cream
  surface: "#FFFFFF",        // Pure White
  overlay: "rgba(251,246,238,0.9)",

  /* Maroon / Royal Red */
  maroon: "#7B1F1F",
  maroonDark: "#3B0A0D",
  maroonDeep: "#9B2B2B",

  /* Gold */
  gold: "#C8A951",
  goldSoft: "rgba(200,169,81,0.35)",
  goldGlow: "rgba(200,169,81,0.6)",

  /* Text */
  textPrimary: "#3B0A0D",
  textMuted: "#5A3E3E",

  divider: "rgba(200,169,81,0.4)",
  danger: "#9B2B2B",
};

/* ================= CONFIG ================= */

const API_BASE = "http://localhost:5000/api";
type Tab = "Details" | "Owner" | "Tax" | "Operations" | "Danger";

/* ================= PAGE ================= */

export default function ManageRestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("Details");
  const [data, setData] = useState<any>(null);
  const [draft, setDraft] = useState<any>(null);
  const [editing, setEditing] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetch(`${API_BASE}/super-admin/restaurants/${id}`)
      .then(res => res.json())
      .then(res => {
        setData(res);
        setDraft(res);
      });
  }, [id]);

  if (!data) return <div className="p-10">Loading…</div>;

  /* ================= SAVE ================= */

  const save = async (endpoint: string, payload: any) => {
    await fetch(`${API_BASE}/super-admin/restaurants/${id}/${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setData(draft);
    setEditing(false);

    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2200);
  };

  const toggleStatus = async () => {
    await save("status", {
      status: data.restaurant.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    });
    setShowConfirm(false);
  };

  /* ================= UI ================= */

  return (
    <div
      className="min-h-screen px-12 py-8 text-sm"
      style={{ background: theme.pageBg, color: theme.textPrimary }}
    >
      {/* SAVED TOAST */}
      {showSaved && (
        <div
          className="fixed top-6 right-6 px-4 py-2 rounded-lg shadow-lg z-50"
          style={{
            background: theme.surface,
            boxShadow: `0 0 18px ${theme.goldSoft}`,
            fontWeight: 500,
          }}
        >
          ✓ Changes saved
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="mb-12">
        <div className="flex justify-between items-start">
          <div className="relative">
            <span
              className="absolute -left-4 top-2 h-10 w-1 rounded-full"
              style={{ background: theme.gold }}
            />
            <h1
              className="text-4xl font-semibold tracking-tight"
              style={{ color: theme.maroonDark }}
            >
              {data.restaurant.name}
            </h1>

            <p
              className="mt-2 text-sm flex items-center gap-2"
              style={{ color: theme.textMuted }}
            >
              <LocationIcon />
              {data.restaurant.city}, {data.restaurant.state}
            </p>
          </div>

          <div className="flex items-center gap-5">
            <StatusPill status={data.restaurant.status} />
            <button
              onClick={() => router.push("/dashboard/restaurants")}
              className="font-medium hover:underline"
              style={{ color: theme.maroon }}
            >
              ← Back
            </button>
          </div>
        </div>

        <div
          className="mt-6 h-px"
          style={{
            background: `linear-gradient(to right, ${theme.gold}, transparent)`,
          }}
        />
      </div>

      {/* ================= CONTENT SURFACE ================= */}
      <div
        className="rounded-2xl px-12 py-10"
        style={{
          background: theme.surface,
          boxShadow: `0 0 0 1px ${theme.divider}`,
        }}
      >
        {/* TABS */}
        <div className="flex gap-10 mb-8 border-b" style={{ borderColor: theme.divider }}>
          {(["Details", "Owner", "Tax", "Operations", "Danger"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setEditing(false);
                setDraft(data);
              }}
              className="pb-4 font-medium relative"
              style={{ color: tab === t ? theme.maroon : theme.textMuted }}
            >
              {t}
              {tab === t && (
                <span
                  className="absolute bottom-0 left-0 w-full h-[2px]"
                  style={{ background: theme.gold }}
                />
              )}
            </button>
          ))}
        </div>

        {/* SECTION HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2
            className="text-lg font-semibold"
            style={{ color: theme.maroonDark }}
          >
            {tab}
          </h2>

          {tab !== "Danger" && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 font-medium"
              style={{ color: theme.gold }}
            >
              <EditIcon /> Edit
            </button>
          )}
        </div>

        {/* ================= DETAILS ================= */}
        {tab === "Details" && (
          <div className="grid grid-cols-2 gap-x-14 gap-y-10">
            <Field label="Restaurant Type"
              value={draft.restaurant.restaurant_type}
              edit={editing}
              onChange={(v:string)=>setDraft({...draft,restaurant:{...draft.restaurant,restaurant_type:v}})} />

            <Field label="Phone"
              value={draft.restaurant.phone}
              edit={editing}
              onChange={(v:string)=>setDraft({...draft,restaurant:{...draft.restaurant,phone:v}})} />

            <Field label="Email"
              value={draft.restaurant.email}
              edit={editing}
              onChange={(v:string)=>setDraft({...draft,restaurant:{...draft.restaurant,email:v}})} />

            <Field label="Pincode"
              value={draft.restaurant.pincode}
              edit={editing}
              onChange={(v:string)=>setDraft({...draft,restaurant:{...draft.restaurant,pincode:v}})} />

            <Field label="Address" full
              value={draft.restaurant.address}
              edit={editing}
              onChange={(v:string)=>setDraft({...draft,restaurant:{...draft.restaurant,address:v}})} />
          </div>
        )}

        {/* ================= OWNER ================= */}
        {tab === "Owner" && (
          <div className="grid grid-cols-2 gap-x-14 gap-y-10">
            <Field label="Owner Name"
              value={draft.owner?.name}
              edit={editing}
              onChange={(v:string)=>setDraft({...draft,owner:{...draft.owner,name:v}})} />

            <ReadOnly label="Owner Email" value={draft.owner?.email} />

            <Field label="Phone"
              value={draft.owner?.phone}
              edit={editing}
              onChange={(v:string)=>setDraft({...draft,owner:{...draft.owner,phone:v}})} />
          </div>
        )}

        {/* ================= TAX ================= */}
        {tab === "Tax" && (
          <div className="grid grid-cols-2 gap-x-14 gap-y-10">
            <Toggle label="GST Registered"
              value={draft.tax.gst_registered}
              edit={editing}
              onChange={(v:boolean)=>setDraft({...draft,tax:{...draft.tax,gst_registered:v}})} />

            {draft.tax.gst_registered && (
              <>
                <Field label="GST Number"
                  value={draft.tax.gst_number}
                  edit={editing}
                  onChange={(v:string)=>setDraft({...draft,tax:{...draft.tax,gst_number:v}})} />

                <Field label="GST Percentage"
                  value={draft.tax.gst_percentage}
                  edit={editing}
                  onChange={(v:string)=>setDraft({...draft,tax:{...draft.tax,gst_percentage:v}})} />
              </>
            )}
          </div>
        )}

        {/* ================= OPERATIONS ================= */}
        {tab === "Operations" && (
          <div className="grid grid-cols-2 gap-x-14 gap-y-10">
            <Select label="Billing Mode"
              value={draft.settings.billing_mode}
              edit={editing}
              options={["COUNTER","TABLE","BOTH"]}
              onChange={(v:string)=>setDraft({...draft,settings:{...draft.settings,billing_mode:v}})} />

            <Toggle label="QR Ordering Enabled"
              value={draft.settings.qr_enabled}
              edit={editing}
              onChange={(v:boolean)=>setDraft({...draft,settings:{...draft.settings,qr_enabled:v}})} />
          </div>
        )}

        {/* ================= DANGER ================= */}
        {tab === "Danger" && (
          <button
            className="mt-6 px-6 py-2 rounded-md text-white"
            style={{
              background: theme.danger,
              boxShadow: "0 0 22px rgba(176,48,48,0.6)",
            }}
            onClick={() => setShowConfirm(true)}
          >
            {data.restaurant.status === "ACTIVE"
              ? "Deactivate Restaurant"
              : "Activate Restaurant"}
          </button>
        )}
      </div>

      {/* SAVE BAR */}
      {editing && tab !== "Danger" && (
        <SaveBar
          onCancel={() => {
            setDraft(data);
            setEditing(false);
          }}
          onSave={() => {
            if (tab === "Details") save("details", draft.restaurant);
            if (tab === "Owner") save("owner", draft.owner);
            if (tab === "Tax") save("tax", draft.tax);
            if (tab === "Operations") save("settings", draft.settings);
          }}
        />
      )}

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <ConfirmModal
          onCancel={() => setShowConfirm(false)}
          onConfirm={toggleStatus}
        />
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Field({ label, value, edit, onChange, full }: any) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="block text-xs mb-2" style={{ color: theme.textMuted }}>
        {label}
      </label>
      {edit ? (
        <input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-b outline-none py-1 text-sm"
          style={{
            borderColor: theme.gold,
            color: theme.maroonDark,
          }}
        />
      ) : (
        <div style={{ color: theme.maroonDark, fontWeight: 500 }}>
          {value || "—"}
        </div>
      )}
    </div>
  );
}

function ReadOnly({ label, value }: any) {
  return (
    <div>
      <label className="block text-xs mb-2" style={{ color: theme.textMuted }}>
        {label}
      </label>
      <div style={{ color: theme.maroonDark, fontWeight: 500 }}>
        {value}
      </div>
    </div>
  );
}

function Toggle({ label, value, edit, onChange }: any) {
  return (
    <div>
      <label className="block text-xs mb-3" style={{ color: theme.textMuted }}>
        {label}
      </label>
      {edit ? (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
      ) : (
        <div style={{ color: theme.maroonDark, fontWeight: 500 }}>
          {value ? "Enabled" : "Disabled"}
        </div>
      )}
    </div>
  );
}

function Select({ label, value, edit, options, onChange }: any) {
  return (
    <div>
      <label className="block text-xs mb-2" style={{ color: theme.textMuted }}>
        {label}
      </label>
      {edit ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-b outline-none py-1 text-sm"
          style={{ borderColor: theme.gold, color: theme.maroonDark }}
        >
          {options.map((o: string) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <div style={{ color: theme.maroonDark, fontWeight: 500 }}>
          {value}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: any) {
  return (
    <span
      className="px-4 py-1 rounded-full text-xs font-semibold"
      style={{
        background: theme.goldSoft,
        color: theme.maroonDark,
        boxShadow: `0 0 10px ${theme.goldSoft}`,
      }}
    >
      {status}
    </span>
  );
}

function SaveBar({ onSave, onCancel }: any) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl flex gap-6 shadow-lg"
      style={{
        background: theme.surface,
        boxShadow: `0 0 30px ${theme.goldSoft}`,
      }}
    >
      <button onClick={onCancel} style={{ color: theme.textMuted }}>
        Cancel
      </button>
      <button
        onClick={onSave}
        className="px-5 py-2 rounded-md text-white text-sm"
        style={{ background: theme.maroon }}
      >
        Save changes
      </button>
    </div>
  );
}

function ConfirmModal({ onCancel, onConfirm }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className="rounded-xl p-6 w-[360px]"
        style={{ background: theme.surface }}
      >
        <h3 className="font-semibold mb-2">Confirm action</h3>
        <p className="text-sm mb-6">
          This will immediately affect restaurant access.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel}>Cancel</button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-white"
            style={{ background: theme.danger }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= ICONS ================= */

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
