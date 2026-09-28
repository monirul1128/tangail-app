"use client";
import { useState, useEffect, useCallback } from "react";
import { Timestamp } from "firebase/firestore";
import { adminGetAll, adminAdd, adminUpdate, adminDelete } from "@/lib/adminFirestore";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormField from "@/components/admin/AdminFormField";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import ImageUpload from "@/components/admin/ImageUpload";

interface NewsArticle {
  id: string; title: string; titleEn: string; body: string;
  category: string; imageUrl: string; source: string;
  isNotice: boolean; publishedAt: Timestamp | string;
}

const categories = [
  {value:"health",label:"স্বাস্থ্য"},{value:"district",label:"জেলা"},
  {value:"notice",label:"নোটিশ"},{value:"government",label:"সরকারি"},{value:"general",label:"সাধারণ"},
];

const empty = (): Omit<NewsArticle,"id"> => ({
  title:"", titleEn:"", body:"", category:"general",
  imageUrl:"", source:"", isNotice:false, publishedAt: new Date().toISOString().split("T")[0],
});

const columns: Column<NewsArticle>[] = [
  { key:"title",    label:"শিরোনাম",   render: r => <span className="font-semibold text-gray-800 line-clamp-1 max-w-[240px] block">{r.title}</span> },
  { key:"category", label:"ক্যাটাগরি", render: r => <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{categories.find(c=>c.value===r.category)?.label??r.category}</span> },
  { key:"source",   label:"উৎস",        render: r => <span className="text-sm text-gray-500">{r.source}</span> },
  { key:"isNotice", label:"নোটিশ",      render: r => r.isNotice ? <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">নোটিশ</span> : <span className="text-gray-300 text-xs">না</span> },
  { key:"publishedAt", label:"তারিখ",   render: r => {
    try {
      const d = r.publishedAt instanceof Timestamp ? r.publishedAt.toDate() : new Date(r.publishedAt as string);
      return <span className="text-sm text-gray-500">{d.toLocaleDateString("bn-BD")}</span>;
    } catch { return <span className="text-gray-400 text-xs">—</span>; }
  }},
];

export default function AdminNewsPage() {
  const [data,setData]=useState<NewsArticle[]>([]); const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState(""); const [modal,setModal]=useState<"add"|"edit"|"delete"|null>(null);
  const [selected,setSelected]=useState<NewsArticle|null>(null); const [form,setForm]=useState(empty()); const [saving,setSaving]=useState(false);
  const load=useCallback(async()=>{setLoading(true);setData(await adminGetAll<NewsArticle>("news","publishedAt"));setLoading(false);},[]);
  useEffect(()=>{load();},[load]);
  const set=(k:string,v:any)=>setForm(f=>({...f,[k]:v}));
  const filtered=data.filter(n=>!search||n.title.toLowerCase().includes(search.toLowerCase())||n.source.toLowerCase().includes(search.toLowerCase()));
  const handleSave=async()=>{
    setSaving(true);
    try{
      const p={...form,publishedAt:Timestamp.fromDate(new Date(form.publishedAt as string))};
      if(modal==="add")await adminAdd("news",p);else if(selected)await adminUpdate("news",selected.id,p);
      await load();setModal(null);
    }finally{setSaving(false);}
  };
  const handleDelete=async()=>{if(!selected)return;setSaving(true);try{await adminDelete("news",selected.id);await load();setModal(null);}finally{setSaving(false);}};
  const openEdit=(r:NewsArticle)=>{
    const dateStr = r.publishedAt instanceof Timestamp
      ? r.publishedAt.toDate().toISOString().split("T")[0]
      : String(r.publishedAt).split("T")[0];
    setSelected(r);setForm({...r,publishedAt:dateStr});setModal("edit");
  };
  return (
    <div>
      <AdminPageHeader total={filtered.length} label="খবর" searchValue={search} onSearch={setSearch} onAdd={()=>{setForm(empty());setModal("add");}} addLabel="খবর প্রকাশ করুন"/>
      <AdminTable columns={columns} data={filtered} loading={loading} onEdit={openEdit} onDelete={r=>{setSelected(r);setModal("delete");}}/>
      <AdminModal open={modal==="add"||modal==="edit"} onClose={()=>setModal(null)} title={modal==="add"?"নতুন খবর প্রকাশ করুন":"খবর সম্পাদনা"} size="xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><AdminFormField type="text" label="শিরোনাম (বাংলা)" required value={form.title} onChange={v=>set("title",v)} placeholder="খবরের শিরোনাম লিখুন"/></div>
          <div className="sm:col-span-2"><AdminFormField type="text" label="শিরোনাম (ইংরেজি)" value={form.titleEn} onChange={v=>set("titleEn",v)}/></div>
          <div className="sm:col-span-2"><AdminFormField type="textarea" label="বিস্তারিত" required value={form.body} onChange={v=>set("body",v)} rows={6} placeholder="খবরের সম্পূর্ণ বিবরণ লিখুন..."/></div>
          <AdminFormField type="select" label="ক্যাটাগরি" value={form.category} onChange={v=>set("category",v)} options={categories}/>
          <AdminFormField type="text"   label="উৎস / সংস্থা" value={form.source} onChange={v=>set("source",v)} placeholder="জেলা প্রশাসন, স্বাস্থ্য অধিদপ্তর..."/>
          <AdminFormField type="date"   label="প্রকাশের তারিখ" required value={form.publishedAt as string} onChange={v=>set("publishedAt",v)}/>
          <div className="sm:col-span-2">
            <ImageUpload value={form.imageUrl} onChange={v=>set("imageUrl",v)} folder="news" label="খবরের ছবি"/>
          </div>
          <div className="sm:col-span-2"><AdminFormField type="toggle" label="এটি একটি নোটিশ?" value={form.isNotice} onChange={v=>set("isNotice",v)}/></div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={()=>setModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold">বাতিল</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
            {saving&&<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
            {modal==="add"?"প্রকাশ করুন":"আপডেট করুন"}
          </button>
        </div>
      </AdminModal>
      <AdminModal open={modal==="delete"} onClose={()=>setModal(null)} title="খবর মুছুন" size="sm">
        <DeleteConfirm itemName={selected?.title??""} onConfirm={handleDelete} onCancel={()=>setModal(null)} loading={saving}/>
      </AdminModal>
    </div>
  );
}
