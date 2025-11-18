import IslamicHeader from "../components/IslamicHeader";
import AdmissionSkeleton from "../components/admission/AdmissionSkeleton";

export default function LoadingAdmissionPage() {
  return (
    <main className="w-full min-h-screen bg-gray-50" dir="rtl">
      <IslamicHeader pageType="admission" />
      <AdmissionSkeleton />
    </main>
  );
}

