"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import VisibleProgressCircle from "@/components/VisibleProgressCircle";
import Link from "next/link";
import FooterHome from "@/components/FooterHome";
import SplashScreen from "@/components/SplashScreen";

// TODO: remplacer poster-dark.svg par de vraies captures des vidéos
// ex: ffmpeg -i videotest0.mp4 -ss 00:00:03 -frames:v 1 public/videos/poster0.jpg
const VIDEO_POSTER = "/videos/poster-dark.svg";

const TRANSITION_MS = 900;

const SLIDES = [
  {
    subtitle: "LES PRODS A PRIX ABORDABLE",
    title: "BEAT DE QUALITÉ",
    href: "/catalogue",
    cta: "VOIR LE CATALOGUE",
    video: "/videos/videotest0.mp4",
  },
  {
    subtitle: "NOS ABONNEMENTS",
    title: "INFINI",
    href: "/abonnements",
    cta: "VOIR NOS OFFRES",
    video: "/videos/videotest1.mp4",
  },
  {
    subtitle: "OBTIENT TA PROD PERSONNALISÉE",
    title: "SUR MESURE",
    href: "/prodsurmesure",
    cta: "EN SAVOIR PLUS",
    video: "/videos/videotest2.mp4",
  },
  {
    subtitle: "LE COLLECTIF BEATMAKERZ",
    title: "NOTRE HISTOIRE",
    href: "/web/notrehistoire",
    cta: "EN SAVOIR PLUS",
    video: "/videos/videotest3.mp4",
  },
] as const;

// 4 sections vidéo + 1 footer
const SLIDE_COUNT = SLIDES.length + 1;

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isAnimating = useRef(false);
  const currentIndexRef = useRef(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  // Navigation centrale : toute la logique de transition passe par ici
  const goTo = useCallback((index: number) => {
    if (isAnimating.current) return;
    const clamped = Math.max(0, Math.min(SLIDE_COUNT - 1, index));
    if (clamped === currentIndexRef.current) return;

    isAnimating.current = true;
    currentIndexRef.current = clamped;
    setCurrentIndex(clamped);

    setTimeout(() => {
      isAnimating.current = false;
    }, TRANSITION_MS + 150);
  }, []);

  // Play/pause vidéos en fonction de la section active
  useEffect(() => {
    if (isLoading) return;
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === currentIndex && i < SLIDES.length) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [currentIndex, isLoading]);

  // Wheel — desktop uniquement
  useEffect(() => {
    if (isLoading) return;
    const isTouchOnly =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches &&
      !window.matchMedia("(pointer: fine)").matches;
    if (isTouchOnly) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating.current) return;
      if (e.deltaY > 0) goTo(currentIndexRef.current + 1);
      else if (e.deltaY < 0) goTo(currentIndexRef.current - 1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isLoading, goTo]);

  // Touch swipe — mobile
  useEffect(() => {
    if (isLoading) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? 0;
      touchStartX.current = e.touches[0]?.clientX ?? 0;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null || touchStartX.current === null) return;
      const dy = touchStartY.current - (e.changedTouches[0]?.clientY ?? 0);
      const dx = Math.abs(touchStartX.current - (e.changedTouches[0]?.clientX ?? 0));
      // Ignorer les swipes horizontaux (ex: carrousels internes)
      if (Math.abs(dy) > 50 && Math.abs(dy) > dx * 1.5) {
        goTo(currentIndexRef.current + (dy > 0 ? 1 : -1));
      }
      touchStartY.current = null;
      touchStartX.current = null;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isLoading, goTo]);

  // Clavier
  useEffect(() => {
    if (isLoading) return;
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown"].includes(e.key)) {
        e.preventDefault();
        goTo(currentIndexRef.current + 1);
      }
      if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goTo(currentIndexRef.current - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isLoading, goTo]);

  return (
    <>
      {isLoading && (
        <SplashScreen onLoadComplete={() => setIsLoading(false)} duration={800} />
      )}

      {/* Conteneur viewport fixe — ne scroll jamais */}
      <div
        className={`relative h-[100svh] overflow-hidden bg-black text-white transition-opacity duration-500 ${
          isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {/* Track : se déplace verticalement via transform GPU */}
        <div
          className="will-change-transform"
          style={{
            height: `${SLIDE_COUNT * 100}svh`,
            transform: `translateY(calc(${-currentIndex} * 100svh))`,
            transition: isLoading
              ? "none"
              : `transform ${TRANSITION_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`,
          }}
        >
          {/* Sections vidéo */}
          {SLIDES.map((slide, index) => {
            const isActive = currentIndex === index;
            return (
              <section
                key={index}
                className="relative w-full overflow-hidden"
                style={{ height: "100svh" }}
                aria-hidden={!isActive}
              >
                {/* Vidéo fond */}
                <video
                  ref={(el) => { videoRefs.current[index] = el; }}
                  className="absolute inset-0 h-full w-full object-cover"
                  preload="none"
                  muted
                  playsInline
                  loop
                  poster={VIDEO_POSTER}
                >
                  <source src={slide.video} type="video/mp4" />
                </video>

                {/* Overlay sombre */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Contenu — slide-up + fade à l'activation */}
                <div
                  className="absolute bottom-16 left-4 right-4 sm:left-10 sm:right-auto lg:left-16 z-10 sm:max-w-lg lg:max-w-xl flex flex-col space-y-3 sm:space-y-4 items-start"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(28px)",
                    transition: isActive
                      ? `opacity 0.65s ease ${Math.round(TRANSITION_MS * 0.45)}ms, transform 0.65s ease ${Math.round(TRANSITION_MS * 0.45)}ms`
                      : "opacity 0.25s ease, transform 0.25s ease",
                  }}
                >
                  <span className="uppercase text-[10px] xs:text-xs sm:text-sm font-semibold tracking-wider opacity-70 ml-1">
                    {slide.subtitle}
                  </span>
                  <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold leading-tight lg:whitespace-nowrap">
                    {slide.title}
                  </h1>
                  <Link
                    href={{ pathname: slide.href }}
                    className="text-sm sm:text-xs font-bold opacity-90 ml-2 hover:underline"
                    tabIndex={isActive ? 0 : -1}
                  >
                    {slide.cta}
                  </Link>
                  <div className="transform translate-y-5 sm:translate-y-6">
                    <VisibleProgressCircle
                      duration={4}
                      onAnimationEnd={() => goTo(index + 1)}
                      onClick={() => goTo(index + 1)}
                    />
                  </div>
                </div>
              </section>
            );
          })}

          {/* Section footer — closing branded section */}
          <section
            className="relative flex w-full flex-col overflow-hidden bg-[#030308]"
            style={{ height: "100svh" }}
            aria-hidden={currentIndex !== SLIDES.length}
          >
            {/* Séparateur haut */}
            <div className="h-px w-full shrink-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Filigrane centré — occupe l'espace libre */}
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
              aria-hidden
            >
              <span
                className="font-bold leading-none tracking-[0.35em] text-white/[0.03]"
                style={{ fontSize: "clamp(3rem, 14vw, 12rem)" }}
              >
                BEATMAKERZ
              </span>
            </div>

            {/* Footer links poussés en bas */}
            <div className="relative z-10 mt-auto">
              <FooterHome />
            </div>
          </section>
        </div>

        {/* Navigation par points */}
        <nav
          className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3"
          aria-label="Navigation des sections"
        >
          {/* Points pour les 4 sections vidéo */}
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Section ${i + 1}`}
              aria-current={currentIndex === i ? "true" : undefined}
              className="group flex items-center justify-center w-5 h-5"
            >
              <span
                className="block rounded-full"
                style={{
                  width: currentIndex === i ? 10 : 6,
                  height: currentIndex === i ? 10 : 6,
                  background: currentIndex === i
                    ? "rgba(255,255,255,1)"
                    : "rgba(255,255,255,0.35)",
                  boxShadow: currentIndex === i
                    ? "0 0 8px 2px rgba(255,255,255,0.3)"
                    : "none",
                  transition: "all 0.35s ease",
                }}
              />
            </button>
          ))}

          {/* Trait séparateur */}
          <div className="mx-auto h-px w-2 bg-white/20 my-0.5" />

          {/* Point footer — forme distincte (carré arrondi) */}
          <button
            onClick={() => goTo(SLIDES.length)}
            aria-label="Footer"
            aria-current={currentIndex === SLIDES.length ? "true" : undefined}
            className="flex items-center justify-center w-5 h-5"
          >
            <span
              className="block"
              style={{
                width: currentIndex === SLIDES.length ? 8 : 5,
                height: currentIndex === SLIDES.length ? 8 : 5,
                borderRadius: 2,
                background: currentIndex === SLIDES.length
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.25)",
                transition: "all 0.35s ease",
              }}
            />
          </button>
        </nav>
      </div>
    </>
  );
}
