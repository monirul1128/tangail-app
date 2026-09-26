export const COLLECTIONS = {
  // Existing
  hospitals:           "hospitals",
  doctors:             "doctors",
  ambulances:          "ambulances",
  blood_donors:        "blood_donors",
  emergency_contacts:  "emergency_contacts",
  news:                "news",
  upazilas:            "upazilas",
  users:               "users",
  businesses:          "businesses",
  // New
  pharmacies:          "pharmacies",
  education:           "education",
  transport:           "transport",
  finance:             "finance",
  professionals:       "professionals",
  organizations:       "organizations",
  jobs:                "jobs",
  tourism:             "tourism",
  gallery:             "gallery",
  notable_persons:     "notable_persons",
  business_requests:   "business_requests",
} as const;

export const UPAZILAS = [
  { id: "tangail_sadar", name: "টাঙ্গাইল সদর" },
  { id: "basail",        name: "বাসাইল"        },
  { id: "bhuapur",       name: "ভূয়াপুর"       },
  { id: "delduar",       name: "দেলদুয়ার"      },
  { id: "dhanbari",      name: "ধনবাড়ী"        },
  { id: "ghatail",       name: "ঘাটাইল"        },
  { id: "gopalpur",      name: "গোপালপুর"      },
  { id: "kalihati",      name: "কালিহাতী"      },
  { id: "madhupur",      name: "মধুপুর"        },
  { id: "mirzapur",      name: "মির্জাপুর"     },
  { id: "nagarpur",      name: "নাগরপুর"       },
  { id: "sakhipur",      name: "সখিপুর"        },
] as const;

export const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"] as const;

export const SPECIALTIES: Record<string, string> = {
  medicine:    "মেডিসিন",
  surgery:     "সার্জারি",
  gynecology:  "গাইনী",
  pediatrics:  "শিশু রোগ",
  orthopedics: "অর্থোপেডিক",
  cardiology:  "হৃদরোগ",
  neurology:   "নিউরোলজি",
  dermatology: "চর্মরোগ",
  psychiatry:  "মানসিক রোগ",
  dentistry:   "দাঁতের রোগ",
  eye:         "চোখের রোগ",
  ent:         "নাক-কান-গলা",
  diabetes:    "ডায়াবেটিস",
  nephrology:  "কিডনি রোগ",
  oncology:    "ক্যান্সার রোগ",
  homeo:       "হোমিওপ্যাথি",
};

export const HOSPITAL_TYPES: Record<string, string> = {
  government: "সরকারি",
  private:    "বেসরকারি",
  diagnostic: "ডায়াগনস্টিক",
  clinic:     "ক্লিনিক",
};

export const AMBULANCE_TYPES: Record<string, string> = {
  ac:      "এসি অ্যাম্বুলেন্স",
  non_ac:  "নন-এসি অ্যাম্বুলেন্স",
  icu:     "আইসিইউ অ্যাম্বুলেন্স",
  freezer: "ফ্রিজার ভ্যান",
};

export const EDUCATION_TYPES: Record<string, string> = {
  school:     "স্কুল",
  college:    "কলেজ",
  university: "বিশ্ববিদ্যালয়",
  madrasa:    "মাদ্রাসা",
  library:    "লাইব্রেরি",
  training:   "ট্রেনিং সেন্টার",
  other:      "অন্যান্য",
};

export const BUSINESS_CATEGORIES: Record<string, string> = {
  hotel:       "হোটেল (আবাসিক)",
  restaurant:  "রেস্টুরেন্ট",
  beauty:      "বিউটি পার্লার",
  nursery:     "নার্সারি",
  agriculture: "কৃষি সেবা",
  shop:        "দোকান/শোরুম",
  other:       "অন্যান্য",
};

export const TRANSPORT_TYPES: Record<string, string> = {
  bus:     "বাস কাউন্টার",
  train:   "ট্রেন সার্ভিস",
  rentcar: "রেন্ট এ কার",
  cng:     "সিএনজি স্টেশন",
  fuel:    "ফুয়েল স্টেশন",
  courier: "কুরিয়ার সার্ভিস",
};

export const FINANCE_TYPES: Record<string, string> = {
  bank:           "ব্যাংক",
  atm:            "এটিএম",
  mobile_banking: "মোবাইল ব্যাংকিং",
  market:         "ক্রয়-বিক্রয়",
};

export const PROFESSIONAL_TYPES: Record<string, string> = {
  lawyer:     "আইনজীবী",
  journalist: "সাংবাদিক",
  technician: "টেকনিশিয়ান",
  kazi:       "কাজি অফিস",
  other:      "অন্যান্য",
};

export const ORGANIZATION_TYPES: Record<string, string> = {
  govt:     "সরকারি",
  ngo:      "এনজিও",
  business: "ব্যবসায়িক",
  cultural: "সাংস্কৃতিক",
  sports:   "ক্রীড়া",
  social:   "সামাজিক",
  service:  "সেবামূলক",
};

export const JOB_TYPES: Record<string, string> = {
  govt:    "সরকারি",
  private: "বেসরকারি",
  bank:    "ব্যাংক",
  ngo:     "এনজিও",
};

export const TOURISM_CATEGORIES: Record<string, string> = {
  historical:  "ঐতিহাসিক",
  nature:      "প্রকৃতি",
  entertainment:"বিনোদন",
  education:   "শিক্ষা ও সংস্কৃতি",
  modern:      "আধুনিক স্থাপনা",
};

export const NOTABLE_PERSON_CATEGORIES: Record<string, string> = {
  politics:   "রাজনীতি",
  literature: "সাহিত্য",
  social:     "সমাজসেবা",
  art:        "শিল্প-সংস্কৃতি",
  sports:     "ক্রীড়া",
  other:      "অন্যান্য",
};
