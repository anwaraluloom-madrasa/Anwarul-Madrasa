import IslamicHeader from "../components/IslamicHeader";
import RegistrationSkeleton from "../components/registration/RegistrationSkeleton";

export default function LoadingRegistrationPage() {
  return (
    <main className="w-full min-h-screen bg-gray-50" dir="rtl">
      <IslamicHeader pageType="registration" />
      <RegistrationSkeleton />
    </main>
  );
}
