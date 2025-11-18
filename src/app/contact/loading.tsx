import IslamicHeader from "../components/IslamicHeader";
import ContactSkeleton from "../components/contact/ContactSkeleton";

export default function LoadingContactPage() {
  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <IslamicHeader 
        pageType="contact" 
        alignment="center"
      />
      <ContactSkeleton />
    </main>
  );
}
