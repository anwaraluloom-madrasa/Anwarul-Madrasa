import Breadcrumb from "@/components/Breadcrumb";
import AwlayaaDetailSkeleton from "../../components/awlayaa/AwlayaaDetailSkeleton";

export default function LoadingAwlayaaDetail() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20 pb-20" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6" dir="rtl">
        <div className="mt-12">
          <Breadcrumb />
        </div>
        <AwlayaaDetailSkeleton />
      </div>
    </main>
  );
}