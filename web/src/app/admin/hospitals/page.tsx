"use client";
import { useState, useEffect, useCallback } from "react";
import { adminGetAll, adminAdd, adminUpdate, adminDelete } from "@/lib/adminFirestore";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormField from "@/components/admin/AdminFormField";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import ImageUpload from "@/components/admin/ImageUpload";
import { UPAZILAS, HOSPITAL_TYPES, SPECIALTIES } from "@/lib/constants";
import { BadgeCheck, Clock } from "lucide-react";

interface Hospital {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  upazilaId: string;
  address: string;
  phone: string[];
  specialties: string[];
  totalBeds: number;
  emergencyAvailable: boolean;
  isOpen24Hours: boolean;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  imageUrl: string;
}

const empty = (): Omit<Hospital, "id"> => ({
  name: "", nameEn: "", type: "government", upazilaId: "tangail_sadar",
  address: "", phone: [], specialties: [], totalBeds: 0,
  emergencyAvailable: false, isOpen24Hours: false,
  isVerified: false, rating: 0, reviewCount: 0, imageUrl: "",
});

const columns: Column<Hospital>[] = [
  { key: "name",      label: "নাম",      render: (r) => <span className="font-semibold text-gray-800">{r.name}</span> },
  { key: "type",      label: "ধরন",      render: (r) => <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{HOSPITAL_TYPES[r.type] ?? r.type}</span> },
  { key: "upazilaId", label: "উপজেলা",   render: (r) => <span className="text-sm text-gray-500">{UPAZILAS.find(u => u.id === r.upazilaId)?.name ?? r.upazilaId}</span> },
  { key: "totalBeds", label: "শয্যা",     render: (r) => <span className="text-sm">{r.totalBeds}</span> },
  { key: "isVerified",label: "ভেরিফাইড", render: (r) => r.isVerified ? <BadgeCheck size={16} className="text-green-500" /> : <span className="text-gray-300 text-xs">না</span> },
  { key: "isOpen24Hours", label: "২৪ঘণ্টা", render: (r) => r.isOpen24Hours ? <Clock size={16} className="text-green-500" /> : <span className="text-gray-300 text-xs">না</span> },
];

export default function AdminHospitalsPage() {
  const [data, setData]         = useState<Hospital[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState<"add"|"edit"|"delete"|null>(null);
  const [selected, setSelected] = useState<Hospital | null>(null);
  const [form, setForm]         = useState(empty());
  const [saving, setSaving]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const rows = await adminGetAll<Hospital>("hospitals", "name");
    setData(rows);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const filtered = data.filter(h =>
    !search || h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.address?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setForm(empty()); setModal("add"); };
  const openEdit = (row: Hospital) => { setSelected(row); setForm({ ...row }); setModal("edit"); };
  const openDel  = (row: Hospital) => { setSelected(row); setModal("delete"); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        phone: typeof form.phone === "string"
          ? (form.phone as string).split(",").map((p: string) => p.trim()).filter(Boolean)
          : form.phone,
        specialties: typeof form.specialties === "string"
          ? (form.specialties as unknown as string).split(",").map((s: string) => s.trim()).filter(Boolean)
          : form.specialties,
        totalBeds: Number(form.totalBeds),
        rating: Number(form.rating),
        reviewCount: Number(form.reviewCount),
      };
      if (modal === "add") await adminAdd("hospitals", payload);
      else if (modal === "edit" && selected) await adminUpdate("hospitals", selected.id, payload);
      await load();
      setModal(null);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try { await adminDelete("hospitals", selected.id); await load(); setModal(null); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <AdminPageHeader total={filtered.length} label="হাসপাতাল" searchValue={search} onSearch={setSearch} onAdd={openAdd} addLabel="হাসপাতাল যোগ করুন" />
      <AdminTable columns={columns} data={filtered} loading={loading} onEdit={openEdit} onDelete={openDel} emptyMessage="কোনো হাসপাতাল পাওয়া যায়নি" />

      {/* Add / Edit modal */}
      <AdminModal open={modal === "add" || modal === "edit"} onClose={() => setModal(null)} title={modal === "add" ? "নতুন হাসপাতাল যোগ করুন" : "হাসপাতাল সম্পাদনা"} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminFormField type="text" label="নাম (বাংলা)" required value={form.name} onChange={v => set("name", v)} placeholder="হাসপাতালের নাম" />
          <AdminFormField type="text" label="নাম (ইংরেজি)" value={form.nameEn} onChange={v => set("nameEn", v)} placeholder="Hospital name in English" />
          <AdminFormField type="select" label="ধরন" value={form.type} onChange={v => set("type", v)}
            options={Object.entries(HOSPITAL_TYPES).map(([k,v]) => ({ value: k, label: v }))} />
          <AdminFormField type="select" label="উপজেলা" value={form.upazilaId} onChange={v => set("upazilaId", v)}
            options={[...UPAZILAS].map(u => ({ value: u.id, label: u.name }))} />
          <div className="sm:col-span-2">
            <AdminFormField type="text" label="ঠিকানা" required value={form.address} onChange={v => set("address", v)} placeholder="সম্পূর্ণ ঠিকানা" />
          </div>
          <AdminFormField type="text" label="ফোন নম্বর" value={Array.isArray(form.phone) ? form.phone.join(", ") : form.phone}
            onChange={v => set("phone", v)} placeholder="কমা দিয়ে আলাদা করুন: 01711..., 0921..." hint="একাধিক নম্বর কমা (,) দিয়ে আলাদা করুন" />
          <AdminFormField type="number" label="মোট শয্যা" value={form.totalBeds} onChange={v => set("totalBeds", v)} />
          <div className="sm:col-span-2">
            <AdminFormField type="text" label="বিশেষজ্ঞতা" value={Array.isArray(form.specialties) ? form.specialties.join(", ") : form.specialties}
              onChange={v => set("specialties", v)} placeholder="medicine, surgery, gynecology ..." hint="ইংরেজিতে কমা দিয়ে আলাদা করুন" />
          </div>
          <AdminFormField type="number" label="রেটিং (০-৫)" value={form.rating} onChange={v => set("rating", v)} />
          <AdminFormField type="number" label="রিভিউ সংখ্যা" value={form.reviewCount} onChange={v => set("reviewCount", v)} />
          <div className="sm:col-span-2">
            <ImageUpload
              value={form.imageUrl}
              onChange={v => set("imageUrl", v)}
              folder="hospitals"
              label="হাসপাতালের ছবি"
            />
          </div>
          <div className="sm:col-span-2 grid grid-cols-3 gap-4">
            <AdminFormField type="toggle" label="জরুরি বিভাগ" value={form.emergencyAvailable} onChange={v => set("emergencyAvailable", v)} />
            <AdminFormField type="toggle" label="২৪ ঘণ্টা সেবা" value={form.isOpen24Hours} onChange={v => set("isOpen24Hours", v)} />
            <AdminFormField type="toggle" label="ভেরিফাইড" value={form.isVerified} onChange={v => set("isVerified", v)} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">বাতিল</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary hover:bg-primary-600 disabled:opacity-60 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
            {saving && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
            {modal === "add" ? "যোগ করুন" : "আপডেট করুন"}
          </button>
        </div>
      </AdminModal>

      {/* Delete modal */}
      <AdminModal open={modal === "delete"} onClose={() => setModal(null)} title="হাসপাতাল মুছুন" size="sm">
        <DeleteConfirm itemName={selected?.name ?? ""} onConfirm={handleDelete} onCancel={() => setModal(null)} loading={saving} />
      </AdminModal>
    </div>
  );
}
