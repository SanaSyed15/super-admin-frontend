"use client";

import { useState } from "react";

/* ---------------- PAGE ---------------- */

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    platformName: "All-in-One Restaurant POS",
    supportEmail: "support@restaurantpos.com",
    supportPhone: "+91 98765 43210",

    commissionPercent: "5",
    defaultGST: "5",

    maintenanceMode: false,
    allowOnboarding: true,
  });

  const update = (key: string, value: any) =>
    setSettings({ ...settings, [key]: value });

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1
          className="text-xl font-semibold"
          style={{ color: "#3B0A0D", fontFamily: "var(--font-heading)" }}
        >
          Settings
        </h1>
        <p className="text-sm text-[#7B1F1F]">
          Configure platform-wide controls and defaults
        </p>
      </div>

      {/* PLATFORM SETTINGS */}
      <Section title="Platform Settings">
        <Input
          label="Platform Name"
          value={settings.platformName}
          onChange={(v) => update("platformName", v)}
        />
        <Input
          label="Support Email"
          value={settings.supportEmail}
          onChange={(v) => update("supportEmail", v)}
        />
        <Input
          label="Support Phone"
          value={settings.supportPhone}
          onChange={(v) => update("supportPhone", v)}
        />
      </Section>

      {/* FINANCIAL SETTINGS */}
      <Section title="Financial Settings">
        <Input
          label="Platform Commission (%)"
          value={settings.commissionPercent}
          onChange={(v) => update("commissionPercent", v)}
        />
        <Input
          label="Default GST (%)"
          value={settings.defaultGST}
          onChange={(v) => update("defaultGST", v)}
        />
      </Section>

      {/* SYSTEM CONTROLS */}
      <Section title="System Controls">
        <Toggle
          label="Maintenance Mode"
          description="Disable all restaurant and billing access temporarily"
          value={settings.maintenanceMode}
          onChange={(v) => update("maintenanceMode", v)}
        />

        <Toggle
          label="Allow Restaurant Onboarding"
          description="Enable or disable new restaurant registrations"
          value={settings.allowOnboarding}
          onChange={(v) => update("allowOnboarding", v)}
        />
      </Section>

      {/* SAVE */}
      <div className="flex justify-end">
        <button
          onClick={() => alert("Settings saved successfully")}
          className="px-6 py-2 rounded-md text-sm font-medium text-white"
          style={{
            backgroundColor: "#7B1F1F",
            boxShadow: "0 0 12px rgba(176,48,48,0.8)",
          }}
        >
          Save Settings
        </button>
      </div>

    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-white rounded-xl p-5 border"
      style={{
        borderColor: "#C8A951",
        boxShadow: "0 0 16px rgba(200,169,81,0.4)",
      }}
    >
      <h2 className="text-sm font-semibold text-[#3B0A0D] mb-4">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
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
      <label className="block text-xs font-medium text-[#7B1F1F] mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-md text-sm bg-white border"
        style={{
          borderColor: "#C8A951",
          color: "#3B0A0D",
        }}
      />
    </div>
  );
}

function Toggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-[#3B0A0D]">
          {label}
        </p>
        <p className="text-xs text-[#7B1F1F]">
          {description}
        </p>
      </div>

      <button
        onClick={() => onChange(!value)}
        className="px-4 py-1.5 rounded-full text-xs font-semibold border transition"
        style={{
          borderColor: "#C8A951",
          backgroundColor: value
            ? "rgba(200,169,81,0.25)"
            : "rgba(155,43,43,0.15)",
          color: value ? "#3B0A0D" : "#7B1F1F",
        }}
      >
        {value ? "ON" : "OFF"}
      </button>
    </div>
  );
}
