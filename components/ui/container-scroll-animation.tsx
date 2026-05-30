"use client";
import React, { useRef } from "react";
import {
  useScroll,
  useTransform,
  motion,
  MotionValue,
  useReducedMotion,
} from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = (): [number, number] =>
    isMobile ? [0.7, 0.9] : [1.05, 1];

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[52rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div className="py-10 md:py-40 w-full relative" style={{ perspective: "1000px" }}>
        <Header translate={reduce ? undefined : translate} titleComponent={titleComponent} />
        <Card
          rotate={reduce ? undefined : rotate}
          translate={reduce ? undefined : translate}
          scale={reduce ? undefined : scale}
        >
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate?: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}) => {
  return (
    <motion.div
      style={translate ? { translateY: translate } : undefined}
      className="max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate?: MotionValue<number>;
  scale?: MotionValue<number>;
  translate?: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={
        rotate && scale
          ? {
              rotateX: rotate,
              scale,
              boxShadow:
                "0 0 #0000000d, 0 9px 20px #0000000a, 0 37px 37px #00000008, 0 84px 50px #00000005, 0 149px 60px #00000003",
            }
          : {
              boxShadow:
                "0 0 #0000000d, 0 9px 20px #0000000a, 0 37px 37px #00000008, 0 84px 50px #00000005, 0 149px 60px #00000003",
            }
      }
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border border-neutral-200 p-2 md:p-4 bg-white rounded-[30px] shadow-2xl"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-neutral-50 md:rounded-2xl">
        {children}
      </div>
    </motion.div>
  );
};
