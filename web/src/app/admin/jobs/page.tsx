"use client";
import { useState, useEffect, useCallback } from "react";
import { adminGetAll, adminAdd, adminUpdate, adminDelete } from "@/lib/adminFirestore";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormField from "@/components/admin/AdminFormField";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { Timestamp } from "firebase/firestore";

interface Job { id:string; title:string; organization:string; type:string; location:string; deadline:string; applyLink:string; description:string; salary:string; isActive:boolean; publishedAt:Timestamp|string; }
const typeOpts=[{value:"govt",label:"সরকারি"},{value:"private",label:"বেসরকারি"},{value:"bank",label:"ব্যাংক"},{value:"ngo",label:"এনজিও"}];
const typeBadge:Record<string,string>={govt:"bg-blue-50 text-blue-700",private:"bg-purple-50 text-purple-700",bank:"bg-green-50 text-green-700",ngo:"bg-amber-50 text-amber-700"};
const empty=():Omit<Job,"id">=>({title:"",organization:"",type:"govt",location:"টাঙ্গাইল",deadline:"",applyLink:"",description:"",salary:"",isActive:true,publishedAt:new Date().toISOString().split("T")[0]});
const columns:Column<Job>[]=[
  {key:"title",label:"পদের নাম",render:r=><span className="font-semibold">{r.title}</span>},
  {key:"organization",label:"প্রতিষ্ঠান",render:r=><span className="text-gray-600 text-sm">{r.organization}</span>},
  {key:"type",label:"ধরন",render:r=><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadge[r.type]??""}`}>{typeOpts.find(t=>t.value===r.type)?.label??r.type}</span>},
  {key:"deadline",label:"শেষ তারিখ",render:r=><span className="text-sm text-gray-500">{r.deadline}</span>},
  {key:"isActive",label:"সক্রিয়",render:r=><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${r.isActive?"bg-green-50 text-green-700":"bg-gray-100 text-gray-500"}`}>{r.isActive?"চলমান":"শেষ"}</span>},
];
export default function AdminJobsPage() {
  const [data,setData]=useState<Job[]>([]);const [loading,setLoading]=useState(true);const [search,setSearch]=useState("");const [modal,setModal]=useState<"add"|"edit"|"delete"|null>(null);const [selected,setSelected]=useState<Job|null>(null);const [form,setForm]=useState(empty());const [saving,setSaving]=useState(false);
  const load=useCallback(async()=>{setLoading(true);setData(await adminGetAll<Job>("jobs","publishedAt"));setLoading(false);},[]);
  useEffect(()=>{load();},[load]);
  const set=(k:string,v:any)=>setForm(f=>({...f,[k]:v}));
  const filtered=data.filter(j=>!search||j.title.toLowerCase().includes(search.toLowerCase())||j.organization.toLowerCase().includes(search.toLowerCase()));
  const handleSave=async()=>{setSaving(true);try{const p={...form,publishedAt:Timestamp.fromDate(new Date(form.publishedAt as string))};if(modal==="add")await adminAdd("jobs",p);else if(selected)await adminUpdate("jobs",selected.id,p);await load();setModal(null);}finally{setSaving(false);}};
  const handleDelete=async()=>{if(!selected)return;setSaving(true);try{await adminDelete("jobs",selected.id);await load();setModal(null);}finally{setSaving(false);}};
  const openEdit=(r:Job)=>{const d=r.publishedAt instanceof Timestamp?r.publishedAt.toDate().toISOString().split("T")[0]:String(r.publishedAt).split("T")[0];setSelected(r);setForm({...r,publishedAt:d});setModal("edit");};
  return(<div>
    <AdminPageHeader total={filtered.length} label="চাকরি" searchValue={search} onSearch={setSearch} onAdd={()=>{setForm(empty());setModal("add");}} addLabel="বিজ্ঞাপন যোগ করুন"/>
    <AdminTable columns={columns} data={filtered} loading={loading} onEdit={openEdit} onDelete={r=>{setSelected(r);setModal("delete");}}/>
    <AdminModal open={modal==="add"||modal==="edit"} onClose={()=>setModal(null)} title={modal==="add"?"নতুন চাকরির বিজ্ঞাপন":"বিজ্ঞাপন সম্পাদনা"} size="lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2"><AdminFormField type="text" label="পদের নাম" required value={form.title} onChange={v=>set("title",v)} placeholder="উপজেলা স্বাস্থ্য সহকারী"/></div>
        <AdminFormField type="text" label="প্রতিষ্ঠানের নাম" required value={form.organization} onChange={v=>set("organization",v)}/>
        <AdminFormField type="select" label="ধরন" value={form.type} onChange={v=>set("type",v)} options={typeOpts}/>
        <AdminFormField type="text" label="অবস্থান" value={form.location} onChange={v=>set("location",v)}/>
        <AdminFormField type="text" label="আবেদনের শেষ তারিখ" value={form.deadline} onChange={v=>set("deadline",v)} placeholder="৩০ অক্টোবর ২০২৬"/>
        <AdminFormField type="text" label="বেতন" value={form.salary} onChange={v=>set("salary",v)} placeholder="সরকারি নীতিমালা অনুযায়ী"/>
        <AdminFormField type="date" label="প্রকাশের তারিখ" required value={form.publishedAt as string} onChange={v=>set("publishedAt",v)}/>
        <div className="sm:col-span-2"><AdminFormField type="url" label="আবেদনের লিংক" value={form.applyLink} onChange={v=>set("applyLink",v)} placeholder="https://teletalk.com.bd/..."/></div>
        <div className="sm:col-span-2"><AdminFormField type="textarea" label="বিবরণ" value={form.description} onChange={v=>set("description",v)} rows={3}/></div>
        <AdminFormField type="toggle" label="সক্রিয় / চলমান" value={form.isActive} onChange={v=>set("isActive",v)}/>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={()=>setModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold">বাতিল</button>
        <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">{saving&&<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}{modal==="add"?"প্রকাশ করুন":"আপডেট করুন"}</button>
      </div>
    </AdminModal>
    <AdminModal open={modal==="delete"} onClose={()=>setModal(null)} title="বিজ্ঞাপন মুছুন" size="sm"><DeleteConfirm itemName={selected?.title??""} onConfirm={handleDelete} onCancel={()=>setModal(null)} loading={saving}/></AdminModal>
  </div>);
}
