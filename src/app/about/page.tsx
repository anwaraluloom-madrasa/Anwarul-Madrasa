"use client";
import Image from "next/image";
import Link from "next/link";
import IslamicHeader from "../components/IslamicHeader";
import Breadcrumb from "@/components/Breadcrumb";
import {
  BookOpen,
  Award,
  Heart,
  Users,
  Sparkles,
  Clock,
  GraduationCap,
  Target,
  Lightbulb,
  Star,
  CheckCircle,
  Quote,
  Trophy,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { getTranslation } from "@/lib/translations";
import img from "../../../public/1.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom Arrow Components - RTL version (swapped for RTL)
const CustomNextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-all duration-150 group border border-gray-200"
    aria-label="Next slide"
  >
    <svg
      className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-blue-600 transition-colors"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  </button>
);

const CustomPrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-all duration-150 group border border-gray-200"
    aria-label="Previous slide"
  >
    <svg
      className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-blue-600 transition-colors"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  </button>
);

const AboutPage = () => {
  const { t: tRaw, i18n } = useTranslation("common", { useSuspense: false });
  // Always RTL since website only has RTL languages
  const isRTL = true;

  // Create a string-safe wrapper function for string contexts
  const t = (key: string): string => {
    const result = tRaw(key);
    return typeof result === "string" ? result : key;
  };

  // Create a function for array contexts
  const tArray = (key: string): string[] => {
    const result = tRaw(key, { returnObjects: true });
    return Array.isArray(result) ? result : [];
  };

  const subjects = [
    { name: t("about.subjects.tajweed"), icon: "📖", color: "bg-blue-500" },
    { name: t("about.subjects.hifz"), icon: "💎", color: "bg-green-500" },
    { name: t("about.subjects.tafsir"), icon: "🔍", color: "bg-purple-500" },
    { name: t("about.subjects.hadith"), icon: "📚", color: "bg-amber-500" },
    { name: t("about.subjects.fiqh"), icon: "⚖️", color: "bg-red-500" },
    { name: t("about.subjects.usulFiqh"), icon: "📋", color: "bg-indigo-500" },
    { name: t("about.subjects.logic"), icon: "🧠", color: "bg-pink-500" },
    { name: t("about.subjects.maani"), icon: "💭", color: "bg-teal-500" },
    { name: t("about.subjects.sarf"), icon: "✍️", color: "bg-orange-500" },
    { name: t("about.subjects.nahw"), icon: "📝", color: "bg-cyan-500" },
    { name: t("about.subjects.hikmat"), icon: "🌟", color: "bg-yellow-500" },
    { name: t("about.subjects.mathematics"), icon: "🔢", color: "bg-gray-500" },
    { name: t("about.subjects.english"), icon: "🌍", color: "bg-blue-600" },
    { name: t("about.subjects.arabic"), icon: "🕌", color: "bg-green-600" },
    { name: t("about.subjects.rhetoric"), icon: "🎤", color: "bg-purple-600" },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white mt-16 sm:mt-24 md:mt-32">
      <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-amber-50 via-white to-blue-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 relative z-10">
          <div className="mt-4 sm:mt-8 md:mt-12">
            <Breadcrumb />
          </div>
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-5 py-2 bg-[#e0f2f2] text-[#4a8a8a] rounded-full text-sm font-semibold mb-6 border border-[#d0e8e8]">
              <BookOpen className="h-4 w-4 ml-2" />د مدرسې پېژندنه
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight text-center"
              style={{ fontFamily: "Amiri, serif" }}
            >
              د انوارالعلوم اسلامي مدرسې لنډه پېژندنه
            </h1>
            <div className="w-24 h-1 bg-[#4a8a8a] mx-auto rounded-full"></div>
          </div>

          {/* Main Content */}
          <div className="max-w-5xl mx-auto">
            {/* Founder Biography Section */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4a8a8a]/20 to-transparent rounded-full blur-2xl"></div>
                  <Image
                    src="/about111.jpg"
                    alt="شیخ القران والحدیث أنوار المشائخ الحاج خلیفه صاحب فضل الدین (رح)"
                    width={192}
                    height={192}
                    className="relative object-cover w-full h-full rounded-full border-4 border-white shadow-2xl"
                    priority
                  />
                </div>
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight"
                  style={{ fontFamily: "Amiri, serif" }}
                >
                  شیخ القران والحدیث أنوار المشائخ الحاج خلیفه صاحب فضل الدین
                  (رح)
                </h2>
                <p
                  className="text-xl text-[#4a8a8a] font-medium mb-6"
                  style={{ fontFamily: "Amiri, serif" }}
                >
                  مشهور (په ارغندي خلیفه صاحب) قدس الله سره
                </p>
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#4a8a8a]"></div>
                  <div className="w-2 h-2 bg-[#4a8a8a] rounded-full"></div>
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#4a8a8a]"></div>
                </div>
              </div>

              <div className="space-y-12 text-gray-700">
                <div className="relative">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-[#4a8a8a]/5 rounded-full blur-3xl"></div>
                  <div className="relative bg-gradient-to-br from-[#f0f9f9] to-white p-8 md:p-12 rounded-lg">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <div className="w-1 h-12 bg-gradient-to-b from-[#4a8a8a] to-[#4a8a8a]/50 rounded-full"></div>
                      <h3
                        className="text-2xl md:text-3xl font-bold text-[#4a8a8a] text-center"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        د ژوند لنډه پېژندنه
                      </h3>
                      <div className="w-1 h-12 bg-gradient-to-b from-[#4a8a8a] to-[#4a8a8a]/50 rounded-full"></div>
                    </div>
                    <p
                      className="text-lg md:text-xl leading-relaxed text-center text-gray-800 max-w-4xl mx-auto px-4 sm:px-6"
                      style={{ fontFamily: "Amiri, serif" }}
                    >
                      انوار المشایخ جناب حضرت مولانا مؤید الدین خلیفه صاحب فضل
                      الدین رح چې د ارغندۍ په خلیفه صاحب سره یې شهرت درلود؛ د افغانستان
                      له نومياليو عالمانو او لویو عارفانو څخه وه، پلار یې محمد
                     زرين نومېده چې یو نیک خویه او متقی انسان و.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <div className="relative">
                    <div className="absolute -right-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#4a8a8a]/30 to-transparent hidden md:block"></div>
                    <div className="relative">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#4a8a8a] to-[#3a7a7a] rounded-full flex items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <h4
                          className="text-2xl md:text-3xl font-bold text-gray-900"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          د تعلیم سفر
                        </h4>
                      </div>
                      <p
                        className="text-base md:text-lg leading-relaxed text-gray-700 px-4 sm:px-6 pr-4"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        انوارالمشائخ رح  خپلې لومړنۍ زده کړې د خپل کلې په ښوونځي کې ترسره کړې او وروسته یې  د افغانستان په مختلفو ديني مدارسو کې
                     مروج دينـي عـلـوم سـرته ورسول، نوموړي له جناب شیخ الحدیث حضرت مولانا عبدالغفار ننګرهاري چې نوموړی د شیخ الحدیث مولانا نصیرالدین غرغشتوې رح شاګرد وه چې د غزنې په نورالمدارس مدرسه کې شیخ الحدیث وه د تفسیر علم حاصل کړ.
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="relative">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#4a8a8a] to-[#3a7a7a] rounded-full flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <h4
                          className="text-2xl md:text-3xl font-bold text-gray-900"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          د حدیثو زده کړه
                        </h4>
                      </div>
                      <p
                        className="text-base md:text-lg leading-relaxed text-gray-700 px-4 sm:px-6"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                   انوار المشائخ رح  د حدیثو سند په کابل کې له شیخ الحدیث حضرت مولانا سلطان جان صاحب څخه تر لاسه کړ؛ او له نوموړي څخه یې د حدیثو په برخه کې د تدریس کولو اجازه هم واخیسته.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative py-8">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4a8a8a]/20 to-transparent"></div>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#4a8a8a] to-[#3a7a7a] rounded-full flex items-center justify-center">
                        <Heart className="h-5 w-5 text-white" />
                      </div>
                      <h4
                        className="text-2xl md:text-3xl font-bold text-gray-900"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        د طریقت سفر
                      </h4>
                    </div>
                    <p
                      className="text-lg md:text-xl leading-relaxed text-gray-700 max-w-4xl mx-auto px-4 sm:px-6"
                      style={{ fontFamily: "Amiri, serif" }}
                    >
                      خليفـه صـاحب قدس الله سره د طـالـب علمـی پـه دوران کی د
                      حضرت نورالمشايخ فضل عمر مجددي قدس الله سره سره بيعت وکړ
                      بیا چی کله حضرت نورالمشایخ صاحب نور الله مرقده وفات شو نو
                      د بیعت تجديد يې له حضرت ضياء المشايخ محمد ابراهیم جان
                      مجددی قدس الله سره وکړ او په ۱۳۴۹هـ.ش کال د علم باطن نه
                      فارغ اود سلوک منازل يې سرته ورسول اود جناب حضرت ضياء
                      المشايخ صاحب په مبارکو لاسونو ورته د خلافت دستار وتړل شـو.
                    </p>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#4a8a8a]/20 to-transparent"></div>
                </div>

                <div className="relative py-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="order-2 lg:order-1 relative">
                      <div className="absolute -inset-4 bg-gradient-to-br from-[#4a8a8a]/10 to-transparent rounded-2xl blur-2xl"></div>
                      <Image
                        src="/hero1.jpg"
                        alt="د ارغندی د مدرسې بنسټ"
                        width={600}
                        height={400}
                        className="relative rounded-lg w-full h-64 md:h-80 object-cover shadow-xl"
                      />
                    </div>
                    <div className="order-1 lg:order-2">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#4a8a8a] to-[#3a7a7a] rounded-full flex items-center justify-center">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                        <h4
                          className="text-2xl md:text-3xl font-bold text-gray-900"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          د ارغندی د مدرسې بنسټ
                        </h4>
                      </div>
                      <p
                        className="text-base md:text-lg leading-relaxed mb-8 text-gray-700 px-4 sm:px-6"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        كلـه چې حضرت خلیفه صاحب قدس سره د ظاهري او باطنی علومو
                        څخه فارغ شو نو په تدريس يې شروع وکړه د میدان ولایت د
                        چارکی په مدرسه کې يې څه موده تیره کړه بیاله هغه ځایه د
                        کابل ولایت پغمان ولسوالی برې ارغندۍ د بازید خيلو ته
                        لاړهلته یې په لومړی ځل مدرسه تأسیس کړه
                      </p>
                      <div className="bg-gradient-to-br from-[#f0f9f9] to-white p-6 rounded-lg border-r-4 border-[#4a8a8a]">
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <Clock className="h-5 w-5 text-[#4a8a8a]" />
                          <p
                            className="text-lg font-bold text-[#4a8a8a]"
                            style={{ fontFamily: "Amiri, serif" }}
                          >
                            ارغندی اول ځل:
                          </p>
                        </div>
                        <div className="space-y-2 text-center">
                          <p
                            className="text-base font-semibold text-gray-800"
                            style={{ fontFamily: "Amiri, serif" }}
                          >
                            ٦ / ١ / ١٣٨٣ هـ ق
                          </p>
                          <p
                            className="text-base font-semibold text-gray-800"
                            style={{ fontFamily: "Amiri, serif" }}
                          >
                            ٨ / ٣ / ١٣٤٢ هـ ش
                          </p>
                          <p
                            className="text-base font-semibold text-gray-800"
                            style={{ fontFamily: "Amiri, serif" }}
                          >
                            ٢٩ / ٥ / ١٩٦٣ م
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative py-12">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4a8a8a]/20 to-transparent"></div>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#4a8a8a] to-[#3a7a7a] rounded-full flex items-center justify-center">
                        <Star className="h-5 w-5 text-white" />
                      </div>
                      <h4
                        className="text-2xl md:text-3xl font-bold text-gray-900"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        د هجرت دوره
                      </h4>
                    </div>
                    <p
                      className="text-lg md:text-xl leading-relaxed mb-8 text-gray-700 max-w-4xl mx-auto px-4 sm:px-6"
                      style={{ fontFamily: "Amiri, serif" }}
                    >
                      نوموړي د تره کي د حکومت په دوره کې له خپل ګران هیواد څخه
                      هجرت وکړ او د پاکستان په شمالی وزیرستان میرانشاه کې يې
                      استوګنه غوره کړه د هجرت په ټاټوبي کې يې یوه ستره ديني
                      مدرسه د انوار العلوم الاسلامیة په نامه دوهم ځل په میرانشاه
                      کې جوړه کړه چې په سلګونو طالبانو به په کې ديني علوم زده
                      کول.
                    </p>
                    <div className="bg-gradient-to-br from-[#f0f9f9] to-white p-6 rounded-lg border-r-4 border-[#4a8a8a] max-w-md mx-auto">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <Clock className="h-5 w-5 text-[#4a8a8a]" />
                        <p
                          className="text-lg font-bold text-[#4a8a8a]"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          میرانشاه د مدرسې بنسټ:
                        </p>
                      </div>
                      <div className="space-y-2 text-center">
                        <p
                          className="text-base font-semibold text-gray-800"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          ٦ / ٩ / ١٤٠٥ هـ ق
                        </p>
                        <p
                          className="text-base font-semibold text-gray-800"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          ۴ / ۳ / ۱۳۶۴ هـ ش
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#4a8a8a]/20 to-transparent"></div>
                </div>

                <div className="relative py-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#4a8a8a] to-[#3a7a7a] rounded-full flex items-center justify-center">
                          <Heart className="h-6 w-6 text-white" />
                        </div>
                        <h4
                          className="text-2xl md:text-3xl font-bold text-gray-900"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          وفات
                        </h4>
                      </div>
                      <p
                        className="text-base md:text-lg leading-relaxed text-gray-700 px-4 sm:px-6"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        حضرت انوار المشائخ خلیفه صاحب ارغندي قدس الله سره، ته په
                        وروستيو کالو کې سخته مريضي ور پېښه شوه او د هماغې مريضي
                        نـه پـه ۱۹۹۵م كـال وفـات شـو او د میرانشاه د شهیدانو په
                        هدیره کې خاورو ته وسپارل شو. وايي چې د ده په جنازه کې په
                        زرګونو مسلمانانو شرکت کړی ؤ چې زياتره يـې عالمان او دينې
                        طالبان ؤ.
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-br from-[#4a8a8a]/10 to-transparent rounded-2xl blur-2xl"></div>
                      <Image
                        src="/death.jpg"
                        alt="د خلیفه صاحب میراث"
                        width={600}
                        height={400}
                        className="relative rounded-lg w-full h-64 md:h-80 object-cover shadow-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Introduction */}
            <div className="mb-16">
              <div className="relative">
                <div className="absolute right-0 top-0 w-64 h-64 bg-[#4a8a8a]/5 rounded-full blur-3xl"></div>
                <div className="relative space-y-8">
                  <p
                    className="text-lg md:text-xl text-gray-800 leading-relaxed text-center max-w-4xl mx-auto px-4 sm:px-6"
                    style={{ fontFamily: "Amiri, serif" }}
                  >
                    د انوارالعلوم اسلامي مدرسه د جناب شیخ القرآن والحدیث حضرت
                    انوارالمشائخ خلیفه صاحب فضل‌الدین ارغندی رحمة‌الله علیه په
                    مبارک لاس د ۱۳۸۳ هـ ق / ۱۳۴۲ هـ ش / ۱۹۶۳ م کال د جوزا په
                    اتمه نېټه د کابل ولایت د پغمان ولسوالۍ د ارغندي علیا په سیمه
                    کې تأسیس شوه.
                  </p>
                  <div className="flex items-center justify-center gap-4 my-8">
                    <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#4a8a8a]/30"></div>
                    <div className="w-2 h-2 bg-[#4a8a8a]/30 rounded-full"></div>
                    <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#4a8a8a]/30"></div>
                  </div>
                  <p
                    className="text-lg md:text-xl text-gray-800 leading-relaxed text-center max-w-4xl mx-auto px-4 sm:px-6"
                    style={{ fontFamily: "Amiri, serif" }}
                  >
                    له نوموړي د وفات وروسته، د مدرسې د اهتمام چارې د هغه ورور
                    حضرت تاج‌المشائخ خلیفه صاحب سدوزی غریقي رحمة‌الله علیه ته
                    وسپارل شوې. ورپسې، د تاج‌المشائخ رح له وفات وروسته د مدرسې
                    اداره د حضرت ارغندی خلیفه صاحب د کشر زوی او د تاج‌المشائخ رح
                    وراره حضرت قلب‌المشائخ خلیفه صاحب محمد شفیق فضلي حفظه‌الله
                    تعالی ته وسپارل شوه. نوموړی تر ننه د دې جامعې د علمي او
                    روحاني چارو څارنه کوي او د تصوف څانګه یې په ځانګړي ډول د پام
                    وړ وده کړې ده.
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Services */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#4a8a8a] to-[#3a7a7a] rounded-full mb-6">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "Amiri, serif" }}
                >
                  د جامعې علمي خدمتونه
                </h2>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#4a8a8a]"></div>
                  <div className="w-2 h-2 bg-[#4a8a8a] rounded-full"></div>
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#4a8a8a]"></div>
                </div>
                <p
                  className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto px-4 sm:px-6"
                  style={{ fontFamily: "Amiri, serif" }}
                >
                  په نوموړې مدرسه کې د ديني او عصري علومو تدریس په منظم ډول تر
                  سره کېږي، چې مهمې څانګې یې دا دي:
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
                {[
                  { name: "تجوید", icon: "📖" },
                  { name: "حفظ", icon: "💎" },
                  { name: "تفسیر", icon: "🔍" },
                  { name: "حدیث", icon: "📚" },
                  { name: "فقه", icon: "⚖️" },
                  { name: "اصول الفقه", icon: "📋" },
                  { name: "منطق", icon: "🧠" },
                  { name: "معاني", icon: "💭" },
                  { name: "صرف", icon: "✍️" },
                  { name: "نحو", icon: "📝" },
                  { name: "حکمت", icon: "🌟" },
                  { name: "ریاضي", icon: "🔢" },
                  { name: "انګلیسي", icon: "🌍" },
                  { name: "عربي", icon: "🕌" },
                  { name: "فن بیان", icon: "🎤" },
                ].map((subject, index) => (
                  <div key={index} className="text-center group">
                    <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300">
                      <div className="text-5xl md:text-6xl">{subject.icon}</div>
                    </div>
                    <p
                      className="text-sm md:text-base font-semibold text-gray-800"
                      style={{ fontFamily: "Amiri, serif" }}
                    >
                      {subject.name}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <div className="inline-block bg-gradient-to-br from-[#f0f9f9] to-white px-8 py-4 rounded-lg border-r-4 border-[#4a8a8a]">
                  <p
                    className="text-base md:text-lg text-gray-700"
                    style={{ fontFamily: "Amiri, serif" }}
                  >
                    دغه علوم په درجوي (صنفي) او متفرقه ډول تدریس کېږي.
                  </p>
                </div>
              </div>
            </div>

            {/* Teachers Section */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#4a8a8a] to-[#3a7a7a] rounded-full mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "Amiri, serif" }}
                >
                  د جامعې مشایخ او استادان
                </h2>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#4a8a8a]"></div>
                  <div className="w-2 h-2 bg-[#4a8a8a] rounded-full"></div>
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#4a8a8a]"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {[
                  "خلیفه صاحب محمد شفیق فضلي (حفظه‌الله)",
                  "مفتي صاحب محمد حسن حسان (حفظه‌الله)",
                  "مفتي صاحب سیف الرحمن سعید (حفظه‌الله)",
                  "الحاج مولوي محمد پزیر فاروقي (حفظه‌الله)",
                  "مولوي صاحب محب‌الله",
                  "مولوي صاحب شفیق الرحمن اخوند زاده",
                  "مولوي صاحب احمد نبي",
                  "مولوي صاحب صادق سکندر",
                  "مولوي صاحب طاهر بلال",
                  "مولوي صاحب رفیع‌الله ابوالسیف",
                  "مولوي صاحب محمد شریف عمر فضلي",
                  "مولوي صاحب ضیاءالله عمري",
                  "مولوي صاحب سمیع‌الله فهام",
                  "مولوي صاحب سمیع‌الله راشد",
                  "قاري صاحب محمد میرویس تحسین",
                  "حافظ صاحب رحمن‌الله قائد",
                  "حافظ صاحب صدیق‌الله",
                  "  مولوی صاحب حافظ الله خادم",
                  "  مولوی صاحب عادل قریشی",
                  " مولوی صاحب نورالرحمن  عمر ",
                ].map((teacher, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-br from-[#4a8a8a]/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-br from-white to-[#f9fafb] p-5 rounded-lg border-r-4 border-[#4a8a8a]/30 hover:border-[#4a8a8a] transition-all duration-300">
                      <p
                        className="text-sm md:text-base font-semibold text-gray-800 text-center leading-relaxed"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        {teacher}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#4a8a8a]/5 to-transparent rounded-lg blur-2xl"></div>
                <div className="relative text-center p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#4a8a8a] to-[#3a7a7a] rounded-full mb-6">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3
                    className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "Amiri, serif" }}
                  >
                    د شاګردانو داخله
                  </h3>
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#4a8a8a]/30 to-transparent mx-auto mb-6"></div>
                  <p
                    className="text-lg md:text-xl text-gray-700 leading-relaxed px-4 sm:px-6"
                    style={{ fontFamily: "Amiri, serif" }}
                  >
                    هر کال شاوخوا ۵۰۰ تر ۷۰۰ پورې لیلي شاګردانو ته داخله ورکول
                    کېږي.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#4a8a8a]/5 to-transparent rounded-lg blur-2xl"></div>
                <div className="relative text-center p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#4a8a8a] to-[#3a7a7a] rounded-full mb-6">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <h3
                    className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "Amiri, serif" }}
                  >
                    فارغین
                  </h3>
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#4a8a8a]/30 to-transparent mx-auto mb-6"></div>
                  <p
                    className="text-lg md:text-xl text-gray-700 leading-relaxed px-4 sm:px-6"
                    style={{ fontFamily: "Amiri, serif" }}
                  >
                    د تېرو پنځلسو کلونو په ترڅ کې شاوخوا ۷۰۰ تنه فارغین یې د
                    علمي پړاوونو څخه فارغ شوي او ټولنې ته وړاندې شوي دي.
                  </p>
                </div>
              </div>
            </div>

            {/* Family and Successors Section */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#4a8a8a] to-[#3a7a7a] rounded-full mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "Amiri, serif" }}
                >
                  د کورنۍ او ځای ناستو پېژندنه
                </h2>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#4a8a8a]"></div>
                  <div className="w-2 h-2 bg-[#4a8a8a] rounded-full"></div>
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#4a8a8a]"></div>
                </div>
              </div>

              <div className="space-y-16">
                {/* Brothers */}
                <div className="relative">
                  <div className="absolute right-0 top-0 w-48 h-48 bg-[#4a8a8a]/5 rounded-full blur-3xl"></div>
                  <div className="relative">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#4a8a8a] to-[#3a7a7a] rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <h3
                          className="text-2xl md:text-3xl font-bold text-gray-900"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          د ارغندی د خلیفه صاحب وروڼه
                        </h3>
                      </div>
                      <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#4a8a8a]/30 to-transparent mx-auto mb-8"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-br from-[#4a8a8a]/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative bg-gradient-to-br from-white to-[#f9fafb] p-6 rounded-lg border-r-4 border-[#4a8a8a]/30 hover:border-[#4a8a8a] transition-all duration-300">
                          <h4
                            className="font-bold text-gray-900 mb-4 text-lg md:text-xl"
                            style={{ fontFamily: "Amiri, serif" }}
                          >
                            محترم احمدزی
                          </h4>
                          <p
                            className="text-base md:text-lg text-gray-700 leading-relaxed px-2 sm:px-0"
                            style={{ fontFamily: "Amiri, serif" }}
                          >
                            ده ښو اخلاقوڅښتن اومتقی شخص وه.
                          </p>
                        </div>
                      </div>
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-br from-[#4a8a8a]/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative bg-gradient-to-br from-white to-[#f9fafb] p-6 rounded-lg border-r-4 border-[#4a8a8a]/30 hover:border-[#4a8a8a] transition-all duration-300">
                          <h4
                            className="font-bold text-gray-900 mb-4 text-lg md:text-xl leading-relaxed"
                            style={{ fontFamily: "Amiri, serif" }}
                          >
                            جناب تاج المشائخ خلیفه صاحب سدوزی غریقي رحمه الله
                          </h4>
                          <p
                            className="text-base md:text-lg text-gray-700 leading-relaxed px-2 sm:px-0"
                            style={{ fontFamily: "Amiri, serif" }}
                          >
                            د ارغندی خلیفه صاحب ورور او په علمي ډګر کې ځای ناستی
                            وو. د وخت جید عالم، مدرس، پیاوړۍ مجاهد او لـوی عـارف
                            وو.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sons */}
                <div className="relative py-8">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4a8a8a]/20 to-transparent"></div>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#4a8a8a] to-[#3a7a7a] rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <h3
                        className="text-2xl md:text-3xl font-bold text-gray-900"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        د ارغندي خلیفه صاحب پنځه زامن
                      </h3>
                    </div>
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#4a8a8a]/30 to-transparent mx-auto mb-8"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-br from-[#4a8a8a]/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative bg-gradient-to-br from-white to-[#f9fafb] p-6 rounded-lg border-r-4 border-[#4a8a8a]/30 hover:border-[#4a8a8a] transition-all duration-300">
                        <h4
                          className="font-bold text-gray-900 mb-4 text-base md:text-lg leading-relaxed"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          جناب الحاج قاری صاحب عبدالعلیم فضلي
                        </h4>
                        <p
                          className="text-base md:text-lg text-gray-700 leading-relaxed px-2 sm:px-0"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          مشر زوى، د ښواخلاقو څښتن اوزړه سواند شخصیت ده.
                        </p>
                      </div>
                    </div>
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-br from-[#4a8a8a]/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative bg-gradient-to-br from-white to-[#f9fafb] p-6 rounded-lg border-r-4 border-[#4a8a8a]/30 hover:border-[#4a8a8a] transition-all duration-300">
                        <h4
                          className="font-bold text-gray-900 mb-4 text-base md:text-lg leading-relaxed"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          جناب الحاج خلیفه صاحب نعمت الله فضلي
                        </h4>
                        <p
                          className="text-base md:text-lg text-gray-700 leading-relaxed px-2 sm:px-0"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          د قوي عزم خاوند، د تصوف او سلوک په ډګر کې د جناب قطب
                          المشائخ لخوا ورته د خلافت دستار ور په سر کړل شو.
                        </p>
                      </div>
                    </div>
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-br from-[#4a8a8a]/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative bg-gradient-to-br from-white to-[#f9fafb] p-6 rounded-lg border-r-4 border-[#4a8a8a]/30 hover:border-[#4a8a8a] transition-all duration-300">
                        <h4
                          className="font-bold text-gray-900 mb-4 text-base md:text-lg"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          انجینر رحمت الله فضلي
                        </h4>
                        <p
                          className="text-base md:text-lg text-gray-700 leading-relaxed px-2 sm:px-0"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          دحلم او زغم نمونه ده.
                        </p>
                      </div>
                    </div>
                    <div className="relative group md:col-span-2 lg:col-span-3">
                      <div className="absolute -inset-1 bg-gradient-to-br from-[#4a8a8a]/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative bg-gradient-to-br from-white to-[#f9fafb] p-6 rounded-lg border-r-4 border-[#4a8a8a]/30 hover:border-[#4a8a8a] transition-all duration-300">
                        <h4
                          className="font-bold text-gray-900 mb-4 text-base md:text-lg leading-relaxed"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          جناب قلب المشائخ الحاج خلیفه صاحب محمدشفیق فضلي دام
                          الله حیاته وفیوضاته
                        </h4>
                        <p
                          className="text-base md:text-lg text-gray-700 leading-relaxed px-2 sm:px-0"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          جید عالم او کامل متبع د شریعت چې ده. جناب تاج المشائخ
                          رحمه الله د وفات څخه وروسته د انوار العلوم اسلامي
                          مدرسې مهتمم شیخ الحدیث او دخلیفه صاحب ځاي ناستي ده،
                          اوس مهال د تصوف اوسلوک په ډګر کې یو لا مثال شخصیت ده.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#4a8a8a]/20 to-transparent"></div>
                </div>

                {/* Famous Khalifas */}
                <div className="relative py-8">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4a8a8a]/20 to-transparent"></div>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#4a8a8a] to-[#3a7a7a] rounded-full flex items-center justify-center">
                        <Star className="h-5 w-5 text-white" />
                      </div>
                      <h3
                        className="text-2xl md:text-3xl font-bold text-gray-900"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                     د ده مبارک هغه مشهور خليفه ګان  چې  په خپلو لاسونو یې ورته دخلافت دستار ورپه سر کړي وه   
                      </h3>
                    </div>
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#4a8a8a]/30 to-transparent mx-auto mb-8"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {[
                      "سراج المشائخ خلیفه صاحب احمد ضیا قدس الله سره دمیدان وردګو ولایت جغتو ولسوالی",
                      "قطب المشائخ خلیفه صاحب دین محمد قدس الله، د پکتیا ولایت زرمت ولسوالی",
                      "جناب أبو الحسن خليفـه صـاحب مشهور په صوفي صاحب د لوګر ولایت",
                      "جناب عبد الستار خلیفه صاحب د وخت جـيـد عـالـم او لوی روحاني شخصیت وو د لوګر ولایت",
                      "جناب عبد الرشيد خليفه صاحب د لوګر ولایت",
                      "جناب ملا كل خلیفه صاحب د لوګر ولایت",
                      "جناب نعمت الله خلیفه صاحب د لوګر ولایت",
                      "جناب عثمان غنی خلیفه صاحب اصلا دغزنی ولایت اندړو ولسوالی، فعلاً دپکتیکا ولایت نکه ولسوالی اړوند دی",
                    ].map((khalifa, index) => (
                      <div key={index} className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-br from-[#4a8a8a]/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative bg-gradient-to-br from-white to-[#f9fafb] p-6 rounded-lg border-r-4 border-[#4a8a8a]/30 hover:border-[#4a8a8a] transition-all duration-300">
                          <p
                            className="text-base md:text-lg font-semibold text-gray-800 leading-relaxed"
                            style={{ fontFamily: "Amiri, serif" }}
                          >
                            {khalifa}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#4a8a8a]/20 to-transparent"></div>
                </div>

                {/* Successors */}
                <div className="relative py-8">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4a8a8a]/20 to-transparent"></div>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#4a8a8a] to-[#3a7a7a] rounded-full flex items-center justify-center">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <h3
                        className="text-2xl md:text-3xl font-bold text-gray-900"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        د جناب ارغندي خليفه صاحب هغه خليفه صاحبان چې منازل د
                        سلوک ېې له ارغندي خلیفه صاحب سره طی کړي وو او د خلافت
                        دستارونه ورته نورو خلیفه صاحبانو ورته په سر کړی وه
                      </h3>
                    </div>
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#4a8a8a]/30 to-transparent mx-auto mb-8"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {[
                      "تاج المشائخ خلیفه صاحب سدوزی غریقي رحمه الله",
                      "جناب خلیفه صاحب نعمت الله فضلي حفظه الله",
                      "شمس المشائخ خلیفه صاحب دین محمد حفظه الله",
                      "نجم المشائخ خلیفه صاحب داد محمد نوري حفظه الله",
                      "روح المشائخ خلیفه صاحب عبدالحی فقیرالله حفظه الله",
                      "قطب المشائخ خلیفه صاحب محمد انور ابو زبېرحفظه الله",
                      "محب المشائخ خلیفه صاحب محمد معراج روحاني رحمه الله",
                      "جناب خلیفه صاحب محمد عباس حفظه الله",
                      "فخر المشائخ جناب خلیفه صاحب محمد اکرم خادم حفظه الله",
                      "جناب خلیفه صاحب محمد هاشم حفظه الله",
                      "جناب خلیفه صاحب عزت الله حفظه الله",
                      "جناب خلیفه صاحب عاشق الرحمن حفظه الله",
                      "جناب خلیفه صاحب اسماعیل جان حفظه الله",
                      "جناب خلیفه صاحب سید محمد حفظه الله",
                      "جناب خلیفه صاحب بهادر رحمه الله",
                      "جناب خلیفه صاحب فهیم حفظه الله",
                      "جناب خلیفه صاحب حمید الله حفظه الله",
                      "جناب خلیفه صاحب رسول محمد حفظه الله",
                      "جناب خلیفه صاحب وزیر حفظه الله",
                    ].map((successor, index) => (
                      <div key={index} className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-br from-[#4a8a8a]/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative bg-gradient-to-br from-white to-[#f9fafb] p-5 rounded-lg border-r-4 border-[#4a8a8a]/30 hover:border-[#4a8a8a] transition-all duration-300">
                          <p
                            className="text-sm md:text-base font-semibold text-gray-800 text-center leading-relaxed"
                            style={{ fontFamily: "Amiri, serif" }}
                          >
                            {successor}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#4a8a8a]/20 to-transparent"></div>
                </div>

                {/* Re-establishment */}
                <div className="relative py-12">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4a8a8a]/20 to-transparent"></div>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#4a8a8a] to-[#3a7a7a] rounded-full flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <h3
                        className="text-2xl md:text-3xl font-bold text-gray-900"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        د مدرسې بیا بنسټ
                      </h3>
                    </div>
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#4a8a8a]/30 to-transparent mx-auto mb-8"></div>
                  </div>
                  <p
                    className="text-lg md:text-xl leading-relaxed text-center mb-8 text-gray-700 max-w-4xl mx-auto px-4 sm:px-6"
                    style={{ fontFamily: "Amiri, serif" }}
                  >
                    دجناب ارغندی خلیفه صاحب کورنی دهجرت له دیارڅخه چې کله بېرته
                    راستنه شوه نو په دوهم ځل یې دکابل پغمان ارغندی سیمه کې
                    دمدرسې بنیاد دجناب تاج المشائخ خلیفه صاحب سدوزی غریقی. او
                    دارغندی خلیفه صاحب د زامنو، علماءو او دمخورو په لاس په تاریخ
                    ښود ل شو.
                  </p>
                  <div className="bg-gradient-to-br from-[#f0f9f9] to-white p-6 md:p-8 rounded-lg border-r-4 border-[#4a8a8a] max-w-md mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Clock className="h-5 w-5 text-[#4a8a8a]" />
                      <p
                        className="text-xl font-bold text-[#4a8a8a]"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        د مدرسې بیا بنسټ:
                      </p>
                    </div>
                    <div className="space-y-2 text-center">
                      <p
                        className="text-base md:text-lg font-semibold text-gray-800"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        ۱۷ / ٦ / ١٤٢٦ هـ ق
                      </p>
                      <p
                        className="text-base md:text-lg font-semibold text-gray-800"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        ۱ / ۵ / ١٣٨۴ هـ ش
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#4a8a8a]/20 to-transparent"></div>
                </div>
              </div>
            </div>

            {/* Teacher Qualifications */}
            <div className="mb-16">
              <div className="relative">
                <div className="absolute left-0 top-0 w-64 h-64 bg-[#4a8a8a]/5 rounded-full blur-3xl"></div>
                <div className="relative text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#4a8a8a] to-[#3a7a7a] rounded-full mb-6">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h2
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "Amiri, serif" }}
                  >
                    د استادانو علمي سویه
                  </h2>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#4a8a8a]"></div>
                    <div className="w-2 h-2 bg-[#4a8a8a] rounded-full"></div>
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#4a8a8a]"></div>
                  </div>
                  <p
                    className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4 sm:px-6"
                    style={{ fontFamily: "Amiri, serif" }}
                  >
                    د جامعې استادان د لوړو علمي سطحو څښتنان دي، چې د ماسټري،
                    دوکتورا او تخصصي درجې لري.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prayer Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#4a8a8a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white rounded-2xl p-8 sm:p-12 md:p-16 border border-gray-200 shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4a8a8a] rounded-2xl mb-8">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-8"
              style={{ fontFamily: "Amiri, serif" }}
            >
              دعا او امید
            </h2>
            <p
              className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed font-medium px-4 sm:px-6"
              style={{ fontFamily: "Amiri, serif" }}
            >
              الله ج دې ترقیامته پورې دا پور نوره روانه بېړی روانه لری
            </p>
            <div className="bg-[#e0f2f2] rounded-2xl p-6 sm:p-8 md:p-10 border border-[#d0e8e8]">
              <p
                className="text-base md:text-lg text-gray-700 leading-relaxed px-2 sm:px-0"
                style={{ fontFamily: "Amiri, serif" }}
              >
                &ldquo;د ده روح دې تر قيـامـتـه ښـاد وي او د ده فيض دې جـاري
                وي&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8"
            style={{ fontFamily: "Amiri, serif" }}
          >
            زموږ <span className="text-[#4a8a8a]">ټولنې</span> سره یوځای شئ
          </h2>
          <p
            className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-4 sm:px-6"
            style={{ fontFamily: "Amiri, serif" }}
          >
            زموږ د اسلامي تعلیماتو او روحاني ودې د میراث برخه شئ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#4a8a8a] text-white font-bold rounded-xl hover:bg-[#5a9a9a] hover:scale-105 transition-all duration-200 shadow-lg text-base sm:text-lg"
              style={{ fontFamily: "Amiri, serif" }}
            >
              کورسونو ته وګورئ
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <a
              href={`https://wa.me/+93796148087?text=${encodeURIComponent(
                "اسلام علیکم ورحمته الله وبرکاتو ولیکه"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#4a8a8a] text-[#4a8a8a] font-bold rounded-xl hover:bg-[#e0f2f2] transition-all duration-200 shadow-lg hover:scale-105 text-base sm:text-lg"
              style={{ fontFamily: "Amiri, serif" }}
            >
              اړیکه ونیسئ
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
