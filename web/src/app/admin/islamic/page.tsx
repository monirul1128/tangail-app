"use client";
import { useState, useEffect, useCallback } from "react";
import { adminGetAll, adminAdd, adminUpdate, adminDelete } from "@/lib/adminFirestore";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormField from "@/components/admin/AdminFormField";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import ImageUpload from "@/components/admin/ImageUpload";
import { UPAZILAS } from "@/lib/constants";
import { BadgeCheck } from "lucide-react";

interface ReligiousPlace {
  id: string;
  name: string;
  type: string;
  upazilaId: string;
  address: string;
  phone: string;
  note: string;
  imageUrl: string;
  isVerified: boolean;
  isHistoric: boolean;
}

const typeOpts = [
  { value: "mosque",  label: "মসজিদ"   },
  { value: "temple",  label: "মন্দির"   },
  { value: "mazar",   label: "মাজার"    },
  { value: "church",  label: "চার্চ"    },
  { value: "other",   label: "অন্যান্য" },
];

const typeBadge: Record<string, string> = {
  mosque:  "bg-emerald-50 text-emerald-700",
  temple:  "bg-orange-50 text-orange-700",
  mazar:   "bg-purple-50 text-purple-700",
  church:  "bg-blue-50 text-blue-700",
  other:   "bg-gray-100 text-gray-600",
};

const empty = (): Omit<ReligiousPlace, "id"> => ({
  name: "", type: "mosque", upazilaId: "tangail_sadar",
  address: "", phone: "", note: "", imageUrl: "",
  isVerified: false, isHistoric: false,
});

const columns: Column<ReligiousPlace>[] = [
  { key: "name",      label: "নাম",       render: r => <span className="font-semibold">{r.name}</span> },
  { key: "type",      label: "ধরন",       render: r => <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadge[r.type] ?? ""}`}>{typeOpts.find(t => t.value === r.type)?.label ?? r.type}</span> },
  { key: "upazilaId", label: "উপজেলা",   render: r => <span className="text-gray-500 text-sm">{UPAZILAS.find(u => u.id === r.upazilaId)?.name ?? r.upazilaId}</span> },
  { key: "isHistoric",label: "ঐতিহাসিক", render: r => r.isHistoric ? <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">ঐতিহাসিক</span> : <span className="text-gray-300 text-xs">সাধারণ</span> },
  { key: "isVerified",label: "ভেরিফাইড", render: r => r.isVerified ? <BadgeCheck size={16} className="text-green-500" /> : <span className="text-gray-300 text-xs">না</span> },
];

export default function AdminIslamicPage() {
  const [data, setData]         = useState<ReligiousPlace[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState<"add"|"edit"|"delete"|null>(null);
  const [selected, setSelected] = useState<ReligiousPlace | null>(null);
  const [form, setForm]         = useState(empty());
  const [saving, setSaving]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setData(await adminGetAll<ReligiousPlace>("islamic_places", "name"));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const filtered = data.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.address?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal === "add") await adminAdd("islamic_places", form);
      else if (selected) await adminUpdate("islamic_places", selected.id, form);
      await load();
      setModal(null);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await adminDelete("islamic_places", selected.id);
      await load();
      setModal(null);
    } finally { setSaving(false); }
  };

  return (
    <div>
      <AdminPageHeader
        total={filtered.length}
        label="ধর্মীয় সেবা"
        searchValue={search}
        onSearch={setSearch}
        onAdd={() => { setForm(empty()); setModal("add"); }}
        addLabel="যোগ করুন"
      />

      <AdminTable
        columns={columns}
        data={filtered}
        loading={loading}
        onEdit={r => { setSelected(r); setForm({ ...r }); setModal("edit"); }}
        onDelete={r => { setSelected(r); setModal("delete"); }}
        emptyMessage="কোনো ধর্মীয় স্থান পাওয়া যায়নি"
      />

      {/* Add / Edit Modal */}
      <AdminModal
        open={modal === "add" || modal === "edit"}
        onClose={() => setModal(null)}
        title={modal === "add" ? "নতুন ধর্মীয় স্থান যোগ করুন" : "ধর্মীয় স্থান সম্পাদনা"}
        size="lg"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <AdminFormField
              type="text"
              label="নাম"
              required
              value={form.name}
              onChange={v => set("name", v)}
              placeholder="মসজিদ / মন্দিরের নাম"
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
            type="text"
            label="ফোন নম্বর"
            value={form.phone}
            onChange={v => set("phone", v)}
            placeholder="01XXXXXXXXX"
          />
          <AdminFormField
            type="text"
            label="বিশেষ নোট"
            value={form.note}
            onChange={v => set("note", v)}
            placeholder="যেমন: ১৬০৯ খ্রি. নির্মিত"
          />
          <div className="sm:col-span-2">
            <ImageUpload
              value={form.imageUrl}
              onChange={v => set("imageUrl", v)}
              folder="religious"
              label="ছবি আপলোড করুন"
            />
          </div>
          <AdminFormField
            type="toggle"
            label="ঐতিহাসিক স্থান"
            value={form.isHistoric}
            onChange={v => set("isHistoric", v)}
          />
          <AdminFormField
            type="toggle"
            label="ভেরিফাইড"
            value={form.isVerified}
            onChange={v => set("isVerified", v)}
          />
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
      <AdminModal open={modal === "delete"} onClose={() => setModal(null)} title="মুছুন" size="sm">
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
