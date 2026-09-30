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

interface Pro {
  id: string; name: string; type: string; specialization: string;
  upazilaId: string; address: string; phone: string;
  hours: string; experience: string; isVerified: boolean;
}

// Teacher type is moved here from Education
const typeOptions = [
  { value: "lawyer",     label: "আইনজীবী"     },
  { value: "journalist", label: "সাংবাদিক"     },
  { value: "technician", label: "টেকনিশিয়ান"  },
  { value: "kazi",       label: "কাজি অফিস"    },
  { value: "teacher",    label: "শিক্ষক"        },  // ← moved from Education
  { value: "other",      label: "অন্যান্য"      },
];

const typeBadge: Record<string, string> = {
  lawyer:     "bg-red-50 text-red-700",
  journalist: "bg-blue-50 text-blue-700",
  technician: "bg-purple-50 text-purple-700",
  kazi:       "bg-pink-50 text-pink-700",
  teacher:    "bg-rose-50 text-rose-700",
  other:      "bg-gray-100 text-gray-600",
};

const empty = (): Omit<Pro, "id"> => ({
  name: "", type: "lawyer", specialization: "",
  upazilaId: "tangail_sadar", address: "",
  phone: "", hours: "", experience: "", isVerified: false,
});

const columns: Column<Pro>[] = [
  { key: "name",       label: "নাম",       render: r => <span className="font-semibold">{r.name}</span> },
  { key: "type",       label: "পেশা",      render: r => <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadge[r.type] ?? "bg-gray-100 text-gray-600"}`}>{typeOptions.find(t => t.value === r.type)?.label ?? r.type}</span> },
  { key: "specialization", label: "বিশেষজ্ঞতা", render: r => <span className="text-sm text-gray-500">{r.specialization || "—"}</span> },
  { key: "phone",      label: "ফোন",       render: r => <span className="text-green-700 text-sm">{r.phone || "—"}</span> },
  { key: "upazilaId",  label: "উপজেলা",   render: r => <span className="text-gray-500 text-sm">{UPAZILAS.find(u => u.id === r.upazilaId)?.name ?? r.upazilaId}</span> },
  { key: "isVerified", label: "ভেরিফাইড", render: r => r.isVerified ? <BadgeCheck size={16} className="text-green-500" /> : <span className="text-gray-300 text-xs">না</span> },
];

export default function AdminProfessionalsPage() {
  const [data, setData]         = useState<Pro[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modal, setModal]       = useState<"add"|"edit"|"delete"|null>(null);
  const [selected, setSelected] = useState<Pro | null>(null);
  const [form, setForm]         = useState(empty());
  const [saving, setSaving]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setData(await adminGetAll<Pro>("professionals", "name"));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const filtered = data.filter(p =>
    (!search || p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.specialization?.toLowerCase().includes(search.toLowerCase())) &&
    (typeFilter === "all" || p.type === typeFilter)
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal === "add") await adminAdd("professionals", form);
      else if (selected) await adminUpdate("professionals", selected.id, form);
      await load(); setModal(null);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try { await adminDelete("professionals", selected.id); await load(); setModal(null); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <AdminPageHeader
        total={filtered.length} label="পেশাদার"
        searchValue={search} onSearch={setSearch}
        onAdd={() => { setForm(empty()); setModal("add"); }}
        addLabel="যোগ করুন"
      />

      {/* Type filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[{ value: "all", label: "সব" }, ...typeOptions].map(t => (
          <button key={t.value}
            onClick={() => setTypeFilter(t.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors
              ${typeFilter === t.value ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <AdminTable columns={columns} data={filtered} loading={loading}
        onEdit={r => { setSelected(r); setForm({ ...r }); setModal("edit"); }}
        onDelete={r => { setSelected(r); setModal("delete"); }}
        emptyMessage="কেউ পাওয়া যায়নি" />

      <AdminModal open={modal === "add" || modal === "edit"} onClose={() => setModal(null)}
        title={modal === "add" ? "নতুন পেশাদার যোগ করুন" : "পেশাদার সম্পাদনা"} size="md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminFormField type="text" label="নাম" required value={form.name} onChange={v => set("name", v)}
            placeholder="অ্যাডভোকেট / ডাক্তার / শিক্ষক..." />
          <AdminFormField type="select" label="পেশা" required value={form.type} onChange={v => set("type", v)}
            options={typeOptions} />
          <AdminFormField type="text" label="বিশেষজ্ঞতা / বিষয়" value={form.specialization} onChange={v => set("specialization", v)}
            placeholder={form.type === "teacher" ? "গণিত, বিজ্ঞান..." : "ফৌজদারি আইন..."} />
          <AdminFormField type="select" label="উপজেলা" value={form.upazilaId} onChange={v => set("upazilaId", v)}
            options={[...UPAZILAS].map(u => ({ value: u.id, label: u.name }))} />
          <AdminFormField type="tel"  label="ফোন নম্বর" required value={form.phone} onChange={v => set("phone", v)} placeholder="01XXXXXXXXX" />
          <AdminFormField type="text" label="সময়সূচি" value={form.hours} onChange={v => set("hours", v)}
            placeholder="সকাল ৯টা - বিকেল ৫টা" />
          <div className="sm:col-span-2">
            <AdminFormField type="text" label="ঠিকানা" required value={form.address} onChange={v => set("address", v)} />
          </div>
          <AdminFormField type="text" label="অভিজ্ঞতা" value={form.experience} onChange={v => set("experience", v)}
            placeholder="১০ বছর" />
          <AdminFormField type="toggle" label="ভেরিফাইড" value={form.isVerified} onChange={v => set("isVerified", v)} />
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setModal(null)}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold">বাতিল</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {modal === "add" ? "যোগ করুন" : "আপডেট করুন"}
          </button>
        </div>
      </AdminModal>

      <AdminModal open={modal === "delete"} onClose={() => setModal(null)} title="মুছুন" size="sm">
        <DeleteConfirm itemName={selected?.name ?? ""} onConfirm={handleDelete} onCancel={() => setModal(null)} loading={saving} />
      </AdminModal>
    </div>
  );
}
