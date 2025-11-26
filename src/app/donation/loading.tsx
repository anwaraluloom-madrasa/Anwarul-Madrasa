import IslamicHeader from "../components/IslamicHeader";
import DonationSkeleton from "../components/donation/DonationSkeleton";

export default function LoadingDonationPage() {
  return (
    <main className="w-full min-h-screen bg-gray-50" dir="rtl">
      <IslamicHeader pageType="donation" />
      <DonationSkeleton />
    </main>
  );
}
