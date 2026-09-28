"use client";
import { useState, useEffect, useCallback } from "react";
import { adminGetAll, adminAdd, adminUpdate, adminDelete } from "@/lib/adminFirestore";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormField from "@/components/admin/AdminFormField";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { UPAZILAS, TRANSPORT_TYPES } from "@/lib/constants";
import { BadgeCheck } from "lucide-react";

interface Transport { id:string; name:string; type:string; upazilaId:string; address:string; phone:string; phone2:string; route:string; hours:string; isVerified:boolean; }
const empty=():Omit<Transport,"id">=>({name:"",type:"bus",upazilaId:"tangail_sadar",address:"",phone:"",phone2:"",route:"",hours:"",isVerified:false});
const columns:Column<Transport>[]=[
  {key:"name",label:"নাম",render:r=><span className="font-semibold">{r.name}</span>},
  {key:"type",label:"ধরন",render:r=><span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{TRANSPORT_TYPES[r.type]??r.type}</span>},
  {key:"phone",label:"ফোন",render:r=><span className="text-green-700 text-sm">{r.phone||"—"}</span>},
  {key:"upazilaId",label:"উপজেলা",render:r=><span className="text-gray-500 text-sm">{UPAZILAS.find(u=>u.id===r.upazilaId)?.name??r.upazilaId}</span>},
  {key:"isVerified",label:"ভেরিফাইড",render:r=>r.isVerified?<BadgeCheck size={16} className="text-green-500"/>:<span className="text-gray-300 text-xs">না</span>},
];
export default function AdminTransportPage() {
  const [data,setData]=useState<Transport[]>([]);const [loading,setLoading]=useState(true);const [search,setSearch]=useState("");const [modal,setModal]=useState<"add"|"edit"|"delete"|null>(null);const [selected,setSelected]=useState<Transport|null>(null);const [form,setForm]=useState(empty());const [saving,setSaving]=useState(false);
  const load=useCallback(async()=>{setLoading(true);setData(await adminGetAll<Transport>("transport","name"));setLoading(false);},[]);
  useEffect(()=>{load();},[load]);
  const set=(k:string,v:any)=>setForm(f=>({...f,[k]:v}));
  const filtered=data.filter(t=>!search||t.name.toLowerCase().includes(search.toLowerCase()));
  const handleSave=async()=>{setSaving(true);try{if(modal==="add")await adminAdd("transport",form);else if(selected)await adminUpdate("transport",selected.id,form);await load();setModal(null);}finally{setSaving(false);}};
  const handleDelete=async()=>{if(!selected)return;setSaving(true);try{await adminDelete("transport",selected.id);await load();setModal(null);}finally{setSaving(false);}};
  return(<div>
    <AdminPageHeader total={filtered.length} label="পরিবহন" searchValue={search} onSearch={setSearch} onAdd={()=>{setForm(empty());setModal("add");}} addLabel="সেবা যোগ করুন"/>
    <AdminTable columns={columns} data={filtered} loading={loading} onEdit={r=>{setSelected(r);setForm({...r});setModal("edit");}} onDelete={r=>{setSelected(r);setModal("delete");}}/>
    <AdminModal open={modal==="add"||modal==="edit"} onClose={()=>setModal(null)} title={modal==="add"?"নতুন পরিবহন সেবা":"পরিবহন সম্পাদনা"} size="md">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2"><AdminFormField type="text" label="নাম" required value={form.name} onChange={v=>set("name",v)}/></div>
        <AdminFormField type="select" label="ধরন" value={form.type} onChange={v=>set("type",v)} options={Object.entries(TRANSPORT_TYPES).map(([k,v])=>({value:k,label:v}))}/>
        <AdminFormField type="select" label="উপজেলা" value={form.upazilaId} onChange={v=>set("upazilaId",v)} options={[...UPAZILAS].map(u=>({value:u.id,label:u.name}))}/>
        <AdminFormField type="tel" label="ফোন" required value={form.phone} onChange={v=>set("phone",v)}/>
        <AdminFormField type="tel" label="বিকল্প ফোন" value={form.phone2} onChange={v=>set("phone2",v)}/>
        <div className="sm:col-span-2"><AdminFormField type="text" label="ঠিকানা" required value={form.address} onChange={v=>set("address",v)}/></div>
        <AdminFormField type="text" label="রুট / গন্তব্য" value={form.route} onChange={v=>set("route",v)} placeholder="ঢাকা - টাঙ্গাইল"/>
        <AdminFormField type="text" label="সময়" value={form.hours} onChange={v=>set("hours",v)}/>
        <AdminFormField type="toggle" label="ভেরিফাইড" value={form.isVerified} onChange={v=>set("isVerified",v)}/>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={()=>setModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold">বাতিল</button>
        <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">{saving&&<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}{modal==="add"?"যোগ করুন":"আপডেট করুন"}</button>
      </div>
    </AdminModal>
    <AdminModal open={modal==="delete"} onClose={()=>setModal(null)} title="পরিবহন মুছুন" size="sm"><DeleteConfirm itemName={selected?.name??""} onConfirm={handleDelete} onCancel={()=>setModal(null)} loading={saving}/></AdminModal>
  </div>);
}
