# Implementation Plan — আমাদের টাঙ্গাইল Flutter App

**Stop-condition contract:** The implement-and-review loop reads
`c:\Users\360\Downloads\zella app\tangail-app\mobile\.agents\tasks\review.json`
for `{"verdict": "APPROVED" | "CHANGES_REQUESTED"}`.

---

- [ ] 1. Update `lib/config/app_constants.dart` — add all new collection name constants
      (`colPharmacies`, `colEducation`, `colTransport`, `colFinance`, `colGovtServices`,
      `colPoliceStations`, `colElectricityOffices`, `colIslamic`, `colProfessionals`,
      `colOrganizations`, `colJobs`, `colNotablePersons`, `colTourism`, `colGallery`);
      add `upazilas` list with id/name/unionCount/area for all 12 upazilas; add
      `serviceCategories` list of 10 {icon, label, route, color} maps; add
      `quickServicePills` list.
      Files: `lib/config/app_constants.dart`
      Verify: `flutter analyze lib/config/app_constants.dart` — no errors.

- [ ] 2. Create new models (one file each)
      a) `lib/models/generic_service_model.dart` — fields: id, name, type, upazilaId,
         address, phone (List), imageUrl, description, isVerified, collectionName.
         fromFirestore factory.
      b) `lib/models/notable_person_model.dart` — id, name, nameEn, designation, bio,
         imageUrl, category, birthYear.
      c) `lib/models/tourism_model.dart` — id, name, description, category, imageUrl,
         address, upazilaId, openingHours, entryFee, location (GeoPoint?).
      d) `lib/models/gallery_item_model.dart` — id, imageUrl, caption, category,
         createdAt (DateTime).
      e) `lib/models/prayer_times_model.dart` — fajr, dhuhr, asr, maghrib, isha
         (all String in HH:MM 24h from API), date (String).
      Files: `lib/models/generic_service_model.dart`, `lib/models/notable_person_model.dart`,
             `lib/models/tourism_model.dart`, `lib/models/gallery_item_model.dart`,
             `lib/models/prayer_times_model.dart`
      Verify: `flutter analyze lib/models/` — no errors.

- [ ] 3. Create new services
      a) `lib/services/generic_service_service.dart` — `GenericServiceService` with
         `getItems(collectionName, {upazilaId?, type?})` returning
         `Stream<List<GenericServiceModel>>`; `getItemById(collectionName, id)` returning
         `Future<GenericServiceModel?>`.
      b) `lib/services/prayer_times_service.dart` — `PrayerTimesService` with
         `fetchTodayTimings()` returning `Future<PrayerTimesModel>`. Uses `http` package
         to GET `https://api.aladhan.com/v1/timings/{YYYY-MM-DD}?latitude=24.2513
         &longitude=89.9167&method=1&school=1&timezone=Asia/Dhaka`. Parses
         `data.timings` → PrayerTimesModel. Handles 200/error gracefully (returns
         default zeroed model on failure).
      Files: `lib/services/generic_service_service.dart`,
             `lib/services/prayer_times_service.dart`
      Verify: `flutter analyze lib/services/` — no errors.

- [ ] 4. Create shared reusable widgets
      a) `lib/widgets/filter_chip_row.dart` — `FilterChipRow` widget: takes
         `List<{String id, String label}>`, `String selected`, accent color,
         `ValueChanged<String> onChanged`. Renders horizontal scrolling FilterChips.
      b) `lib/widgets/shimmer_list.dart` — `ShimmerList(itemCount)`: renders
         shimmer-animated placeholder list rows using `shimmer` package.
      c) `lib/widgets/empty_state.dart` — `EmptyState({IconData icon, String message,
         VoidCallback? onRetry})`: centered icon + text + optional retry button.
      d) `lib/widgets/info_card.dart` — `InfoCard({IconData icon, Color iconColor,
         String title, String? subtitle, List<String> phones, bool isVerified})`:
         white card with call buttons, used by all generic service screens.
      e) `lib/widgets/prayer_times_strip.dart` — `PrayerTimesStrip` ConsumerWidget.
         Uses Riverpod `FutureProvider` backed by `PrayerTimesService.fetchTodayTimings()`.
         Displays horizontal scroll of five prayer time chips (ফজর/যোহর/আসর/মাগরিব/ইশা)
         with 12-hour Bangla format: convert HH:MM using intl, append "সকাল/বিকাল/রাত".
      f) `lib/widgets/search_bar_widget.dart` — `SearchBarWidget` with TextField +
         mic icon; `onSearch(String keyword)` callback; used on home screen to route:
         keyword "হাসপাতাল"→/hospitals, "ডাক্তার"→/doctors, "রক্ত"→/blood-donors,
         "অ্যাম্বুলেন্স"→/ambulance, default→/news.
      g) `lib/widgets/blood_group_selector.dart` — `BloodGroupSelector(
         onSelected(String))`: 4×2 grid of 8 blood group buttons; tapping one
         navigates to /blood-donors with the group pre-selected via query param.
      h) `lib/widgets/upazila_grid_widget.dart` — `UpazilaGridWidget`: 2-column
         grid of upazila cards from `AppConstants.upazilas`; tapping navigates to
         `/upazila/{id}`.
      Files: `lib/widgets/filter_chip_row.dart`, `lib/widgets/shimmer_list.dart`,
             `lib/widgets/empty_state.dart`, `lib/widgets/info_card.dart`,
             `lib/widgets/prayer_times_strip.dart`, `lib/widgets/search_bar_widget.dart`,
             `lib/widgets/blood_group_selector.dart`, `lib/widgets/upazila_grid_widget.dart`
      Verify: `flutter analyze lib/widgets/` — no errors.

- [ ] 5. Rewrite `lib/widgets/main_scaffold.dart` — replace the 5-tab config with:
      হোম(/), হাসপাতাল(/hospitals), ডাক্তার(/doctors), সেবা(/services),
      আরও(/more). Each tab navigates via `context.go(path)`. Use `NavigationBar`
      (Material 3) instead of `BottomNavigationBar` to match M3 theme already
      configured in `app_theme.dart`.
      Files: `lib/widgets/main_scaffold.dart`
      Verify: `flutter analyze lib/widgets/main_scaffold.dart` — no errors.

- [ ] 6. Rewrite `lib/screens/home/home_screen.dart` — full 11-section home screen
      (all listed in task description):
      a) Hero SliverAppBar: green gradient, Bengali date via `intl`, subtitle,
         two CTA buttons, weather stub (29° ☁️), PrayerTimesStrip.
      b) SearchBarWidget (below SliverAppBar in sticky position).
      c) Quick service pills (horizontal ListView): অ্যাম্বুলেন্স🚑, রক্তদান🩸,
         ফায়ার সার্ভিস🔥, পুলিশ স্টেশন👮, হাসপাতাল🏥, ৯৯৯📞 — each navigates
         or calls directly.
      d) Service categories grid (from AppConstants.serviceCategories, 2-col GridView).
      e) UpazilaGridWidget (2-col, 12 upazilas).
      f) BloodGroupSelector wrapped in red gradient Card.
      g) Latest notices (StreamBuilder on NewsService.getNotices(limit:3)).
      h) Notable persons preview (StreamProvider on `notable_persons` collection, 3 items).
      i) Tourism preview (StreamProvider on `tourism` collection, 3 items, image cards).
      j) Photo gallery preview (StreamProvider on `gallery` collection, 6 items, 3-col grid).
      k) CTA banner (blue container): "আপনার জেলায় ব্যবসা বা সেবা আছে?"
      Files: `lib/screens/home/home_screen.dart`
      Verify: `flutter analyze lib/screens/home/` — no errors.

- [ ] 7. Create `lib/screens/services/services_menu_screen.dart` —
      full-screen grid of all service categories from `AppConstants.serviceCategories`.
      Each card is tappable → `context.go(route)`.
      Files: `lib/screens/services/services_menu_screen.dart`
      Verify: `flutter analyze lib/screens/services/` — no errors.

- [ ] 8. Create `lib/screens/more/more_screen.dart` — list of extra navigation items:
      জরুরি নম্বর→/emergency, রক্তদাতা→/blood-donors, অ্যাম্বুলেন্স→/ambulance,
      আমাদের সম্পর্কে→/about (static text screen), শেয়ার করুন (share_plus).
      Include simple ListTile rows with icons.
      Files: `lib/screens/more/more_screen.dart`
      Verify: `flutter analyze lib/screens/more/` — no errors.

- [ ] 9. Create all generic-service screens (each uses `InfoCard`, `FilterChipRow`,
      `ShimmerList`, `EmptyState`, pull-to-refresh via `RefreshIndicator`):
      a) `lib/screens/pharmacy/pharmacy_screen.dart` — collection: `pharmacies`,
         filter by upazilaId using FilterChipRow.
      b) `lib/screens/education/education_screen.dart` — collection: `education`,
         filter by type (স্কুল/কলেজ/মাদ্রাসা/বিশ্ববিদ্যালয়).
      c) `lib/screens/transport/transport_screen.dart` — collection: `transport`,
         filter by type.
      d) `lib/screens/finance/finance_screen.dart` — collection: `finance`,
         filter by type (ব্যাংক/বীমা/এনজিও).
      e) `lib/screens/business/business_screen.dart` — collection: `businesses`,
         filter by type.
      f) `lib/screens/govt/govt_screen.dart` — collection: `govt_services`,
         filter by type.
      g) `lib/screens/police/police_screen.dart` — collection: `police_stations`,
         large CallButton prominently at top, then InfoCard list.
      h) `lib/screens/electricity/electricity_screen.dart` — collection:
         `electricity_offices`, InfoCard list.
      i) `lib/screens/islamic/islamic_screen.dart` — collection: `islamic`,
         filter by type (মসজিদ/মন্দির/চার্চ); include PrayerTimesStrip at top.
      j) `lib/screens/professionals/professionals_screen.dart` — collection:
         `professionals`, filter by type (আইনজীবী/হিসাবরক্ষক/প্রকৌশলী ইত্যাদি).
      k) `lib/screens/organizations/organizations_screen.dart` — collection:
         `organizations`, InfoCard list.
      l) `lib/screens/jobs/jobs_screen.dart` — collection: `jobs`, uses
         GenericServiceModel (description=deadline), shows deadline badge in red if
         date ≤ 7 days away; parsed from description field.
      Files: all 12 screen files listed above.
      Verify: `flutter analyze lib/screens/pharmacy lib/screens/education
               lib/screens/transport lib/screens/finance lib/screens/business
               lib/screens/govt lib/screens/police lib/screens/electricity
               lib/screens/islamic lib/screens/professionals
               lib/screens/organizations lib/screens/jobs` — no errors.

- [ ] 10. Create notable persons screens
       a) `lib/screens/notable_persons/notable_persons_screen.dart` — Firestore
          `notable_persons` stream; 2-column photo grid with CachedNetworkImage;
          filter by category chip row.
       b) `lib/screens/notable_persons/notable_person_detail_screen.dart` — full
          detail: hero image, name, designation, bio, birth year badge.
       Files: `lib/screens/notable_persons/notable_persons_screen.dart`,
              `lib/screens/notable_persons/notable_person_detail_screen.dart`
       Verify: `flutter analyze lib/screens/notable_persons/` — no errors.

- [ ] 11. Create tourism screens
       a) `lib/screens/tourism/tourism_screen.dart` — Firestore `tourism` stream;
          image cards with category filter (ঐতিহাসিক/প্রাকৃতিক/ধর্মীয়/বিনোদন).
       b) `lib/screens/tourism/tourism_detail_screen.dart` — full detail:
          hero image, name, description, address, opening hours, entry fee,
          category badge.
       Files: `lib/screens/tourism/tourism_screen.dart`,
              `lib/screens/tourism/tourism_detail_screen.dart`
       Verify: `flutter analyze lib/screens/tourism/` — no errors.

- [ ] 12. Create `lib/screens/gallery/gallery_screen.dart` — Firestore `gallery`
       stream; 3-column GridView with CachedNetworkImage; tapping opens a full-screen
       image viewer using Hero animation. Filter by category chip row.
       Files: `lib/screens/gallery/gallery_screen.dart`
       Verify: `flutter analyze lib/screens/gallery/` — no errors.

- [ ] 13. Create `lib/screens/upazila/upazila_detail_screen.dart` — accepts `id`
       path parameter; matches against `AppConstants.upazilas` for name/area/
       unionCount; displays static list of unions hardcoded per upazila (12 upazilas,
       union lists defined inline); links to /hospitals?upazila=id,
       /doctors?upazila=id, /blood-donors?upazila=id shortcuts.
       Files: `lib/screens/upazila/upazila_detail_screen.dart`
       Verify: `flutter analyze lib/screens/upazila/` — no errors.

- [ ] 14. Rewrite `lib/screens/news/news_screen.dart` — add tab bar:
       tab 0 = খবর (isNotice==false), tab 1 = নোটিশ (isNotice==true).
       Keep existing NewsCard widget. Add pull-to-refresh (`RefreshIndicator`).
       Remove old category chip row (replaced by tabs).
       Files: `lib/screens/news/news_screen.dart`
       Verify: `flutter analyze lib/screens/news/` — no errors.

- [ ] 15. Update `lib/screens/blood_donor/blood_donor_screen.dart` — add
       pull-to-refresh via `RefreshIndicator` wrapping the ListView; call
       `ref.refresh(bloodDonorsProvider(...))` on refresh. No other changes.
       Files: `lib/screens/blood_donor/blood_donor_screen.dart`
       Verify: `flutter analyze lib/screens/blood_donor/` — no errors.

- [ ] 16. Update `lib/config/router.dart` — add all new routes inside and outside
       the ShellRoute:
       Inside shell: /services, /more
       Outside shell (detail/full screens): /pharmacy, /education, /transport,
       /finance, /business, /govt, /police, /electricity, /islamic, /professionals,
       /organizations, /jobs, /notable-persons, /notable-persons/:id, /tourism,
       /tourism/:id, /gallery, /upazila/:id
       Add all necessary imports.
       Files: `lib/config/router.dart`
       Verify: `flutter analyze lib/config/router.dart` — no errors.

- [ ] 17. Final full-project analysis
       Run `flutter analyze` at the project root; fix any remaining warnings or
       errors across all files. Ensure `flutter build apk --debug` succeeds
       (or `flutter build apk --debug --no-pub` if packages already fetched).
       Files: any files with analysis errors
       Verify: `flutter analyze` exits with 0 issues; `flutter build apk --debug`
       completes without error.
