# অ্যাডমিন সেটআপ গাইড

## ১. Firebase Authentication-এ অ্যাডমিন ব্যবহারকারী তৈরি করুন

Firebase Console → Authentication → Users → Add User

```
Email:    admin@amadeртангайл.com  (যেকোনো ইমেইল)
Password: (শক্তিশালী পাসওয়ার্ড দিন)
```

User তৈরি হলে **UID** কপি করুন।

---

## ২. Firestore-এ Admin Flag সেট করুন

Firebase Console → Firestore → `users` collection → Add document

```
Document ID: <উপরের UID>
Fields:
  name:    "Admin"         (string)
  email:   "admin@..."    (string)
  isAdmin: true           (boolean)
  phone:   ""             (string)
```

---

## ৩. Admin Panel-এ লগইন করুন

আপনার সাইট URL + `/admin/login`

উদাহরণ: `https://amadeтangail.vercel.app/admin/login`

---

## ৪. Firebase Storage CORS সেটআপ (ছবি আপলোডের জন্য)

Firebase CLI দিয়ে CORS কনফিগ করুন:

```bash
# cors.json ফাইল তৈরি করুন
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]

# Apply করুন
gsutil cors set cors.json gs://YOUR_BUCKET_NAME.appspot.com
```

---

## ৫. Admin URL

```
/admin          → ড্যাশবোর্ড
/admin/login    → লগইন
/admin/hospitals   → হাসপাতাল CRUD
/admin/doctors     → ডাক্তার CRUD
/admin/ambulances  → অ্যাম্বুলেন্স CRUD
/admin/blood-donors → রক্তদাতা CRUD
/admin/news        → খবর CRUD
/admin/emergency   → জরুরি নম্বর CRUD
/admin/pharmacy    → ফার্মেসি CRUD
/admin/education   → শিক্ষা প্রতিষ্ঠান CRUD
/admin/jobs        → চাকরি CRUD
/admin/transport   → পরিবহন CRUD
/admin/finance     → আর্থিক সেবা CRUD
/admin/professionals → পেশাদার সেবা CRUD
/admin/organizations → সংগঠন CRUD
/admin/tourism     → পর্যটন CRUD
/admin/gallery     → গ্যালারি CRUD
/admin/business-requests → ব্যবসা আবেদন
```
