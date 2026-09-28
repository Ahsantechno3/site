"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Copy,
  Eye,
  EyeOff,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import Button from "@/c2/ui/Button";
import {
  SettingsCard,
  SettingsInput,
  SettingsSaveButton,
  SettingsSectionTitle,
  SettingsSelect,
  SettingsToggle,
} from "./SettingsControls";
import type {
  SettingsDocument,
  SettingsSection,
  SettingsUser,
} from "@/services/settingsService";

type ObjectData = Record<string, unknown>;
type SectionPanelProps<T> = {
  data?: T;
  saving: boolean;
  onSave: (value: T) => void;
};

type PaymentMethod = { name: string; description: string; enabled: boolean };
type ShippingZone = { name: string; regions: string[]; rate: number; isActive: boolean };
type Webhook = { event: string; url: string; isActive: boolean };
type Integration = { name: string; description: string; isConnected: boolean };

export function SettingsPanel({
  activeMenu,
  settings,
  users,
  saving,
  onSave,
  onDeleteUser,
}: {
  activeMenu: string;
  settings: SettingsDocument;
  users: SettingsUser[];
  saving: boolean;
  onSave: (section: SettingsSection, value: unknown) => void;
  onDeleteUser: (id: string) => void;
}) {
  switch (activeMenu) {
    case "General":
      return <GeneralPanel data={settings.general} saving={saving} onSave={(value) => onSave("general", value)} />;
    case "Store Information":
      return <StorePanel data={settings.storeInfo} saving={saving} onSave={(value) => onSave("storeInfo", value)} />;
    case "Payment Methods":
      return <PaymentPanel data={settings.paymentMethods} saving={saving} onSave={(value) => onSave("paymentMethods", value)} />;
    case "Shipping":
      return <ShippingPanel data={settings.shipping} saving={saving} onSave={(value) => onSave("shipping", value)} />;
    case "Notifications":
      return <NotificationsPanel data={settings.notifications} saving={saving} onSave={(value) => onSave("notifications", value)} />;
    case "Users & Roles":
      return <UsersPanel users={users} onDeleteUser={onDeleteUser} />;
    case "Security":
      return <SecurityPanel />;
    case "API Settings":
      return <ApiPanel data={settings.apiSettings} saving={saving} onSave={(value) => onSave("apiSettings", value)} />;
    case "Integrations":
      return <IntegrationsPanel data={settings.integrations} saving={saving} onSave={(value) => onSave("integrations", value)} />;
    case "Appearance":
      return <AppearancePanel data={settings.appearance} saving={saving} onSave={(value) => onSave("appearance", value)} />;
    default:
      return null;
  }
}

function GeneralPanel({ data, saving, onSave }: SectionPanelProps<ObjectData>) {
  const [form, setForm] = useState(() => ({
    storeName: String(data?.storeName ?? ""),
    storeTagline: String(data?.storeTagline ?? ""),
    storeEmail: String(data?.storeEmail ?? ""),
    phone: String(data?.phone ?? ""),
    timeZone: String(data?.timeZone ?? ""),
    language: String(data?.language ?? ""),
    logo: String(data?.logo ?? ""),
  }));

  return (
    <SettingsCard title="General Settings" description="Basic information about your store">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SettingsInput label="Store Name" value={form.storeName} onChange={(event) => setForm({ ...form, storeName: event.target.value })} />
        <SettingsInput label="Store Tagline" value={form.storeTagline} onChange={(event) => setForm({ ...form, storeTagline: event.target.value })} />
        <SettingsInput label="Store Email" type="email" value={form.storeEmail} onChange={(event) => setForm({ ...form, storeEmail: event.target.value })} />
        <SettingsInput label="Phone Number" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        <SettingsSelect label="Time Zone" value={form.timeZone} options={["(GMT+05:00) Pakistan Standard Time", "(GMT+00:00) UTC"]} onChange={(timeZone) => setForm({ ...form, timeZone })} />
        <SettingsSelect label="Language" value={form.language} options={["English", "Urdu"]} onChange={(language) => setForm({ ...form, language })} />
        <SettingsInput label="Store Logo URL" value={form.logo} onChange={(event) => setForm({ ...form, logo: event.target.value })} />
      </div>
      {form.logo && <Image src={form.logo} alt="Store logo preview" width={64} height={64} unoptimized className="mt-5 rounded-lg border border-[var(--border)] object-contain" />}
      <SettingsSaveButton onSave={() => onSave(form)} saving={saving} />
    </SettingsCard>
  );
}

function StorePanel({ data, saving, onSave }: SectionPanelProps<ObjectData>) {
  const currentAddress = (data?.address ?? {}) as ObjectData;
  const [form, setForm] = useState(() => ({
    businessName: String(data?.businessName ?? ""),
    businessType: String(data?.businessType ?? ""),
    taxId: String(data?.taxId ?? ""),
    website: String(data?.website ?? ""),
    address: {
      addressLine1: String(currentAddress.addressLine1 ?? ""),
      addressLine2: String(currentAddress.addressLine2 ?? ""),
      city: String(currentAddress.city ?? ""),
      state: String(currentAddress.state ?? ""),
      postalCode: String(currentAddress.postalCode ?? ""),
      country: String(currentAddress.country ?? ""),
    },
  }));
  const updateAddress = (field: keyof typeof form.address, value: string) =>
    setForm({ ...form, address: { ...form.address, [field]: value } });

  return (
    <SettingsCard title="Store Information" description="Update your business details and address">
      <SettingsSectionTitle title="Business Details" />
      <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SettingsInput label="Business Name" value={form.businessName} onChange={(event) => setForm({ ...form, businessName: event.target.value })} />
        <SettingsSelect label="Business Type" value={form.businessType} options={["Retail Store", "Wholesale", "Marketplace"]} onChange={(businessType) => setForm({ ...form, businessType })} />
        <SettingsInput label="Tax ID / VAT Number" value={form.taxId} onChange={(event) => setForm({ ...form, taxId: event.target.value })} />
        <SettingsInput label="Website" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} />
      </div>
      <div className="mt-6 border-t border-[var(--border)] pt-6">
        <SettingsSectionTitle title="Address" />
        <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SettingsInput label="Address Line 1" value={form.address.addressLine1} onChange={(event) => updateAddress("addressLine1", event.target.value)} />
          <SettingsInput label="Address Line 2" value={form.address.addressLine2} onChange={(event) => updateAddress("addressLine2", event.target.value)} />
          <SettingsInput label="City" value={form.address.city} onChange={(event) => updateAddress("city", event.target.value)} />
          <SettingsInput label="State / Province" value={form.address.state} onChange={(event) => updateAddress("state", event.target.value)} />
          <SettingsInput label="Postal Code" value={form.address.postalCode} onChange={(event) => updateAddress("postalCode", event.target.value)} />
          <SettingsInput label="Country" value={form.address.country} onChange={(event) => updateAddress("country", event.target.value)} />
        </div>
      </div>
      <SettingsSaveButton onSave={() => onSave(form)} saving={saving} />
    </SettingsCard>
  );
}

function PaymentPanel({ data, saving, onSave }: SectionPanelProps<Array<Record<string, unknown>>>) {
  const [methods, setMethods] = useState<PaymentMethod[]>(() =>
    (data ?? []).map((method) => ({
      name: String(method.name ?? ""),
      description: String(method.description ?? ""),
      enabled: Boolean(method.enabled),
    })),
  );
  const updateMethod = (index: number, patch: Partial<PaymentMethod>) =>
    setMethods(methods.map((method, itemIndex) => itemIndex === index ? { ...method, ...patch } : method));

  return (
    <SettingsCard title="Payment Methods" description="Manage saved payment methods">
      <div className="space-y-3">
        {methods.map((method, index) => (
          <div key={`${method.name}-${index}`} className="grid grid-cols-1 items-end gap-3 rounded-lg border border-[var(--border)] p-4 sm:grid-cols-[1fr_1fr_auto_auto]">
            <SettingsInput label="Method" value={method.name} onChange={(event) => updateMethod(index, { name: event.target.value })} />
            <SettingsInput label="Description" value={method.description} onChange={(event) => updateMethod(index, { description: event.target.value })} />
            <SettingsToggle label={`Enable ${method.name || "payment method"}`} enabled={method.enabled} onChange={(enabled) => updateMethod(index, { enabled })} />
            <Button variant="danger" icon={Trash2} aria-label="Remove payment method" onClick={() => setMethods(methods.filter((_, itemIndex) => itemIndex !== index))} />
          </div>
        ))}
        {methods.length === 0 && <p className="text-sm text-[var(--text-muted)]">No payment methods have been configured.</p>}
        <Button variant="outline" icon={Plus} onClick={() => setMethods([...methods, { name: "", description: "", enabled: false }])}>Add payment method</Button>
      </div>
      <SettingsSaveButton onSave={() => onSave(methods)} saving={saving} />
    </SettingsCard>
  );
}

function ShippingPanel({ data, saving, onSave }: SectionPanelProps<ObjectData>) {
  const zonesData = Array.isArray(data?.zones) ? data.zones as ObjectData[] : [];
  const [zones, setZones] = useState<ShippingZone[]>(() => zonesData.map((zone) => ({
    name: String(zone.name ?? ""),
    regions: Array.isArray(zone.regions) ? zone.regions.map(String) : [],
    rate: Number(zone.rate ?? 0),
    isActive: zone.isActive !== false,
  })));
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(String(data?.freeShippingThreshold ?? ""));
  const [defaultShippingMethod, setDefaultShippingMethod] = useState(String(data?.defaultShippingMethod ?? ""));
  const updateZone = (index: number, patch: Partial<ShippingZone>) =>
    setZones(zones.map((zone, itemIndex) => itemIndex === index ? { ...zone, ...patch } : zone));

  return (
    <SettingsCard title="Shipping" description="Manage stored shipping zones and rates">
      <div className="space-y-3">
        {zones.map((zone, index) => (
          <div key={`${zone.name}-${index}`} className="grid grid-cols-1 gap-3 rounded-lg border border-[var(--border)] p-4 md:grid-cols-4">
            <SettingsInput label="Zone" value={zone.name} onChange={(event) => updateZone(index, { name: event.target.value })} />
            <SettingsInput label="Regions (comma separated)" value={zone.regions.join(", ")} onChange={(event) => updateZone(index, { regions: event.target.value.split(",").map((region) => region.trim()).filter(Boolean) })} />
            <SettingsInput label="Rate" type="number" min="0" step="0.01" value={zone.rate} onChange={(event) => updateZone(index, { rate: Number(event.target.value) })} />
            <div className="flex items-end justify-between gap-3 pb-2">
              <SettingsToggle label={`Enable ${zone.name || "shipping zone"}`} enabled={zone.isActive} onChange={(isActive) => updateZone(index, { isActive })} />
              <Button variant="danger" icon={Trash2} aria-label="Remove shipping zone" onClick={() => setZones(zones.filter((_, itemIndex) => itemIndex !== index))} />
            </div>
          </div>
        ))}
        {zones.length === 0 && <p className="text-sm text-[var(--text-muted)]">No shipping zones have been configured.</p>}
        <Button variant="outline" icon={Plus} onClick={() => setZones([...zones, { name: "", regions: [], rate: 0, isActive: true }])}>Add shipping zone</Button>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <SettingsInput label="Free Shipping Threshold" type="number" min="0" step="0.01" value={freeShippingThreshold} onChange={(event) => setFreeShippingThreshold(event.target.value)} />
        <SettingsSelect label="Default Shipping Method" value={defaultShippingMethod} options={["Standard Shipping", "Express Shipping"]} onChange={setDefaultShippingMethod} />
      </div>
      <SettingsSaveButton onSave={() => onSave({ zones, freeShippingThreshold, defaultShippingMethod })} saving={saving} />
    </SettingsCard>
  );
}

const notificationFields = [
  ["newOrder", "New Order Notifications", "Get notified when a new order is placed"],
  ["lowStock", "Low Stock Alerts", "Get notified when product stock is low"],
  ["customerMessages", "Customer Messages", "Get notified when a customer sends a message"],
  ["marketingUpdates", "Marketing Updates", "Receive store updates and promotions"],
  ["systemNotifications", "System Notifications", "Get notified about system events"],
] as const;

function NotificationsPanel({ data, saving, onSave }: SectionPanelProps<ObjectData>) {
  const [values, setValues] = useState(() => Object.fromEntries(
    notificationFields.map(([key]) => [key, Boolean(data?.[key])]),
  ) as Record<(typeof notificationFields)[number][0], boolean>);

  return (
    <SettingsCard title="Notifications" description="Manage notification preferences">
      <div className="space-y-3">
        {notificationFields.map(([key, title, description]) => (
          <div key={key} className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border)] p-4">
            <div>
              <h3 className="text-sm font-medium text-[var(--text)]">{title}</h3>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{description}</p>
            </div>
            <SettingsToggle label={title} enabled={values[key]} onChange={(enabled) => setValues({ ...values, [key]: enabled })} />
          </div>
        ))}
      </div>
      <SettingsSaveButton onSave={() => onSave(values)} saving={saving} />
    </SettingsCard>
  );
}

function UsersPanel({ users, onDeleteUser }: { users: SettingsUser[]; onDeleteUser: (id: string) => void }) {
  return (
    <SettingsCard title="Users & Roles" description="Users currently stored in the database">
      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-[var(--surface)] text-xs text-[var(--text-muted)]"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3" /></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 font-medium text-[var(--text)]">{[user.firstName, user.lastName].filter(Boolean).join(" ") || user.name || "Unnamed user"}</td>
                <td className="px-4 py-3 text-[var(--text-soft)]">{user.email}</td>
                <td className="px-4 py-3 text-[var(--text-soft)]">{user.role || "—"}</td>
                <td className="px-4 py-3">{user.isActive === false ? "Inactive" : "Active"}</td>
                <td className="px-4 py-3 text-right"><Button variant="danger" size="sm" icon={Trash2} aria-label={`Delete ${user.email}`} onClick={() => onDeleteUser(user._id)} /></td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">No users found.</td></tr>}
          </tbody>
        </table>
      </div>
    </SettingsCard>
  );
}

function SecurityPanel() {
  return (
    <SettingsCard title="Security" description="Authentication controls">
      <div className="flex items-start gap-3 rounded-lg border border-[var(--border)] p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-[var(--primary)]" />
        <p className="text-sm text-[var(--text-muted)]">Password changes and two-factor authentication are not available through the current Settings API.</p>
      </div>
    </SettingsCard>
  );
}

function ApiPanel({ data, saving, onSave }: SectionPanelProps<ObjectData>) {
  const webhooksData = Array.isArray(data?.webhooks) ? data.webhooks as ObjectData[] : [];
  const [publicKey, setPublicKey] = useState(String(data?.publicKey ?? ""));
  const [secretKey, setSecretKey] = useState(String(data?.secretKey ?? ""));
  const [showSecret, setShowSecret] = useState(false);
  const [webhooks, setWebhooks] = useState<Webhook[]>(() => webhooksData.map((webhook) => ({
    event: String(webhook.event ?? ""),
    url: String(webhook.url ?? ""),
    isActive: webhook.isActive !== false,
  })));
  const copyValue = (value: string) => {
    if (value) void navigator.clipboard.writeText(value);
  };
  const updateWebhook = (index: number, patch: Partial<Webhook>) =>
    setWebhooks(webhooks.map((webhook, itemIndex) => itemIndex === index ? { ...webhook, ...patch } : webhook));

  return (
    <SettingsCard title="API Settings" description="Manage API keys and webhook endpoints stored in settings">
      <SettingsSectionTitle title="API Keys" />
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex items-end gap-2">
          <SettingsInput className="min-w-0 flex-1" label="Public API Key" value={publicKey} onChange={(event) => setPublicKey(event.target.value)} />
          <Button variant="outline" icon={Copy} aria-label="Copy public API key" disabled={!publicKey} onClick={() => copyValue(publicKey)} />
        </div>
        <div className="flex items-end gap-2">
          <SettingsInput className="min-w-0 flex-1" label="Secret API Key" type={showSecret ? "text" : "password"} value={secretKey} onChange={(event) => setSecretKey(event.target.value)} />
          <Button variant="outline" icon={showSecret ? EyeOff : Eye} aria-label={showSecret ? "Hide secret key" : "Show secret key"} onClick={() => setShowSecret(!showSecret)} />
        </div>
      </div>
      <div className="mt-7 border-t border-[var(--border)] pt-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <SettingsSectionTitle title="Webhooks" />
          <Button variant="outline" icon={Plus} onClick={() => setWebhooks([...webhooks, { event: "", url: "", isActive: true }])}>Add webhook</Button>
        </div>
        <div className="space-y-3">
          {webhooks.map((webhook, index) => (
            <div key={`${webhook.event}-${index}`} className="grid grid-cols-1 items-end gap-3 rounded-lg border border-[var(--border)] p-4 md:grid-cols-[1fr_2fr_auto_auto]">
              <SettingsInput label="Event" value={webhook.event} onChange={(event) => updateWebhook(index, { event: event.target.value })} />
              <SettingsInput label="URL" type="url" value={webhook.url} onChange={(event) => updateWebhook(index, { url: event.target.value })} />
              <SettingsToggle label={`Enable ${webhook.event || "webhook"}`} enabled={webhook.isActive} onChange={(isActive) => updateWebhook(index, { isActive })} />
              <Button variant="danger" icon={Trash2} aria-label="Remove webhook" onClick={() => setWebhooks(webhooks.filter((_, itemIndex) => itemIndex !== index))} />
            </div>
          ))}
          {webhooks.length === 0 && <p className="text-sm text-[var(--text-muted)]">No webhooks configured.</p>}
        </div>
      </div>
      <SettingsSaveButton onSave={() => onSave({ publicKey, secretKey, webhooks })} saving={saving} />
    </SettingsCard>
  );
}

function IntegrationsPanel({ data, saving, onSave }: SectionPanelProps<Array<Record<string, unknown>>>) {
  const [integrations, setIntegrations] = useState<Integration[]>(() => (data ?? []).map((item) => ({
    name: String(item.name ?? ""),
    description: String(item.description ?? ""),
    isConnected: Boolean(item.isConnected),
  })));
  const updateIntegration = (index: number, patch: Partial<Integration>) =>
    setIntegrations(integrations.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));

  return (
    <SettingsCard title="Integrations" description="Manage integrations saved in your database">
      <div className="space-y-3">
        {integrations.map((item, index) => (
          <div key={`${item.name}-${index}`} className="grid grid-cols-1 items-end gap-3 rounded-lg border border-[var(--border)] p-4 md:grid-cols-[1fr_2fr_auto_auto]">
            <SettingsInput label="Integration" value={item.name} onChange={(event) => updateIntegration(index, { name: event.target.value })} />
            <SettingsInput label="Description" value={item.description} onChange={(event) => updateIntegration(index, { description: event.target.value })} />
            <SettingsToggle label={`Connect ${item.name || "integration"}`} enabled={item.isConnected} onChange={(isConnected) => updateIntegration(index, { isConnected })} />
            <Button variant="danger" icon={Trash2} aria-label="Remove integration" onClick={() => setIntegrations(integrations.filter((_, itemIndex) => itemIndex !== index))} />
          </div>
        ))}
        {integrations.length === 0 && <p className="text-sm text-[var(--text-muted)]">No integrations configured.</p>}
        <Button variant="outline" icon={Plus} onClick={() => setIntegrations([...integrations, { name: "", description: "", isConnected: false }])}>Add integration</Button>
      </div>
      <SettingsSaveButton onSave={() => onSave(integrations)} saving={saving} />
    </SettingsCard>
  );
}

function AppearancePanel({ data, saving, onSave }: SectionPanelProps<ObjectData>) {
  const [form, setForm] = useState({
    theme: String(data?.theme ?? "Light"),
    compactSidebar: Boolean(data?.compactSidebar),
    showBreadcrumbs: data?.showBreadcrumbs !== false,
    enableAnimations: data?.enableAnimations !== false,
  });
  const setBoolean = (key: "compactSidebar" | "showBreadcrumbs" | "enableAnimations", value: boolean) =>
    setForm({ ...form, [key]: value });

  return (
    <SettingsCard title="Appearance" description="Customize saved dashboard preferences">
      <SettingsSelect label="Theme" value={form.theme} options={["Light", "Dark", "System"]} onChange={(theme) => setForm({ ...form, theme })} />
      <div className="mt-5 space-y-3">
        {([
          ["compactSidebar", "Compact Sidebar", "Use a smaller navigation sidebar"],
          ["showBreadcrumbs", "Show Page Breadcrumbs", "Display breadcrumbs at the top of pages"],
          ["enableAnimations", "Animations", "Enable interface animations"],
        ] as const).map(([key, title, description]) => (
          <div key={key} className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border)] p-4">
            <div><h3 className="text-sm font-medium text-[var(--text)]">{title}</h3><p className="mt-1 text-xs text-[var(--text-muted)]">{description}</p></div>
            <SettingsToggle label={title} enabled={form[key]} onChange={(enabled) => setBoolean(key, enabled)} />
          </div>
        ))}
      </div>
      <SettingsSaveButton onSave={() => onSave(form)} saving={saving} />
    </SettingsCard>
  );
}