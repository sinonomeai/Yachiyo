import { useEffect, useRef } from "react";

interface Options {
  maxOffset?: number; //最大偏移
  friction?: number; //摩擦力
  attract?: number; //吸引力
  maxScale?: number; //最大缩放
}
export const useMouseFollower = (options: Options = {}) => {
  //依赖项
  const {
    maxOffset = 50,
    friction = 0.92,
    attract = 0.5,
    maxScale = 1.3,
  } = options;
  //hook只能在顶层调用
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    const target = targetRef.current;
    //防御性检查,防止组件未挂载、挂载后Ref未绑定或者卸载后报错
    if (!container || !target) return;
    //目标偏移量
    let targetX = 0,
      targetY = 0;
    //现位偏移量,初始值为0，无偏移
    let currentX = 0,
      currentY = 0;
    //速度,(现偏移量+速度=下一帧的现偏移量)
    let velX = 0,
      velY = 0;
    let hovering = false;
    //控制动画的卸载
    let animationId: null | number = null;
    //鼠标进入
    const handleMouseMove = (e: MouseEvent) => {
      //获取容器位置属性信息
      const rect = container.getBoundingClientRect();
      //获取偏移量
      targetX = (e.clientX - rect.left) / rect.width - 0.5;
      targetY = (e.clientY - rect.top) / rect.height - 0.5;
      hovering = true;
    };
    //鼠标离开
    const handleMouseLeave = () => {
      hovering = false;
      targetX = 0;
      targetY = 0;
    };
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    //动画
    const animate = () => {
      if (hovering) {
        velX += (targetX - currentX) * attract;
        velY += (targetY - currentY) * attract;
      } else {
        velX += (0 - currentX) * attract;
        velY += (0 - currentY) * attract;
      }
      //每一帧速度乘以摩擦力,呈现阻力效果
      velX *= friction;
      velY *= friction;
      //计算下一帧现偏移量
      currentX += velX;
      currentY += velY;
      //实际偏移像素
       const tx =
         Math.abs(currentX * maxOffset) < 0.1 ? 0 : currentX * maxOffset;
       const ty =
         Math.abs(currentY * maxOffset) < 0.1 ? 0 : currentY * maxOffset;
      const scale = hovering ? maxScale : 1;
      target.style.transform = `scale(${scale}) translate(${tx}px, ${ty}px)`;
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [maxOffset, friction, attract, maxScale]);
  return { containerRef, targetRef };
};
