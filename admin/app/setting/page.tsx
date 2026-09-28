"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Code2,
  CreditCard,
  Link2,
  LoaderCircle,
  Palette,
  Settings,
  ShieldCheck,
  Store,
  Truck,
  Users,
} from "lucide-react";
import Button from "@/c2/ui/Button";
import { settingsService } from "@/services/settingsService";
import type { SettingsDocument, SettingsSection, SettingsUser } from "@/services/settingsService";
import { SettingsPanel } from "../../c2/layout/SettingsPanels";

type SettingMenu =
  | "General"
  | "Store Information"
  | "Payment Methods"
  | "Shipping"
  | "Notifications"
  | "Users & Roles"
  | "Security"
  | "API Settings"
  | "Integrations"
  | "Appearance";

const settingMenus: { name: SettingMenu; icon: LucideIcon }[] = [
  { name: "General", icon: Settings },
  { name: "Store Information", icon: Store },
  { name: "Payment Methods", icon: CreditCard },
  { name: "Shipping", icon: Truck },
  { name: "Notifications", icon: Bell },
  { name: "Users & Roles", icon: Users },
  { name: "Security", icon: ShieldCheck },
  { name: "API Settings", icon: Code2 },
  { name: "Integrations", icon: Link2 },
  { name: "Appearance", icon: Palette },
];

export default function SettingsPage() {
  const [activeMenu, setActiveMenu] = useState<SettingMenu>("General");
  const [settings, setSettings] = useState<SettingsDocument>({});
  const [users, setUsers] = useState<SettingsUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    settingsService.getSettings()
      .then((data) => {
        if (!cancelled) setSettings(data);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Unable to load settings.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (activeMenu !== "Users & Roles") return;
    let cancelled = false;

    settingsService.getUsers()
      .then((data) => {
        if (!cancelled) setUsers(data);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Unable to load users.");
      });

    return () => {
      cancelled = true;
    };
  }, [activeMenu]);

  const saveSection = async (section: SettingsSection, value: unknown) => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const updated = await settingsService.updateSection(section, value);
      setSettings(updated);
      setNotice("Settings saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    setError("");
    try {
      await settingsService.deleteUser(id);
      setUsers((currentUsers) => currentUsers.filter((user) => user._id !== id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete user.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center" role="status" aria-label="Loading settings">
        <LoaderCircle className="h-7 w-7 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <main className="min-h-full bg-[var(--background)] p-3">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--text)]">Settings</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Manage your store settings and preferences</p>
      </header>

      {(error || notice) && (
        <div className={`mb-4 rounded-lg border p-3 text-sm ${error ? "border-red-300 text-red-700" : "border-green-300 text-green-700"}`} role={error ? "alert" : "status"}>
          {error || notice}
        </div>
      )}

      <div className="grid grid-row-2 gap-3 ">
        <nav aria-label="Settings sections" className="h-fit  rounded-xl border border-[var(--border)] bg-[var(--background)] p-2 flex flex-wrap gap-3">
          {settingMenus.map(({ name, icon: Icon }) => {
            const active = activeMenu === name;
            return (
              <Button
                key={name}
                variant="secondary"
                aria-current={active ? "page" : undefined}
                onClick={() => {
                  setActiveMenu(name);
                  setError("");
                  setNotice("");
                }}
                className={`min-w-[clamp(130px,18%,100%)] flex-1  justify-start text-left ${active ? "text-[var(--primary)]!" : ""}`}
              >
                <Icon size={17} className={active ? "text-[var(--primary)]" : "text-[var(--text-muted)]"} />
                <span className="truncate">{name}</span>
              </Button>
            );
          })}
        </nav>

        <section className="min-w-0">
          <SettingsPanel
            activeMenu={activeMenu}
            settings={settings}
            users={users}
            saving={saving}
            onSave={saveSection}
            onDeleteUser={(id) => void deleteUser(id)}
          />
        </section>
      </div>
    </main>
  );
}