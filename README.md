# টাঙ্গাইল জেলা অ্যাপ

টাঙ্গাইল জেলার হাসপাতাল, ডাক্তার, অ্যাম্বুলেন্স, রক্তদাতা এবং জরুরি সেবার সম্পূর্ণ ডিরেক্টরি।

---

## Project Structure

```
tangail-app/
├── mobile/          ← Flutter app (Android + iOS)
├── web/             ← Next.js web app
└── firebase/        ← Firestore rules, indexes, seed data
    ├── SCHEMA.md
    ├── firestore-rules/
    └── seed-data/
```

---

## Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Mobile     | Flutter + Dart                |
| Web        | Next.js 14 + TypeScript + Tailwind CSS |
| Backend    | Firebase (Firestore, Auth, Storage, FCM) |
| State      | Flutter Riverpod / React Server Components |

---

## Getting Started

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project: `tangail-app`
3. Enable **Firestore Database**, **Authentication** (Phone), **Storage**
4. Deploy Firestore rules:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes
   ```
5. Upload seed data from `firebase/seed-data/` using the Firebase Console or a seed script

### 2. Flutter (Mobile)

```bash
cd mobile

# Install Flutter dependencies
flutter pub get

# Configure Firebase (install flutterfire CLI first)
flutterfire configure

# Run on device/emulator
flutter run
```

### 3. Next.js (Web)

```bash
cd web

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local and add your Firebase config values

# Run dev server
npm run dev

# Build for production
npm run build
```

---

## Features

### Mobile (Flutter)
- ✅ Home screen with service grid
- ✅ Hospital listing with upazila + type filter
- ✅ Hospital detail page
- ✅ Doctor listing with specialty filter
- ✅ Doctor detail + appointment call
- ✅ Blood donor search by group + upazila
- ✅ Blood donor registration
- ✅ Ambulance listing
- ✅ News & notices
- ✅ Emergency contacts with direct call
- ✅ Firebase Auth (phone OTP)

### Web (Next.js)
- ✅ SEO-optimised (server-side rendering + ISR)
- ✅ Home page with service grid + latest news
- ✅ Hospital listing + detail pages
- ✅ Doctor listing + detail pages
- ✅ Blood donor search
- ✅ Ambulance listing
- ✅ News & notices
- ✅ Emergency contacts
- ✅ Bangla UI throughout
- ✅ Mobile responsive

---

## Upazilas Covered

টাঙ্গাইল সদর, বাসাইল, ভূয়াপুর, দেলদুয়ার, ধনবাড়ী, ঘাটাইল, গোপালপুর, কালিহাতী, মধুপুর, মির্জাপুর, নাগরপুর, সখিপুর

---

## Next Steps

- [ ] Admin panel (add/edit hospitals, doctors)
- [ ] Google Maps integration for hospital locations  
- [ ] Push notifications for news (FCM)
- [ ] Business directory
- [ ] User reviews and ratings
- [ ] Firebase Hosting deployment
