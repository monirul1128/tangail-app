"use client";
import { useState, useEffect, useCallback } from "react";
import { adminGetAll, adminAdd, adminUpdate, adminDelete } from "@/lib/adminFirestore";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormField from "@/components/admin/AdminFormField";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { UPAZILAS, AMBULANCE_TYPES } from "@/lib/constants";
import { BadgeCheck, Clock } from "lucide-react";

interface Ambulance { id: string; name: string; ownerName: string; phone: string; alternatePhone: string; upazilaId: string; type: string; isAvailable: boolean; isAvailable24Hours: boolean; rentalCostPerKm: number; isVerified: boolean; }
const empty = (): Omit<Ambulance,"id"> => ({ name:"", ownerName:"", phone:"", alternatePhone:"", upazilaId:"tangail_sadar", type:"ac", isAvailable:true, isAvailable24Hours:false, rentalCostPerKm:0, isVerified:false });
const columns: Column<Ambulance>[] = [
  { key:"name",      label:"নাম",       render: r => <span className="font-semibold">{r.name}</span> },
  { key:"type",      label:"ধরন",       render: r => <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{AMBULANCE_TYPES[r.type]??r.type}</span> },
  { key:"phone",     label:"ফোন",       render: r => <span className="text-green-700 text-sm">{r.phone}</span> },
  { key:"upazilaId", label:"উপজেলা",   render: r => <span className="text-gray-500 text-sm">{UPAZILAS.find(u=>u.id===r.upazilaId)?.name??r.upazilaId}</span> },
  { key:"isAvailable24Hours",label:"২৪ঘণ্টা", render: r => r.isAvailable24Hours ? <Clock size={16} className="text-green-500"/> : <span className="text-gray-300 text-xs">না</span> },
  { key:"isVerified",label:"ভেরিফাইড", render: r => r.isVerified ? <BadgeCheck size={16} className="text-green-500"/> : <span className="text-gray-300 text-xs">না</span> },
];

export default function AdminAmbulancesPage() {
  const [data,setData]=useState<Ambulance[]>([]); const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState(""); const [modal,setModal]=useState<"add"|"edit"|"delete"|null>(null);
  const [selected,setSelected]=useState<Ambulance|null>(null); const [form,setForm]=useState(empty()); const [saving,setSaving]=useState(false);
  const load=useCallback(async()=>{setLoading(true);setData(await adminGetAll<Ambulance>("ambulances","name"));setLoading(false);},[]);
  useEffect(()=>{load();},[load]);
  const set=(k:string,v:any)=>setForm(f=>({...f,[k]:v}));
  const filtered=data.filter(a=>!search||a.name.toLowerCase().includes(search.toLowerCase())||a.phone.includes(search));
  const handleSave=async()=>{setSaving(true);try{const p={...form,rentalCostPerKm:Number(form.rentalCostPerKm)};if(modal==="add")await adminAdd("ambulances",p);else if(selected)await adminUpdate("ambulances",selected.id,p);await load();setModal(null);}finally{setSaving(false);}};
  const handleDelete=async()=>{if(!selected)return;setSaving(true);try{await adminDelete("ambulances",selected.id);await load();setModal(null);}finally{setSaving(false);}};
  return (
    <div>
      <AdminPageHeader total={filtered.length} label="অ্যাম্বুলেন্স" searchValue={search} onSearch={setSearch} onAdd={()=>{setForm(empty());setModal("add");}} addLabel="অ্যাম্বুলেন্স যোগ করুন"/>
      <AdminTable columns={columns} data={filtered} loading={loading} onEdit={r=>{setSelected(r);setForm({...r});setModal("edit");}} onDelete={r=>{setSelected(r);setModal("delete");}}/>
      <AdminModal open={modal==="add"||modal==="edit"} onClose={()=>setModal(null)} title={modal==="add"?"নতুন অ্যাম্বুলেন্স যোগ করুন":"অ্যাম্বুলেন্স সম্পাদনা"} size="md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminFormField type="text" label="সার্ভিসের নাম" required value={form.name} onChange={v=>set("name",v)} placeholder="আবীর অ্যাম্বুলেন্স সার্ভিস"/>
          <AdminFormField type="text" label="মালিকের নাম" value={form.ownerName} onChange={v=>set("ownerName",v)}/>
          <AdminFormField type="tel"  label="ফোন নম্বর" required value={form.phone} onChange={v=>set("phone",v)} placeholder="01XXXXXXXXX"/>
          <AdminFormField type="tel"  label="বিকল্প ফোন" value={form.alternatePhone} onChange={v=>set("alternatePhone",v)}/>
          <AdminFormField type="select" label="ধরন" value={form.type} onChange={v=>set("type",v)} options={Object.entries(AMBULANCE_TYPES).map(([k,v])=>({value:k,label:v}))}/>
          <AdminFormField type="select" label="উপজেলা" value={form.upazilaId} onChange={v=>set("upazilaId",v)} options={[...UPAZILAS].map(u=>({value:u.id,label:u.name}))}/>
          <AdminFormField type="number" label="ভাড়া (৳/কিমি)" value={form.rentalCostPerKm} onChange={v=>set("rentalCostPerKm",v)}/>
          <div className="grid grid-cols-3 gap-3 sm:col-span-2">
            <AdminFormField type="toggle" label="উপলব্ধ" value={form.isAvailable} onChange={v=>set("isAvailable",v)}/>
            <AdminFormField type="toggle" label="২৪ ঘণ্টা" value={form.isAvailable24Hours} onChange={v=>set("isAvailable24Hours",v)}/>
            <AdminFormField type="toggle" label="ভেরিফাইড" value={form.isVerified} onChange={v=>set("isVerified",v)}/>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={()=>setModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold">বাতিল</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
            {saving&&<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
            {modal==="add"?"যোগ করুন":"আপডেট করুন"}
          </button>
        </div>
      </AdminModal>
      <AdminModal open={modal==="delete"} onClose={()=>setModal(null)} title="অ্যাম্বুলেন্স মুছুন" size="sm">
        <DeleteConfirm itemName={selected?.name??""} onConfirm={handleDelete} onCancel={()=>setModal(null)} loading={saving}/>
      </AdminModal>
    </div>
  );
}
