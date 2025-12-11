import IslamicHeader from "../components/IslamicHeader";
import Breadcrumb from "@/components/Breadcrumb";
import AwlyaaChartsSection from "../components/awlyaa/AwlyaaChartsSection";

export default function AwlyaaChartsPage() {
  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <IslamicHeader 
        pageType="awlayaa" 
        title="شجرت اولیاء"
        subtitle="  د نقشبندیه طریقه مشایخو روحاني سلسله، له رسول الله ﷺ تر مشایخو پورې په برکتي تسلسل کې "
        alignment="center"
        cta={{
          label: "View Charts",
          href: "#charts-section"
        }}
      />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
        <div className="mt-4 sm:mt-8 md:mt-12 mb-6 sm:mb-8">
          <Breadcrumb />
        </div>
      </div>
      <div id="charts-section" className="w-full">
        <AwlyaaChartsSection />
      </div>
    </main>
  );
}
