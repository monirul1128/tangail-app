"use client";
import { useState, useEffect, useCallback } from "react";
import { adminGetAll, adminAdd, adminUpdate, adminDelete } from "@/lib/adminFirestore";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormField from "@/components/admin/AdminFormField";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { UPAZILAS } from "@/lib/constants";
import { BadgeCheck } from "lucide-react";

interface ElectricityOffice {
  id: string;
  name: string;
  type: string;
  upazilaId: string;
  address: string;
  phone: string;
  phone2: string;
  hours: string;
  isVerified: boolean;
  complaintNumber: string;
}

const typeOpts = [
  { value: "pbs",   label: "পল্লী বিদ্যুৎ"        },
  { value: "bpdb",  label: "বিদ্যুৎ উন্নয়ন বোর্ড" },
  { value: "desco", label: "DESCO"                 },
  { value: "other", label: "অন্যান্য"               },
];

const empty = (): Omit<ElectricityOffice, "id"> => ({
  name: "", type: "pbs", upazilaId: "tangail_sadar",
  address: "", phone: "", phone2: "",
  hours: "রবি-বৃহস্পতি, সকাল ৯টা - বিকেল ৫টা",
  isVerified: false, complaintNumber: "",
});

const columns: Column<ElectricityOffice>[] = [
  { key: "name",      label: "অফিসের নাম",  render: r => <span className="font-semibold">{r.name}</span> },
  { key: "type",      label: "ধরন",          render: r => <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{typeOpts.find(t => t.value === r.type)?.label ?? r.type}</span> },
  { key: "phone",     label: "ফোন",          render: r => <span className="text-green-700 text-sm">{r.phone || "—"}</span> },
  { key: "upazilaId", label: "উপজেলা",      render: r => <span className="text-gray-500 text-sm">{UPAZILAS.find(u => u.id === r.upazilaId)?.name ?? r.upazilaId}</span> },
  { key: "complaintNumber", label: "অভিযোগ নম্বর", render: r => <span className="text-sm font-semibold text-primary">{r.complaintNumber || "—"}</span> },
  { key: "isVerified", label: "ভেরিফাইড",   render: r => r.isVerified ? <BadgeCheck size={16} className="text-green-500" /> : <span className="text-gray-300 text-xs">না</span> },
];

export default function AdminElectricityPage() {
  const [data, setData]         = useState<ElectricityOffice[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState<"add"|"edit"|"delete"|null>(null);
  const [selected, setSelected] = useState<ElectricityOffice | null>(null);
  const [form, setForm]         = useState(empty());
  const [saving, setSaving]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await adminGetAll<ElectricityOffice>("electricity_offices", "name"));
    } catch (e) {
      console.warn("electricity load error", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const filtered = data.filter(e =>
    !search ||
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.phone?.includes(search)
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal === "add") await adminAdd("electricity_offices", form);
      else if (selected) await adminUpdate("electricity_offices", selected.id, form);
      await load();
      setModal(null);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await adminDelete("electricity_offices", selected.id);
      await load();
      setModal(null);
    } finally { setSaving(false); }
  };

  return (
    <div>
      <AdminPageHeader
        total={filtered.length}
        label="বিদ্যুৎ অফিস"
        searchValue={search}
        onSearch={setSearch}
        onAdd={() => { setForm(empty()); setModal("add"); }}
        addLabel="অফিস যোগ করুন"
      />

      <AdminTable
        columns={columns}
        data={filtered}
        loading={loading}
        onEdit={r => { setSelected(r); setForm({ ...r }); setModal("edit"); }}
        onDelete={r => { setSelected(r); setModal("delete"); }}
        emptyMessage="কোনো বিদ্যুৎ অফিস পাওয়া যায়নি"
      />

      {/* Add / Edit Modal */}
      <AdminModal
        open={modal === "add" || modal === "edit"}
        onClose={() => setModal(null)}
        title={modal === "add" ? "নতুন বিদ্যুৎ অফিস যোগ করুন" : "বিদ্যুৎ অফিস সম্পাদনা"}
        size="md"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <AdminFormField
              type="text"
              label="অফিসের নাম"
              required
              value={form.name}
              onChange={v => set("name", v)}
              placeholder="পল্লী বিদ্যুৎ সমিতি, টাঙ্গাইল"
            />
          </div>
          <AdminFormField
            type="select"
            label="ধরন"
            value={form.type}
            onChange={v => set("type", v)}
            options={typeOpts}
          />
          <AdminFormField
            type="select"
            label="উপজেলা"
            value={form.upazilaId}
            onChange={v => set("upazilaId", v)}
            options={[...UPAZILAS].map(u => ({ value: u.id, label: u.name }))}
          />
          <div className="sm:col-span-2">
            <AdminFormField
              type="text"
              label="ঠিকানা"
              required
              value={form.address}
              onChange={v => set("address", v)}
            />
          </div>
          <AdminFormField
            type="tel"
            label="মূল ফোন নম্বর"
            required
            value={form.phone}
            onChange={v => set("phone", v)}
            placeholder="01XXXXXXXXX"
          />
          <AdminFormField
            type="tel"
            label="বিকল্প ফোন"
            value={form.phone2}
            onChange={v => set("phone2", v)}
            placeholder="01XXXXXXXXX"
          />
          <AdminFormField
            type="text"
            label="অভিযোগ নম্বর"
            value={form.complaintNumber}
            onChange={v => set("complaintNumber", v)}
            placeholder="16999 / 1622"
            hint="বিদ্যুৎ অভিযোগ গ্রহণ নম্বর"
          />
          <AdminFormField
            type="text"
            label="সময়"
            value={form.hours}
            onChange={v => set("hours", v)}
          />
          <div className="sm:col-span-2">
            <AdminFormField
              type="toggle"
              label="ভেরিফাইড"
              value={form.isVerified}
              onChange={v => set("isVerified", v)}
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setModal(null)}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold"
          >
            বাতিল
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {modal === "add" ? "যোগ করুন" : "আপডেট করুন"}
          </button>
        </div>
      </AdminModal>

      {/* Delete Modal */}
      <AdminModal open={modal === "delete"} onClose={() => setModal(null)} title="বিদ্যুৎ অফিস মুছুন" size="sm">
        <DeleteConfirm
          itemName={selected?.name ?? ""}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
          loading={saving}
        />
      </AdminModal>
    </div>
  );
}
