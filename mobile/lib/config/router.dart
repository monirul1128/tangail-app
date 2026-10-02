import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../screens/home/home_screen.dart';
import '../screens/hospitals/hospitals_screen.dart';
import '../screens/hospitals/hospital_detail_screen.dart';
import '../screens/doctors/doctors_screen.dart';
import '../screens/doctors/doctor_detail_screen.dart';
import '../screens/blood_donor/blood_donor_screen.dart';
import '../screens/blood_donor/register_donor_screen.dart';
import '../screens/ambulance/ambulance_screen.dart';
import '../screens/news/news_screen.dart';
import '../screens/news/news_detail_screen.dart';
import '../screens/emergency/emergency_screen.dart';
import '../screens/services/services_menu_screen.dart';
import '../screens/more/more_screen.dart';
import '../screens/pharmacy/pharmacy_screen.dart';
import '../screens/education/education_screen.dart';
import '../screens/transport/transport_screen.dart';
import '../screens/finance/finance_screen.dart';
import '../screens/business/business_screen.dart';
import '../screens/govt/govt_screen.dart';
import '../screens/police/police_screen.dart';
import '../screens/electricity/electricity_screen.dart';
import '../screens/islamic/islamic_screen.dart';
import '../screens/professionals/professionals_screen.dart';
import '../screens/organizations/organizations_screen.dart';
import '../screens/jobs/jobs_screen.dart';
import '../screens/notable_persons/notable_persons_screen.dart';
import '../screens/notable_persons/notable_person_detail_screen.dart';
import '../screens/tourism/tourism_screen.dart';
import '../screens/tourism/tourism_detail_screen.dart';
import '../screens/gallery/gallery_screen.dart';
import '../screens/upazila/upazila_detail_screen.dart';
import '../widgets/main_scaffold.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      ShellRoute(
        builder: (context, state, child) => MainScaffold(child: child),
        routes: [
          GoRoute(path: '/', builder: (_, __) => const HomeScreen()),
          GoRoute(path: '/hospitals', builder: (_, __) => const HospitalsScreen()),
          GoRoute(path: '/doctors', builder: (_, __) => const DoctorsScreen()),
          GoRoute(path: '/blood-donors', builder: (_, __) => const BloodDonorScreen()),
          GoRoute(path: '/ambulance', builder: (_, __) => const AmbulanceScreen()),
          GoRoute(path: '/news', builder: (_, __) => const NewsScreen()),
          GoRoute(path: '/emergency', builder: (_, __) => const EmergencyScreen()),
          GoRoute(path: '/services', builder: (_, __) => const ServicesMenuScreen()),
          GoRoute(path: '/more', builder: (_, __) => const MoreScreen()),
        ],
      ),
      // Detail routes (outside shell — no bottom nav)
      GoRoute(
        path: '/hospitals/:id',
        builder: (_, state) =>
            HospitalDetailScreen(hospitalId: state.pathParameters['id']!),
      ),
      GoRoute(
        path: '/doctors/:id',
        builder: (_, state) =>
            DoctorDetailScreen(doctorId: state.pathParameters['id']!),
      ),
      GoRoute(
        path: '/news/:id',
        builder: (_, state) =>
            NewsDetailScreen(newsId: state.pathParameters['id']!),
      ),
      GoRoute(
        path: '/register-donor',
        builder: (_, __) => const RegisterDonorScreen(),
      ),
      // New service screens
      GoRoute(path: '/pharmacy',      builder: (_, s) => const PharmacyScreen()),
      GoRoute(path: '/education',     builder: (_, s) => EducationScreen(initialType: s.uri.queryParameters['type'] ?? '')),
      GoRoute(path: '/transport',     builder: (_, s) => TransportScreen(initialType: s.uri.queryParameters['type'] ?? '')),
      GoRoute(path: '/finance',       builder: (_, s) => FinanceScreen(initialType: s.uri.queryParameters['type'] ?? '')),
      GoRoute(path: '/business',      builder: (_, s) => BusinessScreen(initialType: s.uri.queryParameters['type'] ?? '')),
      GoRoute(path: '/govt',          builder: (_, __) => const GovtScreen()),
      GoRoute(path: '/govt-services', builder: (_, __) => const GovtScreen()),
      GoRoute(path: '/police',        builder: (_, __) => const PoliceScreen()),
      GoRoute(path: '/electricity',   builder: (_, __) => const ElectricityScreen()),
      GoRoute(path: '/islamic',       builder: (_, s) => IslamicScreen(initialType: s.uri.queryParameters['type'] ?? '')),
      GoRoute(path: '/professionals', builder: (_, s) => ProfessionalsScreen(initialType: s.uri.queryParameters['type'] ?? '')),
      GoRoute(path: '/organizations', builder: (_, __) => const OrganizationsScreen()),
      GoRoute(path: '/jobs',          builder: (_, __) => const JobsScreen()),
      GoRoute(path: '/notable-persons', builder: (_, __) => const NotablePersonsScreen()),
      GoRoute(
        path: '/notable-persons/:id',
        builder: (_, state) =>
            NotablePersonDetailScreen(personId: state.pathParameters['id']!),
      ),
      GoRoute(path: '/tourism', builder: (_, __) => const TourismScreen()),
      GoRoute(
        path: '/tourism/:id',
        builder: (_, state) =>
            TourismDetailScreen(tourismId: state.pathParameters['id']!),
      ),
      GoRoute(path: '/gallery', builder: (_, __) => const GalleryScreen()),
      GoRoute(
        path: '/upazila/:id',
        builder: (_, state) =>
            UpazilaDetailScreen(upazilaId: state.pathParameters['id']!),
      ),
    ],
  );
});
