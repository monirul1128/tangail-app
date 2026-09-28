"use client";
import { useState, useEffect, useCallback } from "react";
import { adminGetAll, adminAdd, adminUpdate, adminDelete } from "@/lib/adminFirestore";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormField from "@/components/admin/AdminFormField";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { UPAZILAS } from "@/lib/constants";
import { BadgeCheck } from "lucide-react";

interface Pharmacy { id:string; name:string; ownerName:string; upazilaId:string; address:string; phone:string; phone2:string; hours:string; isOpen24Hours:boolean; isVerified:boolean; }
const empty=():Omit<Pharmacy,"id">=>({name:"",ownerName:"",upazilaId:"tangail_sadar",address:"",phone:"",phone2:"",hours:"সকাল ৮টা - রাত ১০টা",isOpen24Hours:false,isVerified:false});
const columns:Column<Pharmacy>[]=[
  {key:"name",label:"নাম",render:r=><span className="font-semibold">{r.name}</span>},
  {key:"phone",label:"ফোন",render:r=><span className="text-green-700 text-sm">{r.phone}</span>},
  {key:"upazilaId",label:"উপজেলা",render:r=><span className="text-gray-500 text-sm">{UPAZILAS.find(u=>u.id===r.upazilaId)?.name??r.upazilaId}</span>},
  {key:"hours",label:"সময়",render:r=><span className="text-xs text-gray-500">{r.hours}</span>},
  {key:"isVerified",label:"ভেরিফাইড",render:r=>r.isVerified?<BadgeCheck size={16} className="text-green-500"/>:<span className="text-gray-300 text-xs">না</span>},
];
export default function AdminPharmacyPage() {
  const [data,setData]=useState<Pharmacy[]>([]);const [loading,setLoading]=useState(true);const [search,setSearch]=useState("");const [modal,setModal]=useState<"add"|"edit"|"delete"|null>(null);const [selected,setSelected]=useState<Pharmacy|null>(null);const [form,setForm]=useState(empty());const [saving,setSaving]=useState(false);
  const load=useCallback(async()=>{setLoading(true);setData(await adminGetAll<Pharmacy>("pharmacies","name"));setLoading(false);},[]);
  useEffect(()=>{load();},[load]);
  const set=(k:string,v:any)=>setForm(f=>({...f,[k]:v}));
  const filtered=data.filter(p=>!search||p.name.toLowerCase().includes(search.toLowerCase())||p.phone.includes(search));
  const handleSave=async()=>{setSaving(true);try{if(modal==="add")await adminAdd("pharmacies",form);else if(selected)await adminUpdate("pharmacies",selected.id,form);await load();setModal(null);}finally{setSaving(false);}};
  const handleDelete=async()=>{if(!selected)return;setSaving(true);try{await adminDelete("pharmacies",selected.id);await load();setModal(null);}finally{setSaving(false);}};
  return(<div>
    <AdminPageHeader total={filtered.length} label="ফার্মেসি" searchValue={search} onSearch={setSearch} onAdd={()=>{setForm(empty());setModal("add");}} addLabel="ফার্মেসি যোগ করুন"/>
    <AdminTable columns={columns} data={filtered} loading={loading} onEdit={r=>{setSelected(r);setForm({...r});setModal("edit");}} onDelete={r=>{setSelected(r);setModal("delete");}}/>
    <AdminModal open={modal==="add"||modal==="edit"} onClose={()=>setModal(null)} title={modal==="add"?"নতুন ফার্মেসি":"ফার্মেসি সম্পাদনা"} size="md">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AdminFormField type="text" label="ফার্মেসির নাম" required value={form.name} onChange={v=>set("name",v)}/>
        <AdminFormField type="text" label="মালিকের নাম" value={form.ownerName} onChange={v=>set("ownerName",v)}/>
        <AdminFormField type="tel" label="ফোন নম্বর" required value={form.phone} onChange={v=>set("phone",v)} placeholder="01XXXXXXXXX"/>
        <AdminFormField type="tel" label="বিকল্প ফোন" value={form.phone2} onChange={v=>set("phone2",v)}/>
        <AdminFormField type="select" label="উপজেলা" value={form.upazilaId} onChange={v=>set("upazilaId",v)} options={[...UPAZILAS].map(u=>({value:u.id,label:u.name}))}/>
        <AdminFormField type="text" label="সময়" value={form.hours} onChange={v=>set("hours",v)} placeholder="সকাল ৮টা - রাত ১০টা"/>
        <div className="sm:col-span-2"><AdminFormField type="text" label="ঠিকানা" required value={form.address} onChange={v=>set("address",v)}/></div>
        <AdminFormField type="toggle" label="২৪ ঘণ্টা খোলা" value={form.isOpen24Hours} onChange={v=>set("isOpen24Hours",v)}/>
        <AdminFormField type="toggle" label="ভেরিফাইড" value={form.isVerified} onChange={v=>set("isVerified",v)}/>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={()=>setModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold">বাতিল</button>
        <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">{saving&&<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}{modal==="add"?"যোগ করুন":"আপডেট করুন"}</button>
      </div>
    </AdminModal>
    <AdminModal open={modal==="delete"} onClose={()=>setModal(null)} title="ফার্মেসি মুছুন" size="sm"><DeleteConfirm itemName={selected?.name??""} onConfirm={handleDelete} onCancel={()=>setModal(null)} loading={saving}/></AdminModal>
  </div>);
}
