# Tangail App — Firestore Database Schema

## Collections Overview

```
firestore/
├── upazilas/
├── hospitals/
├── doctors/
├── ambulances/
├── blood_donors/
├── emergency_contacts/
├── news/
├── businesses/
└── users/
```

---

## 1. upazilas

Tangail has 12 upazilas. This collection is the source of truth for location filtering.

```json
{
  "id": "tangail_sadar",
  "name": "টাঙ্গাইল সদর",
  "nameEn": "Tangail Sadar",
  "thanas": ["tangail_sadar", "porabari"],
  "population": 450000
}
```

**All 12 Upazilas:**
- tangail_sadar, basail, bhuapur, delduar, dhanbari,
  ghatail, gopalpur, kalihati, madhupur, mirzapur,
  nagarpur, sakhipur

---

## 2. hospitals

```json
{
  "id": "auto-generated",
  "name": "শেখ হাসিনা মেডিকেল কলেজ হাসপাতাল",
  "nameEn": "Sheikh Hasina Medical College Hospital",
  "type": "government | private | diagnostic | clinic",
  "upazilaId": "tangail_sadar",
  "address": "হাসপাতাল রোড, টাঙ্গাইল সদর",
  "phone": ["0921-62500", "01XXXXXXXXX"],
  "specialties": ["medicine", "surgery", "gynecology", "pediatrics"],
  "totalBeds": 500,
  "emergencyAvailable": true,
  "isOpen24Hours": true,
  "isVerified": true,
  "rating": 4.2,
  "reviewCount": 1200,
  "imageUrl": "",
  "location": { "lat": 24.2513, "lng": 89.9167 },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## 3. doctors

```json
{
  "id": "auto-generated",
  "name": "ডা. মোহাম্মদ রফিকুল ইসলাম",
  "nameEn": "Dr. Mohammad Rafiqul Islam",
  "specialty": "medicine | surgery | gynecology | pediatrics | orthopedics | cardiology | neurology | dermatology | psychiatry | dentistry | eye | ent",
  "qualifications": ["MBBS", "FCPS (Medicine)"],
  "hospitalId": "hospital_doc_id",
  "hospitalName": "শেখ হাসিনা মেডিকেল কলেজ হাসপাতাল",
  "upazilaId": "tangail_sadar",
  "chamberAddress": "ডাক্তার পাড়া, টাঙ্গাইল",
  "visitingHours": "সকাল ৯টা - দুপুর ১টা",
  "phone": "01XXXXXXXXX",
  "visitFee": 500,
  "isAvailable": true,
  "isVerified": true,
  "rating": 4.5,
  "reviewCount": 320,
  "imageUrl": "",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## 4. ambulances

```json
{
  "id": "auto-generated",
  "name": "আবীর অ্যাম্বুলেন্স সার্ভিস",
  "ownerName": "মো. আবীর হোসেন",
  "phone": "01XXXXXXXXX",
  "alternatePhone": "01XXXXXXXXX",
  "upazilaId": "tangail_sadar",
  "type": "ac | non_ac | icu | freezer",
  "isAvailable": true,
  "isAvailable24Hours": true,
  "rentalCostPerKm": 25,
  "isVerified": true,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## 5. blood_donors

```json
{
  "id": "auto-generated",
  "userId": "firebase_auth_uid",
  "name": "মো. সাকিব হাসান",
  "phone": "01XXXXXXXXX",
  "bloodGroup": "A+ | A- | B+ | B- | AB+ | AB- | O+ | O-",
  "upazilaId": "tangail_sadar",
  "address": "টাঙ্গাইল সদর",
  "lastDonationDate": "timestamp",
  "totalDonations": 5,
  "isAvailable": true,
  "gender": "male | female",
  "age": 25,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## 6. emergency_contacts

```json
{
  "id": "auto-generated",
  "title": "টাঙ্গাইল ফায়ার সার্ভিস",
  "titleEn": "Tangail Fire Service",
  "category": "fire | police | ambulance | hospital | hotline | other",
  "phone": ["199", "0921-XXXXX"],
  "upazilaId": "tangail_sadar",
  "address": "স্টেশন রোড, টাঙ্গাইল",
  "isNational": false,
  "sortOrder": 1
}
```

---

## 7. news

```json
{
  "id": "auto-generated",
  "title": "টাঙ্গাইলে নতুন হাসপাতাল উদ্বোধন",
  "titleEn": "New hospital inaugurated in Tangail",
  "body": "full article text...",
  "category": "health | district | notice | government | general",
  "imageUrl": "",
  "source": "District Administration",
  "isNotice": false,
  "publishedAt": "timestamp",
  "createdAt": "timestamp"
}
```

---

## 8. businesses

```json
{
  "id": "auto-generated",
  "userId": "firebase_auth_uid",
  "name": "ব্যবসার নাম",
  "category": "pharmacy | hotel | restaurant | shop | education | transport | other",
  "upazilaId": "tangail_sadar",
  "address": "ঠিকানা",
  "phone": "01XXXXXXXXX",
  "description": "ব্যবসার বিবরণ",
  "imageUrl": "",
  "isVerified": false,
  "rating": 0,
  "reviewCount": 0,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## 9. users

```json
{
  "id": "firebase_auth_uid",
  "name": "ব্যবহারকারীর নাম",
  "phone": "01XXXXXXXXX",
  "email": "user@example.com",
  "upazilaId": "tangail_sadar",
  "isAdmin": false,
  "profileImageUrl": "",
  "createdAt": "timestamp"
}
```

---

## Firebase Services Used

| Service | Purpose |
|---|---|
| Firebase Auth | Phone/Google login |
| Cloud Firestore | All data storage |
| Firebase Storage | Images (hospital, doctor, business) |
| Firebase Cloud Messaging | Push notifications for news/alerts |
| Firebase Analytics | Usage tracking |
| Firebase Hosting | Next.js web deployment |
