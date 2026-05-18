"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import VisibleProgressCircle from "@/components/VisibleProgressCircle";
import Link from "next/link";
import FooterHome from "@/components/FooterHome";
import SplashScreen from "@/components/SplashScreen";

// TODO: remplacer poster-dark.svg par de vraies captures des vidéos (ex: ffmpeg -i videotest0.mp4 -ss 00:00:03 -frames:v 1 public/videos/poster0.jpg)
const VIDEO_POSTER = "/videos/poster-dark.svg";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const sections = useRef<HTMLElement[]>([]);
  const isScrolling = useRef(false);
  const videoRefs = useRef<HTMLVideoElement[]>([]);

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
    // Disable custom wheel-based scroll hijacking on touch/mobile devices
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth < 768;
    if (isTouchDevice || isSmallScreen) return;

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

  // Pause/lecture des vidéos uniquement quand la section est visible
  useEffect(() => {
    if (typeof window === "undefined" || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isFinite(idx)) return;
          if (entry.isIntersecting) {
            void videoRefs.current[idx]?.play().catch(() => undefined);
          } else {
            videoRefs.current[idx]?.pause();
          }
        });
      },
      { threshold: 0.35 }
    );

    videoRefs.current.forEach((video) => video && observer.observe(video));
    return () => observer.disconnect();
  }, [isLoading]);

  return (
    <>
      {/* Splash screen avec préchargement des vidéos */}
      {isLoading && (
        <SplashScreen
          onLoadComplete={() => setIsLoading(false)}
          duration={800}
        />
      )}

      <div className={`bg-black text-white min-h-[100svh] overflow-hidden transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
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
            "/web/notrehistoire",
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
            className="relative w-full min-h-[100svh] overflow-hidden transition-opacity duration-500"
          >
            <video
              ref={(el) => {
                if (el) {
                  videoRefs.current[index] = el;
                }
              }}
              data-index={index}
              className="absolute top-0 left-0 w-full h-full object-cover z-0"
              preload="none"
              muted
              playsInline
              loop
              poster={VIDEO_POSTER}
            >
              <source src={`/videos/videotest${index}.mp4`} type="video/mp4" />
            </video>
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0"></div>
            <div className="absolute bottom-16 left-4 right-4 sm:left-10 sm:right-auto lg:left-16 z-10 sm:max-w-lg lg:max-w-xl flex flex-col space-y-3 sm:space-y-4 items-start">
              <span className="uppercase text-[10px] xs:text-xs sm:text-sm font-semibold tracking-wider opacity-70 ml-1">
                {subtitle}
              </span>
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold leading-tight lg:whitespace-nowrap">
                {title}
              </h1>
              <Link
                href={{ pathname: href as string }}
                className="text-sm sm:text-xs font-bold opacity-90 ml-2 hover:underline"
              >
                {cta}
              </Link>
              <div className="transform translate-y-5 sm:translate-y-6">
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

      {/* Footer section - clean solid background */}
      <section
        ref={(el) => {
          if (el && !sections.current.includes(el)) {
            sections.current.push(el);
          }
        }}
        className="relative w-full bg-[#030308]"
      >
        <FooterHome />
      </section>
      </div>
    </>
  );
}
