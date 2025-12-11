import ContactForm from "../components/contact/ContactForm";
import IslamicHeader from "../components/IslamicHeader";
import Breadcrumb from "@/components/Breadcrumb";

export default function ContactPage() {
  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <IslamicHeader
        pageType="contact"
        alignment="center"
        cta={{
          label: "پیغام واستوئ",
          href: "#contact-form",
        }}
      />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="mt-4 sm:mt-8 md:mt-12">
          <Breadcrumb />
        </div>
        <ContactForm />
      </div>
    </main>
  );
}
