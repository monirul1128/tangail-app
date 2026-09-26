import { Phone } from "lucide-react";

interface CallButtonProps {
  phone: string;
  label?: string;
  className?: string;
  block?: boolean;
}

export default function CallButton({
  phone,
  label,
  className = "",
  block = false,
}: CallButtonProps) {
  return (
    <a
      href={`tel:${phone}`}
      className={`btn-call ${block ? "w-full justify-center" : ""} ${className}`}
    >
      <Phone size={15} />
      {label ?? phone}
    </a>
  );
}
