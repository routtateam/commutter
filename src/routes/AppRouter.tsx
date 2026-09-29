import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteFallback } from "@/components/RouteFallback";
import { RequireAuth } from "@/routes/RequireAuth";

// Onboarding & auth
const Splash = lazy(() => import("@/features/onboarding/SplashScreen"));
const Onboarding = lazy(() => import("@/features/onboarding/OnboardingScreen"));
const Welcome = lazy(() => import("@/features/onboarding/WelcomeScreen"));
const PhoneEntry = lazy(() => import("@/features/auth/PhoneEntryScreen"));
const OtpEntry = lazy(() => import("@/features/auth/OtpEntryScreen"));
const CreateAccount = lazy(() => import("@/features/auth/CreateAccountScreen"));
const LocationPermission = lazy(() => import("@/features/auth/LocationPermissionScreen"));

// Home & booking
const Home = lazy(() => import("@/features/home/HomeScreen"));
const Search = lazy(() => import("@/features/rides/SearchScreen"));
const SavedPlaces = lazy(() => import("@/features/rides/SavedPlacesScreen"));
const SavedPlaceEdit = lazy(() => import("@/features/rides/SavedPlaceEditScreen"));
const Category = lazy(() => import("@/features/rides/CategoryScreen"));
const Capacity = lazy(() => import("@/features/rides/CapacityScreen"));
const Summary = lazy(() => import("@/features/rides/SummaryScreen"));
const PromoApply = lazy(() => import("@/features/rides/PromoApplyScreen"));
const Matching = lazy(() => import("@/features/rides/MatchingScreen"));
const NoMatch = lazy(() => import("@/features/rides/NoMatchScreen"));
const Accepted = lazy(() => import("@/features/rides/AcceptedScreen"));
const ActiveTrip = lazy(() => import("@/features/rides/ActiveTripScreen"));
const CancelReason = lazy(() => import("@/features/rides/CancelReasonScreen"));
const Completed = lazy(() => import("@/features/rides/CompletedScreen"));
const Rating = lazy(() => import("@/features/rides/RatingScreen"));
const Tip = lazy(() => import("@/features/rides/TipScreen"));
const ScheduleForm = lazy(() => import("@/features/schedule/ScheduleFormScreen"));
const Scheduled = lazy(() => import("@/features/schedule/ScheduledScreen"));
const ScheduledDetail = lazy(() => import("@/features/schedule/ScheduledDetailScreen"));

// Premium Ride
const PremiumMarket = lazy(() => import("@/features/premium/PremiumMarketScreen"));
const PremiumFilters = lazy(() => import("@/features/premium/PremiumFiltersScreen"));
const PremiumVehicle = lazy(() => import("@/features/premium/PremiumVehicleScreen"));
const PremiumGallery = lazy(() => import("@/features/premium/PremiumGalleryScreen"));
const PremiumBusiness = lazy(() => import("@/features/premium/PremiumBusinessScreen"));
const PremiumCalendar = lazy(() => import("@/features/premium/PremiumCalendarScreen"));
const PremiumDuration = lazy(() => import("@/features/premium/PremiumDurationScreen"));
const PremiumCheckout = lazy(() => import("@/features/premium/PremiumCheckoutScreen"));
const PremiumPolicy = lazy(() => import("@/features/premium/PremiumPolicyScreen"));
const PremiumConfirmed = lazy(() => import("@/features/premium/PremiumConfirmedScreen"));
const PremiumBooking = lazy(() => import("@/features/premium/PremiumBookingScreen"));
const PremiumInspection = lazy(() => import("@/features/premium/PremiumInspectionScreen"));
const PremiumRefund = lazy(() => import("@/features/premium/PremiumRefundScreen"));
const PremiumHistory = lazy(() => import("@/features/premium/PremiumHistoryScreen"));

// Wallet & promotions
const Payments = lazy(() => import("@/features/wallet/PaymentsScreen"));
const AddCard = lazy(() => import("@/features/wallet/AddCardScreen"));
const WalletTopUp = lazy(() => import("@/features/wallet/WalletTopUpScreen"));
const Promotions = lazy(() => import("@/features/promotions/PromotionsScreen"));
const Referrals = lazy(() => import("@/features/promotions/ReferralsScreen"));

// Safety
const Safety = lazy(() => import("@/features/safety/SafetyScreen"));
const ShareTrip = lazy(() => import("@/features/safety/ShareTripScreen"));
const EmergencyContacts = lazy(() => import("@/features/safety/EmergencyContactsScreen"));

// Profile & settings
const Profile = lazy(() => import("@/features/profile/ProfileScreen"));
const EditProfile = lazy(() => import("@/features/profile/EditProfileScreen"));
const Settings = lazy(() => import("@/features/profile/SettingsScreen"));

// Support
const Help = lazy(() => import("@/features/support/HelpScreen"));
const Report = lazy(() => import("@/features/support/ReportScreen"));
const Disputes = lazy(() => import("@/features/support/DisputesScreen"));
const DisputeDetail = lazy(() => import("@/features/support/DisputeDetailScreen"));

// Notifications & history
const Notifications = lazy(() => import("@/features/notifications/NotificationsScreen"));
const History = lazy(() => import("@/features/history/HistoryScreen"));
const HistoryDetail = lazy(() => import("@/features/history/HistoryDetailScreen"));

// System / non-happy-path states
const OfflineDemo = lazy(() => import("@/features/rides/OfflineScreen"));
const NetworkErrorDemo = lazy(() => import("@/features/rides/NetworkErrorScreen"));

export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/auth/phone" element={<PhoneEntry />} />
        <Route path="/auth/otp" element={<OtpEntry />} />
        <Route path="/auth/create-account" element={<CreateAccount />} />
        <Route path="/auth/location" element={<LocationPermission />} />

        <Route element={<RequireAuth />}>
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/saved-places" element={<SavedPlaces />} />
          <Route path="/saved-places/:id/edit" element={<SavedPlaceEdit />} />
          <Route path="/category" element={<Category />} />
          <Route path="/category/capacity" element={<Capacity />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/promo" element={<PromoApply />} />
          <Route path="/matching" element={<Matching />} />
          <Route path="/no-match" element={<NoMatch />} />
          <Route path="/accepted" element={<Accepted />} />
          <Route path="/active" element={<ActiveTrip />} />
          <Route path="/cancel-reason" element={<CancelReason />} />
          <Route path="/completed" element={<Completed />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/tip" element={<Tip />} />
          <Route path="/schedule" element={<ScheduleForm />} />
          <Route path="/scheduled" element={<Scheduled />} />
          <Route path="/scheduled/:id" element={<ScheduledDetail />} />

          <Route path="/premium" element={<PremiumMarket />} />
          <Route path="/premium/filters" element={<PremiumFilters />} />
          <Route path="/premium/vehicle/:id" element={<PremiumVehicle />} />
          <Route path="/premium/vehicle/:id/gallery" element={<PremiumGallery />} />
          <Route path="/premium/business/:id" element={<PremiumBusiness />} />
          <Route path="/premium/calendar" element={<PremiumCalendar />} />
          <Route path="/premium/duration" element={<PremiumDuration />} />
          <Route path="/premium/checkout" element={<PremiumCheckout />} />
          <Route path="/premium/policy" element={<PremiumPolicy />} />
          <Route path="/premium/confirmed" element={<PremiumConfirmed />} />
          <Route path="/premium/booking/:id" element={<PremiumBooking />} />
          <Route path="/premium/booking/:id/inspection" element={<PremiumInspection />} />
          <Route path="/premium/booking/:id/refund" element={<PremiumRefund />} />
          <Route path="/premium/history" element={<PremiumHistory />} />

          <Route path="/payments" element={<Payments />} />
          <Route path="/payments/add-card" element={<AddCard />} />
          <Route path="/wallet/top-up" element={<WalletTopUp />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/referrals" element={<Referrals />} />

          <Route path="/safety" element={<Safety />} />
          <Route path="/safety/share-trip" element={<ShareTrip />} />
          <Route path="/safety/emergency-contacts" element={<EmergencyContacts />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="/help" element={<Help />} />
          <Route path="/help/report" element={<Report />} />
          <Route path="/help/disputes" element={<Disputes />} />
          <Route path="/help/disputes/:id" element={<DisputeDetail />} />

          <Route path="/notifications" element={<Notifications />} />
          <Route path="/history" element={<History />} />
          <Route path="/history/:id" element={<HistoryDetail />} />

          <Route path="/system/offline" element={<OfflineDemo />} />
          <Route path="/system/network-error" element={<NetworkErrorDemo />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
