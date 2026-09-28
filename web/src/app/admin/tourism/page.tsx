"use client";
import { useState, useEffect, useCallback } from "react";
import { adminGetAll, adminAdd, adminUpdate, adminDelete } from "@/lib/adminFirestore";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormField from "@/components/admin/AdminFormField";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { UPAZILAS, TOURISM_CATEGORIES } from "@/lib/constants";

interface TourismSpot { id:string; name:string; nameEn:string; category:string; upazilaId:string; address:string; description:string; imageUrl:string; openingHours:string; entryFee:string; tips:string; }
const empty=():Omit<TourismSpot,"id">=>({name:"",nameEn:"",category:"historical",upazilaId:"tangail_sadar",address:"",description:"",imageUrl:"",openingHours:"",entryFee:"বিনামূল্যে",tips:""});
const columns:Column<TourismSpot>[]=[
  {key:"name",label:"নাম",render:r=><span className="font-semibold">{r.name}</span>},
  {key:"category",label:"ক্যাটাগরি",render:r=><span className="text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full">{TOURISM_CATEGORIES[r.category]??r.category}</span>},
  {key:"upazilaId",label:"উপজেলা",render:r=><span className="text-gray-500 text-sm">{UPAZILAS.find(u=>u.id===r.upazilaId)?.name??r.upazilaId}</span>},
  {key:"entryFee",label:"প্রবেশ মূল্য",render:r=><span className="text-sm text-gray-500">{r.entryFee||"—"}</span>},
];
export default function AdminTourismPage() {
  const [data,setData]=useState<TourismSpot[]>([]);const [loading,setLoading]=useState(true);const [search,setSearch]=useState("");const [modal,setModal]=useState<"add"|"edit"|"delete"|null>(null);const [selected,setSelected]=useState<TourismSpot|null>(null);const [form,setForm]=useState(empty());const [saving,setSaving]=useState(false);
  const load=useCallback(async()=>{setLoading(true);setData(await adminGetAll<TourismSpot>("tourism","name"));setLoading(false);},[]);
  useEffect(()=>{load();},[load]);
  const set=(k:string,v:any)=>setForm(f=>({...f,[k]:v}));
  const filtered=data.filter(t=>!search||t.name.toLowerCase().includes(search.toLowerCase()));
  const handleSave=async()=>{setSaving(true);try{if(modal==="add")await adminAdd("tourism",form);else if(selected)await adminUpdate("tourism",selected.id,form);await load();setModal(null);}finally{setSaving(false);}};
  const handleDelete=async()=>{if(!selected)return;setSaving(true);try{await adminDelete("tourism",selected.id);await load();setModal(null);}finally{setSaving(false);}};
  return(<div>
    <AdminPageHeader total={filtered.length} label="পর্যটন স্থান" searchValue={search} onSearch={setSearch} onAdd={()=>{setForm(empty());setModal("add");}} addLabel="স্থান যোগ করুন"/>
    <AdminTable columns={columns} data={filtered} loading={loading} onEdit={r=>{setSelected(r);setForm({...r});setModal("edit");}} onDelete={r=>{setSelected(r);setModal("delete");}}/>
    <AdminModal open={modal==="add"||modal==="edit"} onClose={()=>setModal(null)} title={modal==="add"?"নতুন পর্যটন স্থান":"স্থান সম্পাদনা"} size="lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2"><AdminFormField type="text" label="নাম (বাংলা)" required value={form.name} onChange={v=>set("name",v)}/></div>
        <AdminFormField type="text" label="নাম (ইংরেজি)" value={form.nameEn} onChange={v=>set("nameEn",v)}/>
        <AdminFormField type="select" label="ক্যাটাগরি" value={form.category} onChange={v=>set("category",v)} options={Object.entries(TOURISM_CATEGORIES).map(([k,v])=>({value:k,label:v}))}/>
        <AdminFormField type="select" label="উপজেলা" value={form.upazilaId} onChange={v=>set("upazilaId",v)} options={[...UPAZILAS].map(u=>({value:u.id,label:u.name}))}/>
        <AdminFormField type="text" label="প্রবেশ মূল্য" value={form.entryFee} onChange={v=>set("entryFee",v)} placeholder="বিনামূল্যে"/>
        <div className="sm:col-span-2"><AdminFormField type="text" label="ঠিকানা" required value={form.address} onChange={v=>set("address",v)}/></div>
        <div className="sm:col-span-2"><AdminFormField type="textarea" label="বিবরণ" required value={form.description} onChange={v=>set("description",v)} rows={3}/></div>
        <AdminFormField type="text" label="খোলার সময়" value={form.openingHours} onChange={v=>set("openingHours",v)} placeholder="সকাল ৯টা - বিকেল ৫টা"/>
        <AdminFormField type="url" label="ছবির URL" value={form.imageUrl} onChange={v=>set("imageUrl",v)}/>
        <div className="sm:col-span-2"><AdminFormField type="text" label="ভ্রমণ টিপস" value={form.tips} onChange={v=>set("tips",v)}/></div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={()=>setModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold">বাতিল</button>
        <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">{saving&&<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}{modal==="add"?"যোগ করুন":"আপডেট করুন"}</button>
      </div>
    </AdminModal>
    <AdminModal open={modal==="delete"} onClose={()=>setModal(null)} title="স্থান মুছুন" size="sm"><DeleteConfirm itemName={selected?.name??""} onConfirm={handleDelete} onCancel={()=>setModal(null)} loading={saving}/></AdminModal>
  </div>);
}
