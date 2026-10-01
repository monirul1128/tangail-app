"use client";
import { useState, useEffect, useCallback } from "react";
import { adminGetAll, adminAdd, adminUpdate, adminDelete } from "@/lib/adminFirestore";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormField from "@/components/admin/AdminFormField";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { ExternalLink } from "lucide-react";

interface ResultLink {
  id: string;
  exam: string;       // SSC, HSC, JSC, etc.
  board: string;      // ঢাকা বোর্ড, NU, etc.
  year: string;       // ২০২৬
  description: string;
  url: string;
  isActive: boolean;
  sortOrder: number;
}

const examOpts = [
  { value: "SSC",        label: "SSC / দাখিল"            },
  { value: "HSC",        label: "HSC / আলিম"             },
  { value: "JSC",        label: "JSC / JDC"              },
  { value: "PSC",        label: "PSC / EBT"              },
  { value: "NU",         label: "NU অনার্স/মাস্টার্স"    },
  { value: "Madrasa",    label: "মাদ্রাসা বোর্ড"         },
  { value: "Technical",  label: "কারিগরি বোর্ড"          },
  { value: "Other",      label: "অন্যান্য"                },
];

const empty = (): Omit<ResultLink, "id"> => ({
  exam: "SSC", board: "ঢাকা বোর্ড", year: "২০২৬",
  description: "", url: "https://www.educationboardresults.gov.bd",
  isActive: true, sortOrder: 1,
});

const columns: Column<ResultLink>[] = [
  { key: "exam",        label: "পরীক্ষা",    render: r => <span className="font-bold text-blue-700 text-sm">{r.exam}</span> },
  { key: "board",       label: "বোর্ড",      render: r => <span className="text-sm text-gray-600">{r.board}</span> },
  { key: "year",        label: "সাল",        render: r => <span className="text-sm font-semibold text-gray-700">{r.year}</span> },
  { key: "url",         label: "লিংক",       render: r => (
    <a href={r.url} target="_blank" rel="noopener noreferrer"
      className="text-xs text-blue-600 hover:underline flex items-center gap-1 max-w-[160px] truncate">
      {r.url.replace("https://","").replace("www.","").substring(0,30)}... <ExternalLink size={10}/>
    </a>
  )},
  { key: "isActive",    label: "সক্রিয়",    render: r => <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${r.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>{r.isActive ? "চালু" : "বন্ধ"}</span> },
];

export default function AdminResultsPage() {
  const [data, setData]         = useState<ResultLink[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState<"add"|"edit"|"delete"|null>(null);
  const [selected, setSelected] = useState<ResultLink | null>(null);
  const [form, setForm]         = useState(empty());
  const [saving, setSaving]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await adminGetAll<ResultLink>("result_links", "sortOrder")); }
    catch { setData([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const filtered = data.filter(r =>
    !search || r.exam.toLowerCase().includes(search.toLowerCase()) ||
    r.board.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const p = { ...form, sortOrder: Number(form.sortOrder) };
      if (modal === "add") await adminAdd("result_links", p);
      else if (selected) await adminUpdate("result_links", selected.id, p);
      await load(); setModal(null);
    } catch (e: any) {
      alert("সংরক্ষণ ব্যর্থ: " + (e?.message ?? ""));
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try { await adminDelete("result_links", selected.id); await load(); setModal(null); }
    finally { setSaving(false); }
  };

  return (
    <div>
      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 text-sm text-blue-700">
        <p className="font-bold mb-1">📊 রেজাল্ট লিংক ম্যানেজমেন্ট</p>
        <p className="text-xs text-blue-600">এখানে যোগ করা লিংক শিক্ষা পেজের রেজাল্ট সেকশনে দেখাবে।</p>
      </div>

      <AdminPageHeader
        total={filtered.length}
        label="রেজাল্ট লিংক"
        searchValue={search}
        onSearch={setSearch}
        onAdd={() => { setForm(empty()); setModal("add"); }}
        addLabel="রেজাল্ট লিংক যোগ করুন"
      />

      <AdminTable
        columns={columns}
        data={filtered}
        loading={loading}
        onEdit={r => { setSelected(r); setForm({ ...r }); setModal("edit"); }}
        onDelete={r => { setSelected(r); setModal("delete"); }}
        emptyMessage="কোনো রেজাল্ট লিংক পাওয়া যায়নি"
      />

      <AdminModal
        open={modal === "add" || modal === "edit"}
        onClose={() => setModal(null)}
        title={modal === "add" ? "নতুন রেজাল্ট লিংক" : "রেজাল্ট লিংক সম্পাদনা"}
        size="md"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminFormField
            type="select" label="পরীক্ষার ধরন" required
            value={form.exam} onChange={v => set("exam", v)}
            options={examOpts}
          />
          <AdminFormField
            type="text" label="বোর্ডের নাম" required
            value={form.board} onChange={v => set("board", v)}
            placeholder="ঢাকা বোর্ড / জাতীয় বিশ্ববিদ্যালয়"
          />
          <AdminFormField
            type="text" label="সাল" required
            value={form.year} onChange={v => set("year", v)}
            placeholder="২০২৬"
          />
          <AdminFormField
            type="number" label="ক্রম" value={form.sortOrder}
            onChange={v => set("sortOrder", v)} hint="ছোট সংখ্যা আগে দেখাবে"
          />
          <div className="sm:col-span-2">
            <AdminFormField
              type="url" label="রেজাল্ট লিংক (URL)" required
              value={form.url} onChange={v => set("url", v)}
              placeholder="https://www.educationboardresults.gov.bd"
            />
          </div>
          <div className="sm:col-span-2">
            <AdminFormField
              type="text" label="বিবরণ"
              value={form.description} onChange={v => set("description", v)}
              placeholder="মাধ্যমিক স্কুল সার্টিফিকেট পরীক্ষার ফলাফল"
            />
          </div>
          <div className="sm:col-span-2">
            <AdminFormField
              type="toggle" label="সক্রিয় (রেজাল্ট পেজে দেখাবে)"
              value={form.isActive} onChange={v => set("isActive", v)}
            />
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

      <AdminModal open={modal === "delete"} onClose={() => setModal(null)} title="লিংক মুছুন" size="sm">
        <DeleteConfirm
          itemName={`${selected?.exam} - ${selected?.year}`}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
          loading={saving}
        />
      </AdminModal>
    </div>
  );
}
