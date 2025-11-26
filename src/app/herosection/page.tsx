"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { useTranslation } from "@/hooks/useTranslation";
import { getLanguageDirection } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

// ✅ Array of images from public folder
const images = [
  "/hero1.jpg",
  "/hero2.jpg",
  "/hero3.jpg",
  "/hero4.jpg",
 "/hero5.jpg",
  "/hero6.jpg",
  "/hero7.jpg",
  "/hero8.jpg",
  "/hero9.jpg",
  "/hero10.jpg",
  "/hero11.jpg",
  "/hero12.jpg",
  "/hero13.jpg",
  "/hero14.jpg",
  "/hero15.jpg",
  "/hero22.jpg",
  "/hero16.jpg",
  "/hero17.jpg",
  "/hero18.jpg",
  "/hero19.jpg",
  "/hero20.jpg",
  "/hero21.jpg",
  
];

const Ship = "/ship.png";

// ✅ Scrolling row — smooth and natural animation
const ScrollingRow = ({
  direction = "left",
  delay = 0,
}: {
  direction?: "left" | "right";
  delay?: number;
}) => {
  const repeatedImages = [...images, ...images];
  const imageWidth = 400;
  const gap = 12;
  const totalWidth = (imageWidth + gap) * images.length;

  return (
    <motion.div
      className="flex gap-3 w-max"
      animate={{
        x: direction === "left" ? [-totalWidth, 0] : [0, -totalWidth],
      }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        duration: 400,
        ease: "linear",
        delay,
      }}
      style={{
        width: totalWidth * 2,
        willChange: "transform",
      }}
    >
      {repeatedImages.map((img, index) => (
        <Image
          key={`${img}-${index}`}
          src={img}
          alt={`scrolling-${index}`}
          width={400}
          height={260}
          className="w-[270px] h-[160px] sm:w-[320px] sm:h-[180px] lg:w-[400px] lg:h-[260px] rounded-lg object-cover shadow-2xl drop-shadow-[8px_8px_16px_rgba(0,0,0,0.8)] hover:shadow-3xl transition-shadow duration-300 flex-shrink-0"
        />
      ))}
    </motion.div>
  );
};

const Hero = () => {
  const { t, i18n } = useTranslation("common", { useSuspense: false });
  const isRTL = getLanguageDirection(i18n?.language || "ps") === "rtl";

  return (
    <section
      className="relative bg-green-800 overflow-hidden mt-40 md:mt-20 flex flex-col justify-center"
      dir="ltr"
    >
      {/* Background Ship */}
      <Image
        src={Ship}
        alt="Background ship"
        fill
        className="object-cover absolute inset-0 z-10 opacity-70"
        priority
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-20" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 z-[21]" />

      {/* Custom Gradient Overlay */}
      <div className="w-full h-full bg-gradient-to-tr from-black/60 via-transparent to-transparent absolute inset-0 z-[22]" />

      {/* 🌑 Enhanced Center Blur Shadow */}
      <div className="absolute inset-0 z-[25] flex items-center justify-center pointer-events-none">
        <div
          className="w-full max-w-6xl h-[85vh] rounded-[3rem] blur-[90px] md:blur-[110px]"
          style={{
            background: `
              radial-gradient(
                circle at center,
                rgba(0,0,0,0.95) 0%,
                rgba(0,0,0,0.85) 35%,
                rgba(0,0,0,0.75) 60%,
                rgba(0,0,0,0.55) 80%,
                transparent 100%
              )
            `,
            boxShadow: "0 0 100px 80px rgba(0,0,0,0.9)",
          }}
        ></div>
      </div>

      {/* Scrolling Rows */}
      <div className="relative z-30  flex flex-col space-y-2 py-30">
        <div className="overflow-hidden">
          <ScrollingRow direction="left" delay={0} />
        </div>
        <div className="overflow-hidden">
          <ScrollingRow direction="right" delay={1} />
        </div>
        <div className="overflow-hidden">
          <ScrollingRow direction="left" delay={2} />
        </div>
        <div className="overflow-hidden">
          <ScrollingRow direction="right" delay={3} />
        </div>
        <div className="overflow-hidden lg:hidden">
          <ScrollingRow direction="left" delay={3} />
        </div>
    
      </div>

      {/* Center Text */}
      <div className="absolute inset-0 z-40 flex items-start justify-center px-4 pt-16 md:pt-60">
  {/* 🔥 Dark overlay behind text for better contrast */}
  <div className="absolute inset-0 bg-black/15 rounded-2xl"></div>

  <div className="relative text-white max-w-4xl mx-auto text-center space-y-4 md:space-y-6 pt-20 md:pt-0">
    {/* Tagline */}
    <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-sky-200 font-bold px-4 py-2 rounded-full bg-sky-500/40 inline-block shadow-xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
      {t("hero.tagline")}
    </p>

    {/* Title & Subtitle */}
    <h1 className="text-3xl pt-2 sm:text-5xl md:text-6xl lg:text-5xl font-bold leading-tight drop-shadow-[0_8px_20px_rgba(0,0,0,1)]">
      <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-[0_6px_12px_rgba(0,0,0,1)]">
        {t("hero.title")}
      </span>
      <span className="block text-xl pt-2 sm:text-2xl md:text-3xl lg:text-4xl text-white mt-2 drop-shadow-[0_6px_12px_rgba(0,0,0,1)]">
        {t("hero.subtitle")}
      </span>
    </h1>

    {/* Description */}
    <p className="text-base pt-2 sm:text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto drop-shadow-[0_6px_12px_rgba(0,0,0,1)]">
      {t("hero.description")}
    </p>

    {/* Buttons */}
    <div className="flex flex-wrap gap-4  justify-center mt-8 pt-2">
      <Link href="/about">
        <Button
          variant="primary"
          size="lg"
          className="rounded-full shadow-2xl drop-shadow-[0_6px_16px_rgba(0,0,0,1)] hover:scale-105 transition-transform duration-200"
        >
          {t("hero.aboutUs")} <FaArrowLeft className="ml-2" />
        </Button>
      </Link>

      <Link href="/courses">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full shadow-2xl drop-shadow-[0_6px_16px_rgba(0,0,0,1)] bg-white/10 border-orange-400 text-orange-300 hover:bg-orange-500/25 hover:text-white hover:scale-105 transition-transform duration-200"
        >
          {t("hero.ourCourses")}
        </Button>
      </Link>
    </div>
  </div>
</div>

    </section>
  );
};

export default Hero;
