export const COLLECTIONS = {
  hospitals:          "hospitals",
  doctors:            "doctors",
  ambulances:         "ambulances",
  blood_donors:       "blood_donors",
  emergency_contacts: "emergency_contacts",
  news:               "news",
  businesses:         "businesses",
  upazilas:           "upazilas",
  users:              "users",
} as const;

export const UPAZILAS = [
  { id: "tangail_sadar", name: "টাঙ্গাইল সদর" },
  { id: "basail",        name: "বাসাইল" },
  { id: "bhuapur",       name: "ভূয়াপুর" },
  { id: "delduar",       name: "দেলদুয়ার" },
  { id: "dhanbari",      name: "ধনবাড়ী" },
  { id: "ghatail",       name: "ঘাটাইল" },
  { id: "gopalpur",      name: "গোপালপুর" },
  { id: "kalihati",      name: "কালিহাতী" },
  { id: "madhupur",      name: "মধুপুর" },
  { id: "mirzapur",      name: "মির্জাপুর" },
  { id: "nagarpur",      name: "নাগরপুর" },
  { id: "sakhipur",      name: "সখিপুর" },
] as const;

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

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
};

export const HOSPITAL_TYPES: Record<string, string> = {
  government: "সরকারি",
  private:    "বেসরকারি",
  diagnostic: "ডায়াগনস্টিক",
  clinic:     "ক্লিনিক",
};

export const AMBULANCE_TYPES: Record<string, string> = {
  ac:     "এসি অ্যাম্বুলেন্স",
  non_ac: "নন-এসি অ্যাম্বুলেন্স",
  icu:    "আইসিইউ অ্যাম্বুলেন্স",
  freezer:"ফ্রিজার ভ্যান",
};
