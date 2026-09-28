"use client";
import { useState, useEffect, useCallback } from "react";
import { adminGetAll, adminUpdate, adminDelete } from "@/lib/adminFirestore";
import AdminTable, { Column } from "@/components/admin/AdminTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { UPAZILAS } from "@/lib/constants";
import { CheckCircle, XCircle, Clock, Phone, MapPin } from "lucide-react";

interface BizRequest { id:string; name:string; category:string; upazilaId:string; address:string; phone:string; description:string; ownerName:string; ownerPhone:string; status:string; }
const statusBadge:Record<string,string>={pending:"bg-amber-50 text-amber-700",approved:"bg-green-50 text-green-700",rejected:"bg-red-50 text-red-700"};
const statusLabel:Record<string,string>={pending:"অপেক্ষামান",approved:"অনুমোদিত",rejected:"প্রত্যাখ্যাত"};
const columns:Column<BizRequest>[]=[
  {key:"name",label:"ব্যবসার নাম",render:r=><span className="font-semibold">{r.name}</span>},
  {key:"category",label:"ক্যাটাগরি",render:r=><span className="text-sm text-gray-600">{r.category}</span>},
  {key:"ownerName",label:"মালিক",render:r=><span className="text-sm text-gray-500">{r.ownerName||"—"}</span>},
  {key:"upazilaId",label:"উপজেলা",render:r=><span className="text-sm text-gray-500">{UPAZILAS.find(u=>u.id===r.upazilaId)?.name??r.upazilaId}</span>},
  {key:"status",label:"অবস্থা",render:r=><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadge[r.status]??""}`}>{statusLabel[r.status]??r.status}</span>},
];
export default function AdminBusinessRequestsPage() {
  const [data,setData]=useState<BizRequest[]>([]);const [loading,setLoading]=useState(true);const [search,setSearch]=useState("");const [modal,setModal]=useState<"view"|"delete"|null>(null);const [selected,setSelected]=useState<BizRequest|null>(null);const [saving,setSaving]=useState(false);
  const load=useCallback(async()=>{setLoading(true);setData(await adminGetAll<BizRequest>("business_requests","submittedAt"));setLoading(false);},[]);
  useEffect(()=>{load();},[load]);
  const filtered=data.filter(b=>!search||b.name.toLowerCase().includes(search.toLowerCase())||b.ownerName?.toLowerCase().includes(search.toLowerCase()));
  const handleStatus=async(status:string)=>{if(!selected)return;setSaving(true);try{await adminUpdate("business_requests",selected.id,{status});await load();setModal(null);}finally{setSaving(false);}};
  const handleDelete=async()=>{if(!selected)return;setSaving(true);try{await adminDelete("business_requests",selected.id);await load();setModal(null);}finally{setSaving(false);}};
  const pending=data.filter(d=>d.status==="pending").length;
  return(<div>
    {pending>0&&<div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2 text-amber-700 text-sm font-semibold"><Clock size={16}/>{pending}টি আবেদন অপেক্ষামান</div>}
    <AdminPageHeader total={filtered.length} label="আবেদন" searchValue={search} onSearch={setSearch} onAdd={()=>{}} addLabel=""/>
    <AdminTable columns={columns} data={filtered} loading={loading}
      onEdit={r=>{setSelected(r);setModal("view");}}
      onDelete={r=>{setSelected(r);setModal("delete");}}
    />
    {/* View & Approve modal */}
    <AdminModal open={modal==="view"} onClose={()=>setModal(null)} title="ব্যবসার আবেদন বিস্তারিত" size="md">
      {selected&&(
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-800 text-lg">{selected.name}</h3>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusBadge[selected.status]??""}`}>{statusLabel[selected.status]??selected.status}</span>
            </div>
            <p className="text-sm text-primary font-semibold">{selected.category}</p>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-400"/>{selected.address} — {UPAZILAS.find(u=>u.id===selected.upazilaId)?.name}</div>
            <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400"/>{selected.phone}</div>
            {selected.ownerName&&<div className="flex items-center gap-2"><span className="text-gray-400 text-xs w-16">মালিক:</span>{selected.ownerName} — {selected.ownerPhone}</div>}
            {selected.description&&<div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 mt-2">{selected.description}</div>}
          </div>
          {selected.status==="pending"&&(
            <div className="flex gap-3 pt-3 border-t border-gray-100">
              <button onClick={()=>handleStatus("rejected")} disabled={saving} className="flex-1 py-2.5 border border-red-200 text-red-600 font-semibold text-sm rounded-xl hover:bg-red-50 disabled:opacity-60 flex items-center justify-center gap-2"><XCircle size={15}/>প্রত্যাখ্যান</button>
              <button onClick={()=>handleStatus("approved")} disabled={saving} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-xl disabled:opacity-60 flex items-center justify-center gap-2">{saving?<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>:<CheckCircle size={15}/>}অনুমোদন</button>
            </div>
          )}
        </div>
      )}
    </AdminModal>
    <AdminModal open={modal==="delete"} onClose={()=>setModal(null)} title="আবেদন মুছুন" size="sm"><DeleteConfirm itemName={selected?.name??""} onConfirm={handleDelete} onCancel={()=>setModal(null)} loading={saving}/></AdminModal>
  </div>);
}
