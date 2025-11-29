import GraduationsSection from "../components/graduation/TopGraduations";
import IslamicHeader from "../components/IslamicHeader";

export default function GraduationsPage() {
  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-gray-50" dir="rtl">
      <IslamicHeader 
        pageType="graduated-students" 
        alignment="center"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" dir="rtl">
        <GraduationsSection showAll={true} />
      </div>
    </main>
  );
}
