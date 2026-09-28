"use client";
import { useState, useEffect, useCallback } from "react";
import { adminGetAll, adminAdd, adminUpdate, adminDelete } from "@/lib/adminFirestore";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormField from "@/components/admin/AdminFormField";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { UPAZILAS, ORGANIZATION_TYPES } from "@/lib/constants";
import { BadgeCheck } from "lucide-react";

interface Org { id:string; name:string; type:string; description:string; upazilaId:string; address:string; phone:string; email:string; foundedYear:number; isVerified:boolean; }
const empty=():Omit<Org,"id">=>({name:"",type:"social",description:"",upazilaId:"tangail_sadar",address:"",phone:"",email:"",foundedYear:2000,isVerified:false});
const columns:Column<Org>[]=[
  {key:"name",label:"নাম",render:r=><span className="font-semibold">{r.name}</span>},
  {key:"type",label:"ধরন",render:r=><span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{ORGANIZATION_TYPES[r.type]??r.type}</span>},
  {key:"phone",label:"ফোন",render:r=><span className="text-green-700 text-sm">{r.phone||"—"}</span>},
  {key:"upazilaId",label:"উপজেলা",render:r=><span className="text-gray-500 text-sm">{UPAZILAS.find(u=>u.id===r.upazilaId)?.name??r.upazilaId}</span>},
  {key:"isVerified",label:"ভেরিফাইড",render:r=>r.isVerified?<BadgeCheck size={16} className="text-green-500"/>:<span className="text-gray-300 text-xs">না</span>},
];
export default function AdminOrganizationsPage() {
  const [data,setData]=useState<Org[]>([]);const [loading,setLoading]=useState(true);const [search,setSearch]=useState("");const [modal,setModal]=useState<"add"|"edit"|"delete"|null>(null);const [selected,setSelected]=useState<Org|null>(null);const [form,setForm]=useState(empty());const [saving,setSaving]=useState(false);
  const load=useCallback(async()=>{setLoading(true);setData(await adminGetAll<Org>("organizations","name"));setLoading(false);},[]);
  useEffect(()=>{load();},[load]);
  const set=(k:string,v:any)=>setForm(f=>({...f,[k]:v}));
  const filtered=data.filter(o=>!search||o.name.toLowerCase().includes(search.toLowerCase()));
  const handleSave=async()=>{setSaving(true);try{const p={...form,foundedYear:Number(form.foundedYear)};if(modal==="add")await adminAdd("organizations",p);else if(selected)await adminUpdate("organizations",selected.id,p);await load();setModal(null);}finally{setSaving(false);}};
  const handleDelete=async()=>{if(!selected)return;setSaving(true);try{await adminDelete("organizations",selected.id);await load();setModal(null);}finally{setSaving(false);}};
  return(<div>
    <AdminPageHeader total={filtered.length} label="সংগঠন" searchValue={search} onSearch={setSearch} onAdd={()=>{setForm(empty());setModal("add");}} addLabel="সংগঠন যোগ করুন"/>
    <AdminTable columns={columns} data={filtered} loading={loading} onEdit={r=>{setSelected(r);setForm({...r});setModal("edit");}} onDelete={r=>{setSelected(r);setModal("delete");}}/>
    <AdminModal open={modal==="add"||modal==="edit"} onClose={()=>setModal(null)} title={modal==="add"?"নতুন সংগঠন":"সংগঠন সম্পাদনা"} size="lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2"><AdminFormField type="text" label="সংগঠনের নাম" required value={form.name} onChange={v=>set("name",v)}/></div>
        <AdminFormField type="select" label="ধরন" value={form.type} onChange={v=>set("type",v)} options={Object.entries(ORGANIZATION_TYPES).map(([k,v])=>({value:k,label:v}))}/>
        <AdminFormField type="select" label="উপজেলা" value={form.upazilaId} onChange={v=>set("upazilaId",v)} options={[...UPAZILAS].map(u=>({value:u.id,label:u.name}))}/>
        <AdminFormField type="tel" label="ফোন" value={form.phone} onChange={v=>set("phone",v)}/>
        <AdminFormField type="email" label="ইমেইল" value={form.email} onChange={v=>set("email",v)}/>
        <AdminFormField type="number" label="প্রতিষ্ঠার সাল" value={form.foundedYear} onChange={v=>set("foundedYear",v)}/>
        <div className="sm:col-span-2"><AdminFormField type="text" label="ঠিকানা" value={form.address} onChange={v=>set("address",v)}/></div>
        <div className="sm:col-span-2"><AdminFormField type="textarea" label="বিবরণ" value={form.description} onChange={v=>set("description",v)} rows={2}/></div>
        <AdminFormField type="toggle" label="ভেরিফাইড" value={form.isVerified} onChange={v=>set("isVerified",v)}/>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={()=>setModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold">বাতিল</button>
        <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">{saving&&<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}{modal==="add"?"যোগ করুন":"আপডেট করুন"}</button>
      </div>
    </AdminModal>
    <AdminModal open={modal==="delete"} onClose={()=>setModal(null)} title="সংগঠন মুছুন" size="sm"><DeleteConfirm itemName={selected?.name??""} onConfirm={handleDelete} onCancel={()=>setModal(null)} loading={saving}/></AdminModal>
  </div>);
}
