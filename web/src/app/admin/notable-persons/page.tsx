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

interface NotablePerson {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  category: string;
  upazilaId: string;
  bornYear: string;
  diedYear: string;
  bio: string;
  achievements: string[];
  imageUrl: string;
}

const categoryOpts = [
  { value: "politics",   label: "রাজনীতি"         },
  { value: "literature", label: "সাহিত্য"          },
  { value: "social",     label: "সমাজসেবা"         },
  { value: "art",        label: "শিল্প-সংস্কৃতি"  },
  { value: "sports",     label: "ক্রীড়া"           },
  { value: "other",      label: "অন্যান্য"          },
];

const catBadge: Record<string, string> = {
  politics:   "bg-green-50 text-green-700",
  literature: "bg-blue-50 text-blue-700",
  social:     "bg-red-50 text-red-700",
  art:        "bg-pink-50 text-pink-700",
  sports:     "bg-orange-50 text-orange-700",
  other:      "bg-gray-100 text-gray-600",
};

const empty = (): Omit<NotablePerson, "id"> => ({
  name: "", nameEn: "", title: "", category: "politics",
  upazilaId: "tangail_sadar", bornYear: "", diedYear: "",
  bio: "", achievements: [], imageUrl: "",
});

const columns: Column<NotablePerson>[] = [
  { key: "imageUrl", label: "ছবি",       render: r => r.imageUrl
      ? <img src={r.imageUrl} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
      : <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-lg">🏅</div>
  },
  { key: "name",     label: "নাম",        render: r => <span className="font-semibold">{r.name}</span> },
  { key: "title",    label: "পরিচয়",     render: r => <span className="text-sm text-gray-500 line-clamp-1">{r.title}</span> },
  { key: "category", label: "ক্যাটাগরি", render: r => <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catBadge[r.category] ?? ""}`}>{categoryOpts.find(c => c.value === r.category)?.label ?? r.category}</span> },
  { key: "upazilaId",label: "উপজেলা",   render: r => <span className="text-sm text-gray-500">{UPAZILAS.find(u => u.id === r.upazilaId)?.name ?? r.upazilaId}</span> },
];

export default function AdminNotablePersonsPage() {
  const [data, setData]         = useState<NotablePerson[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState<"add"|"edit"|"delete"|null>(null);
  const [selected, setSelected] = useState<NotablePerson | null>(null);
  const [form, setForm]         = useState(empty());
  const [saving, setSaving]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await adminGetAll<NotablePerson>("notable_persons", "name")); }
    catch { setData([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const filtered = data.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        achievements: typeof form.achievements === "string"
          ? (form.achievements as unknown as string).split("\n").map((a: string) => a.trim()).filter(Boolean)
          : form.achievements,
      };
      if (modal === "add") await adminAdd("notable_persons", payload);
      else if (selected) await adminUpdate("notable_persons", selected.id, payload);
      await load(); setModal(null);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try { await adminDelete("notable_persons", selected.id); await load(); setModal(null); }
    finally { setSaving(false); }
  };

  const openEdit = (r: NotablePerson) => {
    setSelected(r);
    setForm({
      ...r,
      achievements: Array.isArray(r.achievements) ? r.achievements : [],
    });
    setModal("edit");
  };

  return (
    <div>
      <AdminPageHeader
        total={filtered.length}
        label="গুণিজন"
        searchValue={search}
        onSearch={setSearch}
        onAdd={() => { setForm(empty()); setModal("add"); }}
        addLabel="গুণিজন যোগ করুন"
      />

      <AdminTable
        columns={columns}
        data={filtered}
        loading={loading}
        onEdit={openEdit}
        onDelete={r => { setSelected(r); setModal("delete"); }}
        emptyMessage="কোনো গুণিজন পাওয়া যায়নি"
      />

      {/* Add / Edit Modal */}
      <AdminModal
        open={modal === "add" || modal === "edit"}
        onClose={() => setModal(null)}
        title={modal === "add" ? "নতুন গুণিজন যোগ করুন" : "গুণিজন সম্পাদনা"}
        size="xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminFormField type="text" label="নাম (বাংলা)" required value={form.name} onChange={v => set("name", v)} placeholder="মাওলানা আব্দুল হামিদ খান ভাসানী" />
          <AdminFormField type="text" label="নাম (ইংরেজি)" value={form.nameEn} onChange={v => set("nameEn", v)} placeholder="Maulana Bhashani" />
          <div className="sm:col-span-2">
            <AdminFormField type="text" label="পরিচয় / পদবি" required value={form.title} onChange={v => set("title", v)} placeholder="রাজনীতিবিদ ও জননেতা" />
          </div>
          <AdminFormField type="select" label="ক্যাটাগরি" value={form.category} onChange={v => set("category", v)} options={categoryOpts} />
          <AdminFormField type="select" label="উপজেলা" value={form.upazilaId} onChange={v => set("upazilaId", v)}
            options={[...UPAZILAS].map(u => ({ value: u.id, label: u.name }))} />
          <AdminFormField type="text" label="জন্ম সাল" value={form.bornYear} onChange={v => set("bornYear", v)} placeholder="১৮৮০" />
          <AdminFormField type="text" label="মৃত্যু সাল (যদি প্রযোজ্য)" value={form.diedYear} onChange={v => set("diedYear", v)} placeholder="১৯৭৬" />
          <div className="sm:col-span-2">
            <AdminFormField type="textarea" label="জীবনী / বিবরণ" required value={form.bio} onChange={v => set("bio", v)} rows={4} placeholder="সংক্ষিপ্ত জীবনী লিখুন..." />
          </div>
          <div className="sm:col-span-2">
            <AdminFormField
              type="textarea"
              label="উল্লেখযোগ্য অবদান"
              value={Array.isArray(form.achievements) ? form.achievements.join("\n") : form.achievements as any}
              onChange={v => set("achievements", v)}
              rows={4}
              placeholder="প্রতিটি অবদান আলাদা লাইনে লিখুন..."
              hint="প্রতিটি অবদান নতুন লাইনে (Enter) দিন"
            />
          </div>
          <div className="sm:col-span-2">
            <ImageUpload value={form.imageUrl} onChange={v => set("imageUrl", v)} folder="notable_persons" label="ছবি আপলোড করুন" />
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

      {/* Delete Modal */}
      <AdminModal open={modal === "delete"} onClose={() => setModal(null)} title="গুণিজন মুছুন" size="sm">
        <DeleteConfirm itemName={selected?.name ?? ""} onConfirm={handleDelete} onCancel={() => setModal(null)} loading={saving} />
      </AdminModal>
    </div>
  );
}
