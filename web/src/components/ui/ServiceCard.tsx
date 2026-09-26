import { Phone, MapPin, Clock, BadgeCheck } from "lucide-react";

export interface ServiceItem {
  id: string;
  name: string;
  subtitle?: string;
  address?: string;
  phone?: string;
  phone2?: string;
  hours?: string;
  verified?: boolean;
  badge?: string;
  badgeColor?: string;
  extra?: string;
}

interface Props {
  item: ServiceItem;
  accentColor?: string;
}

export default function ServiceCard({ item, accentColor = "text-primary" }: Props) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Name + verified */}
          <div className="flex items-center flex-wrap gap-1.5 mb-1">
            <h3 className="font-bold text-gray-800 text-sm leading-snug">{item.name}</h3>
            {item.verified && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">
                <BadgeCheck size={10} /> ভেরিফাইড
              </span>
            )}
          </div>

          {/* Subtitle / specialty */}
          {item.subtitle && (
            <p className={`text-xs font-semibold ${accentColor} mb-1.5`}>{item.subtitle}</p>
          )}

          {/* Badge */}
          {item.badge && (
            <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 ${item.badgeColor ?? "bg-gray-100 text-gray-600"}`}>
              {item.badge}
            </span>
          )}

          {/* Address */}
          {item.address && (
            <div className="flex items-start gap-1.5 text-xs text-gray-500 mb-1">
              <MapPin size={12} className="mt-0.5 flex-shrink-0" />
              <span>{item.address}</span>
            </div>
          )}

          {/* Hours */}
          {item.hours && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <Clock size={12} className="flex-shrink-0" />
              <span>{item.hours}</span>
            </div>
          )}

          {/* Extra info */}
          {item.extra && (
            <p className="text-xs text-gray-400 mt-1">{item.extra}</p>
          )}
        </div>
      </div>

      {/* Phone buttons */}
      {(item.phone || item.phone2) && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {item.phone && (
            <a href={`tel:${item.phone}`}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
              <Phone size={12} /> {item.phone}
            </a>
          )}
          {item.phone2 && (
            <a href={`tel:${item.phone2}`}
              className="flex items-center gap-1.5 bg-green-100 hover:bg-green-200 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
              <Phone size={12} /> {item.phone2}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
