"use client";
import { useState, useEffect, useCallback } from "react";
import { adminGetAll, adminAdd, adminUpdate, adminDelete } from "@/lib/adminFirestore";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormField from "@/components/admin/AdminFormField";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { UPAZILAS, BLOOD_GROUPS } from "@/lib/constants";

interface BloodDonor {
  id: string; userId: string; name: string; phone: string;
  bloodGroup: string; upazilaId: string; address: string;
  totalDonations: number; isAvailable: boolean; gender: string; age: number;
}

const empty = (): Omit<BloodDonor,"id"> => ({
  userId:"", name:"", phone:"", bloodGroup:"A+", upazilaId:"tangail_sadar",
  address:"", totalDonations:0, isAvailable:true, gender:"male", age:25,
});

const columns: Column<BloodDonor>[] = [
  { key:"name",       label:"নাম",         render: r => <span className="font-semibold">{r.name}</span> },
  { key:"bloodGroup", label:"রক্তের গ্রুপ", render: r => <span className="w-9 h-9 bg-red-600 text-white text-sm font-black rounded-full flex items-center justify-center">{r.bloodGroup}</span> },
  { key:"phone",      label:"ফোন",          render: r => <span className="text-green-700 text-sm">{r.phone}</span> },
  { key:"upazilaId",  label:"উপজেলা",       render: r => <span className="text-gray-500 text-sm">{UPAZILAS.find(u=>u.id===r.upazilaId)?.name??r.upazilaId}</span> },
  { key:"totalDonations", label:"দানের সংখ্যা", render: r => <span className="text-sm font-semibold text-primary">{r.totalDonations}</span> },
  { key:"isAvailable",label:"উপলব্ধ",       render: r => <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.isAvailable?"bg-green-50 text-green-700":"bg-gray-100 text-gray-500"}`}>{r.isAvailable?"হ্যাঁ":"না"}</span> },
];

export default function AdminBloodDonorsPage() {
  const [data,setData]=useState<BloodDonor[]>([]); const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState(""); const [modal,setModal]=useState<"add"|"edit"|"delete"|null>(null);
  const [selected,setSelected]=useState<BloodDonor|null>(null); const [form,setForm]=useState(empty()); const [saving,setSaving]=useState(false);
  const load=useCallback(async()=>{setLoading(true);setData(await adminGetAll<BloodDonor>("blood_donors","name"));setLoading(false);},[]);
  useEffect(()=>{load();},[load]);
  const set=(k:string,v:any)=>setForm(f=>({...f,[k]:v}));
  const filtered=data.filter(d=>!search||d.name.toLowerCase().includes(search.toLowerCase())||d.bloodGroup===search||d.phone.includes(search));
  const handleSave=async()=>{setSaving(true);try{const p={...form,totalDonations:Number(form.totalDonations),age:Number(form.age)};if(modal==="add")await adminAdd("blood_donors",p);else if(selected)await adminUpdate("blood_donors",selected.id,p);await load();setModal(null);}finally{setSaving(false);}};
  const handleDelete=async()=>{if(!selected)return;setSaving(true);try{await adminDelete("blood_donors",selected.id);await load();setModal(null);}finally{setSaving(false);}};
  return (
    <div>
      <AdminPageHeader total={filtered.length} label="রক্তদাতা" searchValue={search} onSearch={setSearch} onAdd={()=>{setForm(empty());setModal("add");}} addLabel="রক্তদাতা যোগ করুন"/>
      <AdminTable columns={columns} data={filtered} loading={loading} onEdit={r=>{setSelected(r);setForm({...r});setModal("edit");}} onDelete={r=>{setSelected(r);setModal("delete");}}/>
      <AdminModal open={modal==="add"||modal==="edit"} onClose={()=>setModal(null)} title={modal==="add"?"নতুন রক্তদাতা যোগ করুন":"রক্তদাতা সম্পাদনা"} size="md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminFormField type="text" label="পূর্ণ নাম" required value={form.name} onChange={v=>set("name",v)}/>
          <AdminFormField type="tel"  label="ফোন নম্বর" required value={form.phone} onChange={v=>set("phone",v)} placeholder="01XXXXXXXXX"/>
          <AdminFormField type="select" label="রক্তের গ্রুপ" required value={form.bloodGroup} onChange={v=>set("bloodGroup",v)} options={[...BLOOD_GROUPS].map(g=>({value:g,label:g}))}/>
          <AdminFormField type="select" label="উপজেলা" value={form.upazilaId} onChange={v=>set("upazilaId",v)} options={[...UPAZILAS].map(u=>({value:u.id,label:u.name}))}/>
          <AdminFormField type="select" label="লিঙ্গ" value={form.gender} onChange={v=>set("gender",v)} options={[{value:"male",label:"পুরুষ"},{value:"female",label:"মহিলা"}]}/>
          <AdminFormField type="number" label="বয়স" value={form.age} onChange={v=>set("age",v)}/>
          <div className="sm:col-span-2"><AdminFormField type="text" label="ঠিকানা" value={form.address} onChange={v=>set("address",v)}/></div>
          <AdminFormField type="number" label="মোট দানের সংখ্যা" value={form.totalDonations} onChange={v=>set("totalDonations",v)}/>
          <AdminFormField type="toggle" label="এখন উপলব্ধ" value={form.isAvailable} onChange={v=>set("isAvailable",v)}/>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={()=>setModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold">বাতিল</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
            {saving&&<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
            {modal==="add"?"যোগ করুন":"আপডেট করুন"}
          </button>
        </div>
      </AdminModal>
      <AdminModal open={modal==="delete"} onClose={()=>setModal(null)} title="রক্তদাতা মুছুন" size="sm">
        <DeleteConfirm itemName={selected?.name??""} onConfirm={handleDelete} onCancel={()=>setModal(null)} loading={saving}/>
      </AdminModal>
    </div>
  );
}
