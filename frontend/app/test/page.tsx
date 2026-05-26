"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Input() {
  const col = 15;
  const row = 10;
  const containerRef = useRef(null);

  // 生成二维数组
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
    // 创建 GSAP Timeline
    const tl = gsap.timeline();

    // 初始状态：所有六边形不可见
    gsap.set(".hexagon-use", {
      strokeDashoffset: () => {
        return Math.random() > 0.5 ? -100 : 100;
      },
      strokeOpacity: 0,
      transformOrigin: "50% 50%", // 设置变换原点为中心
    });

    // Timeline 动画序列
    tl.to(".hexagon-use", {
      strokeOpacity: 1,
      duration: 0.5,
      ease: "power4.out",
      stagger: {
        from: "random",
        each: 0.004,
      },
    }).to(".hexagon-use", {
      scale: 0,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
      stagger: {
        from: "center",
        each: 0.004, 
      },
    });

    return () => {
      tl.kill(); 
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex justify-center items-center 
   w-full h-screen
   bg-[#000] overflow-hidden">
      <svg className="absolute w-full h-full" viewBox="442 -20 1000 1000">
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
}
