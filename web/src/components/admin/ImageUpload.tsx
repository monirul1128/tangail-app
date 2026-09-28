"use client";
import { useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle } from "lucide-react";

interface Props {
  value: string;           // current image URL
  onChange: (url: string) => void;
  folder?: string;         // storage folder e.g. "hospitals"
  label?: string;
}

export default function ImageUpload({ value, onChange, folder = "uploads", label = "ছবি আপলোড করুন" }: Props) {
  const [uploading, setUploading]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [error, setError]           = useState("");
  const [dragOver, setDragOver]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    // Validate type
    if (!file.type.startsWith("image/")) {
      setError("শুধুমাত্র ছবি ফাইল আপলোড করা যাবে (JPG, PNG, WEBP)");
      return;
    }
    // Validate size — max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("ছবির সাইজ সর্বোচ্চ ৫ MB হতে পারবে");
      return;
    }

    setError("");
    setUploading(true);
    setProgress(0);

    const ext      = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const storageRef = ref(storage, fileName);

    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => { setError(`আপলোড ব্যর্থ: ${err.message}`); setUploading(false); },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        onChange(url);
        setUploading(false);
        setProgress(100);
      }
    );
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  const handleRemove = async () => {
    if (!value) return;
    try {
      // Only delete if it's a Firebase Storage URL
      if (value.includes("firebasestorage.googleapis.com")) {
        const fileRef = ref(storage, value);
        await deleteObject(fileRef);
      }
    } catch { /* ignore — file may already be deleted */ }
    onChange("");
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-semibold text-gray-700">{label}</p>}

      {/* Preview existing image */}
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="uploaded"
            className="w-full max-w-sm h-40 object-cover rounded-xl border border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-sm transition-colors"
          >
            <X size={13} />
          </button>
          <div className="absolute bottom-2 right-2">
            <CheckCircle size={18} className="text-green-500 drop-shadow" />
          </div>
        </div>
      )}

      {/* Drop zone */}
      {!value && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
            ${dragOver ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"}`}
        >
          {uploading ? (
            <div className="space-y-3">
              <Loader2 size={28} className="text-primary mx-auto animate-spin" />
              <p className="text-sm text-gray-600">আপলোড হচ্ছে... {progress}%</p>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
                <ImageIcon size={22} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">ছবি টেনে আনুন বা ক্লিক করুন</p>
                <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP — সর্বোচ্চ ৫ MB</p>
              </div>
              <div className="flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full">
                  <Upload size={13} /> ফাইল বেছে নিন
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* OR URL input */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">অথবা URL দিন</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com/image.jpg"
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Hidden file input */}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}
