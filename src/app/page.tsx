"use client";

import { useEffect, useRef, useCallback } from "react";
import VisibleProgressCircle from "@/components/VisibleProgressCircle";
import Link from "next/link";

export default function Home() {
  const sections = useRef<HTMLElement[]>([]);
  const isScrolling = useRef(false);

  const smoothScrollTo = useCallback(
    (targetIndex: number, direction: number, duration = 1200) => {
      const targetSection = sections.current[targetIndex];
      const previousIndex = targetIndex - direction;

      if (!targetSection) return;

      if (previousIndex >= 0 && previousIndex < sections.current.length) {
        const previousSection = sections.current[previousIndex];
        previousSection.style.transition = "opacity 0.4s ease-out";
        previousSection.style.opacity = "0.6";

        setTimeout(() => {
          previousSection.style.opacity = "1";
        }, 200);
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

      smoothScrollTo(nextIndex, direction, 900);
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
            <div className="absolute bottom-24 left-16 z-10 max-w-xl flex flex-col space-y-4 items-start max-sm:left-4 max-sm:bottom-20 max-sm:max-w-[88%]">
              <span className="uppercase text-sm font-semibold tracking-wider opacity-70 ml-1">
                {subtitle}
              </span>
              <h1 className="text-8xl font-bold leading-tight whitespace-nowrap max-sm:text-5xl max-[380px]:text-4xl max-sm:whitespace-normal">
                {title}
              </h1>
              <Link
                href={{ pathname: href as string }}
                className="text-xs font-bold opacity-90 ml-2 hover:underline"
              >
                {cta}
              </Link>
              <div className="transform translate-y-6 max-sm:translate-y-4">
                <VisibleProgressCircle
                  duration={4}
                  onAnimationEnd={() => {
                    const currentIndex = sections.current.findIndex(
                      (section) => section.getBoundingClientRect().top >= -50
                    );
                    const nextIndex = Math.min(
                      currentIndex + 1,
                      sections.current.length - 1
                    );
                    smoothScrollTo(nextIndex, 1, 900);
                  }}
                  onClick={() => {
                    const currentIndex = sections.current.findIndex(
                      (section) => section.getBoundingClientRect().top >= -50
                    );
                    const nextIndex = Math.min(
                      currentIndex + 1,
                      sections.current.length - 1
                    );
                    smoothScrollTo(nextIndex, 1, 900);
                  }}
                />
              </div>
            </div>
          </section>
        );
      })}

    </div>
  );
}
