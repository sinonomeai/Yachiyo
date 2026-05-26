"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export const Loading = ({ onComplete }: { onComplete?: () => void }) => {
  const col = 15;
  const row = 10;
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const hexagons = [];
  for (let i = 0; i < row; i++) {
    const rowHexagons = [];
    for (let j = 0; j < col; j++) {
      rowHexagons.push({
        id: `${i}-${j}`,
        x: i % 2 ? 86.5 * j * 1.5 : 86.5 * j * 1.5 + 64.95,
        y: 75 * i * 1.5,
      });
    }
    hexagons.push(rowHexagons);
  }

  useEffect(() => {
    const tl = gsap.timeline();

    gsap.set(".hexagon-use", {
      strokeDashoffset: () => (Math.random() > 0.5 ? -100 : 100),
      strokeOpacity: 0,
      transformOrigin: "50% 50%",
    });

    tl.to(".hexagon-use", {
      strokeOpacity: 1,
      duration: 0.5,
      ease: "power4.out",
      stagger: { from: "random", each: 0.004 },
    }).to(".hexagon-use", {
      scale: 0,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
      stagger: { from: "center", each: 0.004 },
      onStart: () => {
        // 六边形消失动画开始时，背景同步逐渐变透明
        gsap.to(containerRef.current, {
          backgroundColor: "rgba(0, 0, 0, 0)",
          duration: 1,
          ease: "power4.out",
        });
      },
      onComplete: () => {
        // 动画结束，立即卸载组件
        setIsVisible(false);
        onComplete?.();
      },
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black"
      style={{ transition: "background-color 1s ease-out" }}>
      <svg className="w-full h-full" viewBox="442 -20 1000 1000">
        <defs>
          <polygon
            id="loading_hexagon"
            points="0,-75 64.95,-37.5 64.95,37.5 0,75 -64.95,37.5 -64.95,-37.5"
            fill="#171717"
          />
        </defs>
        {hexagons.map((row, i) => (
          <g key={`row-${i}`}>
            {row.map(({ id, x, y }) => (
              <g key={id} transform={`translate(${x},${y})`}>
                <use
                  className="hexagon-use
                  stroke-[#17f700] stroke-[0.8px]"
                  href="#loading_hexagon"
                />
              </g>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
};
