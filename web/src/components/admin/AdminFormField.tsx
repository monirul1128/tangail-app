"use client";
import { ReactNode } from "react";

interface BaseProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
}

interface InputProps extends BaseProps {
  type: "text" | "number" | "email" | "tel" | "url" | "date";
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
}

interface TextareaProps extends BaseProps {
  type: "textarea";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

interface SelectProps extends BaseProps {
  type: "select";
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

interface ToggleProps extends BaseProps {
  type: "toggle";
  value: boolean;
  onChange: (v: boolean) => void;
}

type Props = InputProps | TextareaProps | SelectProps | ToggleProps;

export default function AdminFormField(props: Props) {
  const base = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">
        {props.label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {props.type === "textarea" && (
        <textarea
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          rows={props.rows ?? 3}
          className={`${base} resize-none`}
        />
      )}

      {props.type === "select" && (
        <select
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          className={base}
        >
          <option value="">বেছে নিন</option>
          {props.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}

      {props.type === "toggle" && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => props.onChange(!props.value)}
            className={`w-11 h-6 rounded-full transition-colors relative ${props.value ? "bg-primary" : "bg-gray-200"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${props.value ? "translate-x-5" : "translate-x-0"}`} />
          </button>
          <span className={`text-sm font-medium ${props.value ? "text-primary" : "text-gray-400"}`}>
            {props.value ? "হ্যাঁ / চালু" : "না / বন্ধ"}
          </span>
        </div>
      )}

      {(props.type !== "textarea" && props.type !== "select" && props.type !== "toggle") && (
        <input
          type={props.type}
          value={props.value as string}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          required={props.required}
          className={base}
        />
      )}

      {props.hint && <p className="text-xs text-gray-400">{props.hint}</p>}
      {props.error && <p className="text-xs text-red-500">{props.error}</p>}
    </div>
  );
}
