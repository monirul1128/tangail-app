"use client";
import { useState, useEffect, useCallback } from "react";
import { adminGetAll, adminAdd, adminUpdate, adminDelete } from "@/lib/adminFirestore";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormField from "@/components/admin/AdminFormField";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { UPAZILAS, SPECIALTIES } from "@/lib/constants";
import { BadgeCheck } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  nameEn: string;
  specialty: string;
  qualifications: string[];
  hospitalName: string;
  upazilaId: string;
  chamberAddress: string;
  visitingHours: string;
  phone: string;
  visitFee: number;
  isAvailable: boolean;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  imageUrl: string;
}

const empty = (): Omit<Doctor, "id"> => ({
  name: "", nameEn: "", specialty: "medicine", qualifications: [],
  hospitalName: "", upazilaId: "tangail_sadar", chamberAddress: "",
  visitingHours: "", phone: "", visitFee: 0, isAvailable: true,
  isVerified: false, rating: 0, reviewCount: 0, imageUrl: "",
});

const columns: Column<Doctor>[] = [
  { key: "name",      label: "নাম",        render: r => <span className="font-semibold text-gray-800">{r.name}</span> },
  { key: "specialty", label: "বিশেষজ্ঞতা", render: r => <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">{SPECIALTIES[r.specialty] ?? r.specialty}</span> },
  { key: "hospitalName", label: "হাসপাতাল", render: r => <span className="text-sm text-gray-500 truncate max-w-[140px] inline-block">{r.hospitalName}</span> },
  { key: "phone",     label: "ফোন",        render: r => <span className="text-sm text-green-700">{r.phone}</span> },
  { key: "visitFee",  label: "ভিজিট ফি",   render: r => <span className="text-sm font-semibold text-primary">৳{r.visitFee}</span> },
  { key: "isVerified",label: "ভেরিফাইড",   render: r => r.isVerified ? <BadgeCheck size={16} className="text-green-500" /> : <span className="text-gray-300 text-xs">না</span> },
];

export default function AdminDoctorsPage() {
  const [data, setData]         = useState<Doctor[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState<"add"|"edit"|"delete"|null>(null);
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [form, setForm]         = useState(empty());
  const [saving, setSaving]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setData(await adminGetAll<Doctor>("doctors", "name"));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const filtered = data.filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.includes(search));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        qualifications: typeof form.qualifications === "string"
          ? (form.qualifications as unknown as string).split(",").map((q:string) => q.trim()).filter(Boolean)
          : form.qualifications,
        visitFee: Number(form.visitFee),
        rating: Number(form.rating),
        reviewCount: Number(form.reviewCount),
      };
      if (modal === "add") await adminAdd("doctors", payload);
      else if (selected) await adminUpdate("doctors", selected.id, payload);
      await load(); setModal(null);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try { await adminDelete("doctors", selected.id); await load(); setModal(null); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <AdminPageHeader total={filtered.length} label="ডাক্তার" searchValue={search} onSearch={setSearch} onAdd={() => { setForm(empty()); setModal("add"); }} addLabel="ডাক্তার যোগ করুন" />
      <AdminTable columns={columns} data={filtered} loading={loading} onEdit={r => { setSelected(r); setForm({...r}); setModal("edit"); }} onDelete={r => { setSelected(r); setModal("delete"); }} />

      <AdminModal open={modal === "add" || modal === "edit"} onClose={() => setModal(null)} title={modal === "add" ? "নতুন ডাক্তার যোগ করুন" : "ডাক্তার সম্পাদনা"} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminFormField type="text" label="নাম (বাংলা)" required value={form.name} onChange={v => set("name", v)} placeholder="ডা. মো. ..." />
          <AdminFormField type="text" label="নাম (ইংরেজি)" value={form.nameEn} onChange={v => set("nameEn", v)} />
          <AdminFormField type="select" label="বিশেষজ্ঞতা" required value={form.specialty} onChange={v => set("specialty", v)}
            options={Object.entries(SPECIALTIES).map(([k,v]) => ({ value: k, label: v }))} />
          <AdminFormField type="select" label="উপজেলা" value={form.upazilaId} onChange={v => set("upazilaId", v)}
            options={[...UPAZILAS].map(u => ({ value: u.id, label: u.name }))} />
          <AdminFormField type="text" label="যোগ্যতা (কমা দিয়ে)" value={Array.isArray(form.qualifications) ? form.qualifications.join(", ") : form.qualifications}
            onChange={v => set("qualifications", v)} placeholder="MBBS, FCPS" />
          <AdminFormField type="text" label="হাসপাতালের নাম" value={form.hospitalName} onChange={v => set("hospitalName", v)} />
          <div className="sm:col-span-2">
            <AdminFormField type="text" label="চেম্বারের ঠিকানা" value={form.chamberAddress} onChange={v => set("chamberAddress", v)} />
          </div>
          <AdminFormField type="text" label="সময়সূচি" value={form.visitingHours} onChange={v => set("visitingHours", v)} placeholder="সকাল ৯টা - দুপুর ১টা" />
          <AdminFormField type="tel"  label="ফোন নম্বর" required value={form.phone} onChange={v => set("phone", v)} placeholder="01XXXXXXXXX" />
          <AdminFormField type="number" label="ভিজিট ফি (৳)" value={form.visitFee} onChange={v => set("visitFee", v)} />
          <AdminFormField type="number" label="রেটিং (০-৫)" value={form.rating} onChange={v => set("rating", v)} />
          <AdminFormField type="url"   label="ছবির URL" value={form.imageUrl} onChange={v => set("imageUrl", v)} />
          <div className="grid grid-cols-2 gap-3 sm:col-span-2">
            <AdminFormField type="toggle" label="এখন উপলব্ধ" value={form.isAvailable} onChange={v => set("isAvailable", v)} />
            <AdminFormField type="toggle" label="ভেরিফাইড" value={form.isVerified} onChange={v => set("isVerified", v)} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold">বাতিল</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
            {modal === "add" ? "যোগ করুন" : "আপডেট করুন"}
          </button>
        </div>
      </AdminModal>

      <AdminModal open={modal === "delete"} onClose={() => setModal(null)} title="ডাক্তার মুছুন" size="sm">
        <DeleteConfirm itemName={selected?.name ?? ""} onConfirm={handleDelete} onCancel={() => setModal(null)} loading={saving} />
      </AdminModal>
    </div>
  );
}
