"use client";

import { useEffect, useRef, useCallback } from "react";
import VisibleProgressCircle from "@/components/VisibleProgressCircle";
import Link from "next/link";
import FooterHome from "@/components/FooterHome";

export default function Home() {
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

  // Pause/lecture des vidéos uniquement quand la section est visible pour réduire le coût initial
  useEffect(() => {
    if (typeof window === "undefined") return;
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
  }, []);

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

      <section
        ref={(el) => {
          if (el && !sections.current.includes(el)) {
            sections.current.push(el);
          }
        }}
        className="relative w-full h-screen overflow-hidden bg-[#090912]"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/25 blur-3xl" />
          <div className="absolute right-[-12rem] top-10 h-[26rem] w-[26rem] rounded-full bg-violet-700/20 blur-[110px]" />
          <div className="absolute bottom-[-10rem] left-16 h-[26rem] w-[26rem] rounded-full bg-indigo-900/20 blur-[110px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.04),transparent_60%)]" />
        </div>
        <div className="relative z-10 flex h-full w-full items-end justify-center pb-8 sm:pb-12">
          <div className="w-full">
            <FooterHome />
          </div>
        </div>
      </section>
    </div>
  );
}
