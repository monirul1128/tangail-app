"use client";
import { useState, useEffect, useCallback } from "react";
import { adminGetAll, adminAdd, adminUpdate, adminDelete } from "@/lib/adminFirestore";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormField from "@/components/admin/AdminFormField";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import ImageUpload from "@/components/admin/ImageUpload";
import { UPAZILAS, BUSINESS_CATEGORIES } from "@/lib/constants";
import { BadgeCheck } from "lucide-react";

interface Business {
  id: string; name: string; category: string; upazilaId: string;
  address: string; phone: string; description: string;
  ownerName: string; imageUrl: string; isVerified: boolean;
  rating: number; reviewCount: number;
}

const empty = (): Omit<Business, "id"> => ({
  name: "", category: "shop", upazilaId: "tangail_sadar",
  address: "", phone: "", description: "", ownerName: "",
  imageUrl: "", isVerified: false, rating: 0, reviewCount: 0,
});

const typeBadge: Record<string, string> = {
  hotel: "bg-indigo-50 text-indigo-700", restaurant: "bg-orange-50 text-orange-700",
  beauty: "bg-pink-50 text-pink-700", nursery: "bg-green-50 text-green-700",
  agriculture: "bg-lime-50 text-lime-700", shop: "bg-rose-50 text-rose-700",
};

const columns: Column<Business>[] = [
  { key: "name",     label: "নাম",        render: r => <span className="font-semibold">{r.name}</span> },
  { key: "category", label: "ক্যাটাগরি",  render: r => <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadge[r.category] ?? "bg-gray-100 text-gray-600"}`}>{BUSINESS_CATEGORIES[r.category] ?? r.category}</span> },
  { key: "phone",    label: "ফোন",         render: r => <span className="text-green-700 text-sm">{r.phone || "—"}</span> },
  { key: "upazilaId",label: "উপজেলা",     render: r => <span className="text-gray-500 text-sm">{UPAZILAS.find(u => u.id === r.upazilaId)?.name ?? r.upazilaId}</span> },
  { key: "isVerified", label: "ভেরিফাইড", render: r => r.isVerified ? <BadgeCheck size={16} className="text-green-500" /> : <span className="text-gray-300 text-xs">না</span> },
];

export default function AdminBusinessPage() {
  const [data, setData]         = useState<Business[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState<"add"|"edit"|"delete"|null>(null);
  const [selected, setSelected] = useState<Business | null>(null);
  const [form, setForm]         = useState(empty());
  const [saving, setSaving]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setData(await adminGetAll<Business>("businesses", "name"));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const filtered = data.filter(b =>
    !search || b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.ownerName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const p = { ...form, rating: Number(form.rating), reviewCount: Number(form.reviewCount) };
      if (modal === "add") await adminAdd("businesses", p);
      else if (selected) await adminUpdate("businesses", selected.id, p);
      await load(); setModal(null);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try { await adminDelete("businesses", selected.id); await load(); setModal(null); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <AdminPageHeader total={filtered.length} label="ব্যবসা" searchValue={search} onSearch={setSearch}
        onAdd={() => { setForm(empty()); setModal("add"); }} addLabel="ব্যবসা যোগ করুন" />
      <AdminTable columns={columns} data={filtered} loading={loading}
        onEdit={r => { setSelected(r); setForm({ ...r }); setModal("edit"); }}
        onDelete={r => { setSelected(r); setModal("delete"); }} />

      <AdminModal open={modal === "add" || modal === "edit"} onClose={() => setModal(null)}
        title={modal === "add" ? "নতুন ব্যবসা যোগ করুন" : "ব্যবসা সম্পাদনা"} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <AdminFormField type="text" label="ব্যবসার নাম" required value={form.name} onChange={v => set("name", v)} placeholder="প্রতিষ্ঠানের পূর্ণ নাম" />
          </div>
          <AdminFormField type="select" label="ক্যাটাগরি" required value={form.category} onChange={v => set("category", v)}
            options={Object.entries(BUSINESS_CATEGORIES).map(([k, v]) => ({ value: k, label: v }))} />
          <AdminFormField type="select" label="উপজেলা" required value={form.upazilaId} onChange={v => set("upazilaId", v)}
            options={[...UPAZILAS].map(u => ({ value: u.id, label: u.name }))} />
          <div className="sm:col-span-2">
            <AdminFormField type="text" label="ঠিকানা" required value={form.address} onChange={v => set("address", v)} placeholder="সম্পূর্ণ ঠিকানা" />
          </div>
          <AdminFormField type="tel"  label="ফোন নম্বর" required value={form.phone} onChange={v => set("phone", v)} placeholder="01XXXXXXXXX" />
          <AdminFormField type="text" label="মালিকের নাম" value={form.ownerName} onChange={v => set("ownerName", v)} />
          <div className="sm:col-span-2">
            <AdminFormField type="textarea" label="বিবরণ" value={form.description} onChange={v => set("description", v)} rows={2} placeholder="ব্যবসা সম্পর্কে সংক্ষিপ্ত বিবরণ" />
          </div>
          <AdminFormField type="number" label="রেটিং (০-৫)" value={form.rating} onChange={v => set("rating", v)} />
          <AdminFormField type="number" label="রিভিউ সংখ্যা" value={form.reviewCount} onChange={v => set("reviewCount", v)} />
          <div className="sm:col-span-2">
            <ImageUpload value={form.imageUrl} onChange={v => set("imageUrl", v)} folder="businesses" label="ব্যবসার ছবি" />
          </div>
          <div className="sm:col-span-2">
            <AdminFormField type="toggle" label="ভেরিফাইড (হোমপেজে দেখাবে)" value={form.isVerified} onChange={v => set("isVerified", v)} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold">বাতিল</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {modal === "add" ? "যোগ করুন" : "আপডেট করুন"}
          </button>
        </div>
      </AdminModal>

      <AdminModal open={modal === "delete"} onClose={() => setModal(null)} title="ব্যবসা মুছুন" size="sm">
        <DeleteConfirm itemName={selected?.name ?? ""} onConfirm={handleDelete} onCancel={() => setModal(null)} loading={saving} />
      </AdminModal>
    </div>
  );
}
