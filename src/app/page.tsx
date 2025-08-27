"use client";

import { useEffect, useRef, useCallback } from "react";
import VisibleProgressCircle from "@/components/VisibleProgressCircle";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  const sections = useRef<HTMLElement[]>([]);
  const isScrolling = useRef(false);

  const smoothScrollTo = useCallback(
    (targetIndex: number, direction: number, duration = 3000) => {
      const targetSection = sections.current[targetIndex];
      const previousIndex = targetIndex - direction;

      if (!targetSection) return;

      if (previousIndex >= 0 && previousIndex < sections.current.length) {
        const previousSection = sections.current[previousIndex];
        previousSection.style.transition = "opacity 0.8s ease-out";
        previousSection.style.opacity = "0.3";

        setTimeout(() => {
          previousSection.style.opacity = "1";
        }, 300);
      }

      targetSection.scrollIntoView({ behavior: "smooth" });

      setTimeout(() => {
        isScrolling.current = false;
        sections.current.forEach((section) => {
          section.style.opacity = "1";
        });
      }, duration);
    },
    []
  );

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      if (isScrolling.current) return;
      isScrolling.current = true;

      const direction = event.deltaY > 0 ? 1 : -1;
      const currentIndex = sections.current.findIndex(
        (section) => section.getBoundingClientRect().top >= -50
      );

      const nextIndex = Math.min(
        Math.max(currentIndex + direction, 0),
        sections.current.length - 1
      );

      smoothScrollTo(nextIndex, direction, 1000);
    };

    window.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [smoothScrollTo]);

  return (
    <div className="bg-black text-white h-screen overflow-hidden">
      {[0, 1, 2, 3].map((index) => {
        const titles = [
          [
            "LES PRODS A PRIX ABORDABLE",
            "BEAT DE QUALITÉ",
            "/catalogue",
            "VOIR LE CATALOGUE",
          ],
          ["NOS ABONNEMENTS", "INFINI", "/abonnements", "VOIR NOS OFFRES"],
          [
            "OBTIENT TA PROD PERSONNALISÉE",
            "SUR MESURE",
            "/prodsurmesure",
            "EN SAVOIR PLUS",
          ],
          [
            "LE COLLECTIF BEATMAKERZ",
            "NOTRE HISTOIRE",
            "/notrehistoire",
            "EN SAVOIR PLUS",
          ],
        ];
        const [subtitle, title, href, cta] = titles[index];

        return (
          <section
            key={index}
            ref={(el) => {
              if (el && !sections.current.includes(el)) {
                sections.current.push(el);
              }
            }}
            id={`${index + 1}`}
            className="relative w-full h-screen overflow-hidden transition-opacity duration-500"
          >
            <video
              className="absolute top-0 left-0 w-full h-full object-cover z-0"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src={`/videos/videotest${index}.mp4`} type="video/mp4" />
            </video>
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0"></div>
            <div className="absolute bottom-24 left-16 z-10 max-w-xl flex flex-col space-y-4 items-start">
              <span className="uppercase text-sm font-semibold tracking-wider opacity-70 ml-1">
                {subtitle}
              </span>
              <h1 className="text-8xl font-bold leading-tight whitespace-nowrap">
                {title}
              </h1>
              <Link
                href={href}
                className="text-xs font-bold opacity-90 ml-2 hover:underline"
              >
                {cta}
              </Link>
              <div className="transform translate-y-6">
                <VisibleProgressCircle
                  duration={5}
                  onAnimationEnd={() => {
                    const currentIndex = sections.current.findIndex(
                      (section) => section.getBoundingClientRect().top >= -50
                    );
                    const nextIndex = Math.min(
                      currentIndex + 1,
                      sections.current.length - 1
                    );
                    smoothScrollTo(nextIndex, 1, 2000);
                  }}
                  onClick={() => {
                    const currentIndex = sections.current.findIndex(
                      (section) => section.getBoundingClientRect().top >= -50
                    );
                    const nextIndex = Math.min(
                      currentIndex + 1,
                      sections.current.length - 1
                    );
                    smoothScrollTo(nextIndex, 1, 2000);
                  }}
                />
              </div>
            </div>
          </section>
        );
      })}

      <section
        ref={(el) => {
          if (el && !sections.current.includes(el)) {
            sections.current.push(el);
          }
        }}
        id="5"
        className="relative w-full h-[33vh] overflow-hidden transition-opacity duration-500"
      >
        <Footer />
      </section>
    </div>
  );
}
