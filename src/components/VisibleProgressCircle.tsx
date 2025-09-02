import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

interface ProgressCircleProps {
  duration?: number;
  onAnimationEnd?: () => void;
  onClick?: () => void;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  duration = 10,
  onAnimationEnd,
  onClick,
}) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const newOffset = circumference * (1 - progress);
      setOffset(newOffset);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setOffset(circumference);
        if (onAnimationEnd) onAnimationEnd();
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [circumference, duration, onAnimationEnd]);

  return (
    <motion.div className="w-16 h-16 cursor-pointer" onClick={onClick}>
      <motion.svg className="w-full h-full" viewBox="0 0 72 72">
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-white/20"
        />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 36 36)"
          className="text-white"
        />
        <motion.image
          href="/img/chevron.png"
          x="26"
          y="26"
          width="20"
          height="20"
          initial={{ translateY: 0 }}
          whileHover={{ translateY: 6 }}
        />
      </motion.svg>
    </motion.div>
  );
};

interface VisibleProgressCircleProps {
  duration?: number;
  onAnimationEnd: () => void;
  onClick?: () => void;
}

const VisibleProgressCircle: React.FC<VisibleProgressCircleProps> = ({
  duration,
  onAnimationEnd,
  onClick,
}) => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.5 });
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (inView) {
      setKey((prev) => prev + 1);
    }
  }, [inView]);

  return (
    <div ref={ref}>
      <ProgressCircle
        key={key}
        duration={duration}
        onAnimationEnd={() => inView && onAnimationEnd()}
        onClick={onClick}
      />
    </div>
  );
};

export default VisibleProgressCircle;
