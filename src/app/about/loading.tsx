import IslamicHeader from "../components/IslamicHeader";
import AboutSkeleton from "../components/about/AboutSkeleton";

export default function LoadingAboutPage() {
  return (
    <main className="w-full min-h-screen bg-gray-50" dir="rtl">
      <IslamicHeader pageType="about" />
      <AboutSkeleton />
    </main>
  );
}
