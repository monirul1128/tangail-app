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
    ],
  );
});
