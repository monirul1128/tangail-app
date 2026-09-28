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
import { CheckCircle, XCircle } from "lucide-react";

interface GalleryPhoto { id:string; caption:string; category:string; upazilaId:string; imageUrl:string; uploadedBy:string; isApproved:boolean; }
const catOpts=[{value:"শহর",label:"শহর"},{value:"ঐতিহাসিক",label:"ঐতিহাসিক"},{value:"প্রকৃতি",label:"প্রকৃতি"},{value:"স্থাপনা",label:"স্থাপনা"},{value:"শিক্ষা",label:"শিক্ষা"},{value:"বিনোদন",label:"বিনোদন"}];
const empty=():Omit<GalleryPhoto,"id">=>({caption:"",category:"শহর",upazilaId:"tangail_sadar",imageUrl:"",uploadedBy:"",isApproved:true});
const columns:Column<GalleryPhoto>[]=[
  {key:"imageUrl",label:"ছবি",render:r=>r.imageUrl?<img src={r.imageUrl} alt={r.caption} className="w-12 h-10 object-cover rounded-lg"/>:<span className="text-gray-300 text-xs">কোনো ছবি নেই</span>},
  {key:"caption",label:"ক্যাপশন",render:r=><span className="font-semibold">{r.caption}</span>},
  {key:"category",label:"ক্যাটাগরি",render:r=><span className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full">{r.category}</span>},
  {key:"upazilaId",label:"উপজেলা",render:r=><span className="text-gray-500 text-sm">{UPAZILAS.find(u=>u.id===r.upazilaId)?.name??r.upazilaId}</span>},
  {key:"isApproved",label:"অনুমোদিত",render:r=>r.isApproved?<CheckCircle size={16} className="text-green-500"/>:<XCircle size={16} className="text-red-400"/>},
];
export default function AdminGalleryPage() {
  const [data,setData]=useState<GalleryPhoto[]>([]);const [loading,setLoading]=useState(true);const [search,setSearch]=useState("");const [modal,setModal]=useState<"add"|"edit"|"delete"|null>(null);const [selected,setSelected]=useState<GalleryPhoto|null>(null);const [form,setForm]=useState(empty());const [saving,setSaving]=useState(false);
  const load=useCallback(async()=>{setLoading(true);setData(await adminGetAll<GalleryPhoto>("gallery","createdAt"));setLoading(false);},[]);
  useEffect(()=>{load();},[load]);
  const set=(k:string,v:any)=>setForm(f=>({...f,[k]:v}));
  const filtered=data.filter(p=>!search||p.caption.toLowerCase().includes(search.toLowerCase()));
  const handleSave=async()=>{setSaving(true);try{if(modal==="add")await adminAdd("gallery",form);else if(selected)await adminUpdate("gallery",selected.id,form);await load();setModal(null);}finally{setSaving(false);}};
  const handleDelete=async()=>{if(!selected)return;setSaving(true);try{await adminDelete("gallery",selected.id);await load();setModal(null);}finally{setSaving(false);}};
  return(<div>
    <AdminPageHeader total={filtered.length} label="ছবি" searchValue={search} onSearch={setSearch} onAdd={()=>{setForm(empty());setModal("add");}} addLabel="ছবি যোগ করুন"/>
    <AdminTable columns={columns} data={filtered} loading={loading} onEdit={r=>{setSelected(r);setForm({...r});setModal("edit");}} onDelete={r=>{setSelected(r);setModal("delete");}}/>
    <AdminModal open={modal==="add"||modal==="edit"} onClose={()=>setModal(null)} title={modal==="add"?"নতুন ছবি যোগ করুন":"ছবি সম্পাদনা"} size="md">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <ImageUpload value={form.imageUrl} onChange={v=>set("imageUrl",v)} folder="gallery" label="ছবি আপলোড করুন"/>
        </div>
        <div className="sm:col-span-2"><AdminFormField type="text" label="ক্যাপশন" required value={form.caption} onChange={v=>set("caption",v)}/></div>
        <AdminFormField type="select" label="ক্যাটাগরি" value={form.category} onChange={v=>set("category",v)} options={catOpts}/>
        <AdminFormField type="select" label="উপজেলা" value={form.upazilaId} onChange={v=>set("upazilaId",v)} options={[...UPAZILAS].map(u=>({value:u.id,label:u.name}))}/>
        <AdminFormField type="toggle" label="অনুমোদিত" value={form.isApproved} onChange={v=>set("isApproved",v)}/>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={()=>setModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold">বাতিল</button>
        <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">{saving&&<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}{modal==="add"?"যোগ করুন":"আপডেট করুন"}</button>
      </div>
    </AdminModal>
    <AdminModal open={modal==="delete"} onClose={()=>setModal(null)} title="ছবি মুছুন" size="sm"><DeleteConfirm itemName={selected?.caption??""} onConfirm={handleDelete} onCancel={()=>setModal(null)} loading={saving}/></AdminModal>
  </div>);
}
