"use client";
import { useState, useEffect, useCallback } from "react";
import { adminGetAll, adminAdd, adminUpdate, adminDelete } from "@/lib/adminFirestore";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormField from "@/components/admin/AdminFormField";
import DeleteConfirm from "@/components/admin/DeleteConfirm";

interface EmergencyContact {
  id: string; title: string; titleEn: string;
  category: string; phone: string[]; upazilaId?: string;
  isNational: boolean; sortOrder: number;
}

const categoryOpts = [
  {value:"fire",label:"ফায়ার সার্ভিস"},{value:"police",label:"পুলিশ"},
  {value:"ambulance",label:"অ্যাম্বুলেন্স"},{value:"hospital",label:"হাসপাতাল"},
  {value:"hotline",label:"হটলাইন"},{value:"other",label:"অন্যান্য"},
];
const catEmoji: Record<string,string> = {fire:"🚒",police:"👮",ambulance:"🚑",hospital:"🏥",hotline:"📞",other:"📱"};

const empty = (): Omit<EmergencyContact,"id"> => ({
  title:"",titleEn:"",category:"hotline",phone:[],upazilaId:"",isNational:false,sortOrder:99,
});

const columns: Column<EmergencyContact>[] = [
  { key:"sortOrder",label:"ক্রম",    render: r => <span className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold">{r.sortOrder}</span> },
  { key:"title",    label:"নাম",     render: r => <span className="font-semibold text-gray-800">{r.title}</span> },
  { key:"category", label:"ক্যাটাগরি",render: r => <span className="text-sm">{catEmoji[r.category]??""} {categoryOpts.find(c=>c.value===r.category)?.label??r.category}</span> },
  { key:"phone",    label:"নম্বর",   render: r => <span className="text-green-700 text-sm font-semibold">{Array.isArray(r.phone)?r.phone.join(" / "):r.phone}</span> },
  { key:"isNational",label:"জাতীয়", render: r => r.isNational ? <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold">জাতীয়</span> : <span className="text-gray-300 text-xs">স্থানীয়</span> },
];

export default function AdminEmergencyPage() {
  const [data,setData]=useState<EmergencyContact[]>([]); const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState(""); const [modal,setModal]=useState<"add"|"edit"|"delete"|null>(null);
  const [selected,setSelected]=useState<EmergencyContact|null>(null); const [form,setForm]=useState(empty()); const [saving,setSaving]=useState(false);
  const load=useCallback(async()=>{setLoading(true);setData(await adminGetAll<EmergencyContact>("emergency_contacts","sortOrder"));setLoading(false);},[]);
  useEffect(()=>{load();},[load]);
  const set=(k:string,v:any)=>setForm(f=>({...f,[k]:v}));
  const filtered=data.filter(c=>!search||c.title.toLowerCase().includes(search.toLowerCase()));
  const handleSave=async()=>{
    setSaving(true);
    try{
      const p={...form,
        phone:typeof form.phone==="string"?(form.phone as unknown as string).split(",").map((p:string)=>p.trim()).filter(Boolean):form.phone,
        sortOrder:Number(form.sortOrder),
      };
      if(modal==="add")await adminAdd("emergency_contacts",p);else if(selected)await adminUpdate("emergency_contacts",selected.id,p);
      await load();setModal(null);
    }finally{setSaving(false);}
  };
  const handleDelete=async()=>{if(!selected)return;setSaving(true);try{await adminDelete("emergency_contacts",selected.id);await load();setModal(null);}finally{setSaving(false);}};
  return (
    <div>
      <AdminPageHeader total={filtered.length} label="জরুরি নম্বর" searchValue={search} onSearch={setSearch} onAdd={()=>{setForm(empty());setModal("add");}} addLabel="নম্বর যোগ করুন"/>
      <AdminTable columns={columns} data={filtered} loading={loading} onEdit={r=>{setSelected(r);setForm({...r,phone:Array.isArray(r.phone)?r.phone.join(", "):r.phone} as any);setModal("edit");}} onDelete={r=>{setSelected(r);setModal("delete");}}/>
      <AdminModal open={modal==="add"||modal==="edit"} onClose={()=>setModal(null)} title={modal==="add"?"নতুন জরুরি নম্বর যোগ করুন":"জরুরি নম্বর সম্পাদনা"} size="md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><AdminFormField type="text" label="শিরোনাম (বাংলা)" required value={form.title} onChange={v=>set("title",v)} placeholder="টাঙ্গাইল ফায়ার সার্ভিস"/></div>
          <AdminFormField type="text" label="শিরোনাম (ইংরেজি)" value={form.titleEn} onChange={v=>set("titleEn",v)}/>
          <AdminFormField type="select" label="ক্যাটাগরি" value={form.category} onChange={v=>set("category",v)} options={categoryOpts}/>
          <div className="sm:col-span-2">
            <AdminFormField type="text" label="ফোন নম্বর (কমা দিয়ে)" required value={Array.isArray(form.phone)?form.phone.join(", "):form.phone as any}
              onChange={v=>set("phone",v)} placeholder="999, 0921-62100" hint="একাধিক নম্বর কমা দিয়ে আলাদা করুন"/>
          </div>
          <AdminFormField type="number" label="ক্রম নম্বর" value={form.sortOrder} onChange={v=>set("sortOrder",v)} hint="ছোট সংখ্যা আগে দেখাবে"/>
          <AdminFormField type="toggle" label="জাতীয় নম্বর" value={form.isNational} onChange={v=>set("isNational",v)}/>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={()=>setModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold">বাতিল</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
            {saving&&<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
            {modal==="add"?"যোগ করুন":"আপডেট করুন"}
          </button>
        </div>
      </AdminModal>
      <AdminModal open={modal==="delete"} onClose={()=>setModal(null)} title="নম্বর মুছুন" size="sm">
        <DeleteConfirm itemName={selected?.title??""} onConfirm={handleDelete} onCancel={()=>setModal(null)} loading={saving}/>
      </AdminModal>
    </div>
  );
}
