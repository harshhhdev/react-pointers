"use client";

import { useEffect } from "react";
import { useCursor } from "qursor";
import { TextScramble } from "../components/text-scramble";
import Image from "next/image";
import { motion } from "motion/react";

export default function Page() {
  const { setVariant } = useCursor();

  useEffect(() => {
    const interactiveElements = document.querySelectorAll("button, a");
    interactiveElements.forEach((element) => {
      element.setAttribute("data-cursor", "hover");

      const children = element.querySelectorAll("*");
      children.forEach((child) => {
        // @ts-expect-error - child is an Element
        child.style.pointerEvents = "none";
      });
    });
  }, []);

  useEffect(() => {
    const resetCursor = () => {
      setVariant("default");
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resetCursor();
      }
    };

    const handleFocus = () => {
      resetCursor();
    };

    const handleLoad = () => {
      resetCursor();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("load", handleLoad);

    resetCursor();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("load", handleLoad);
    };
  }, [setVariant]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-y-3 relative">
      <div className="mesh-bg opacity-10">
        <svg
          className="mesh-gradient mesh-gradient--pink"
          viewBox="0 0 600 600"
        >
          <defs>
            <linearGradient id="pinkGradient" gradientTransform="rotate(45)">
              <stop offset="0%" stopColor="rgba(255,182,193,0.7)" />
              <stop offset="100%" stopColor="rgba(255,105,180,0.7)" />
            </linearGradient>
          </defs>
          <path
            d="M421.5,341.5Q385,433,297,456.5Q209,480,138.5,411Q68,342,90,254.5Q112,167,201.5,131Q291,95,366,139.5Q441,184,446.5,266Q452,348,421.5,341.5Z"
            fill="url(#pinkGradient)"
          />
        </svg>
        <svg
          className="mesh-gradient mesh-gradient--purple"
          viewBox="0 0 600 600"
        >
          <defs>
            <linearGradient id="purpleGradient" gradientTransform="rotate(45)">
              <stop offset="0%" stopColor="rgba(221,160,221,0.6)" />
              <stop offset="100%" stopColor="rgba(186,85,211,0.6)" />
            </linearGradient>
          </defs>
          <path
            d="M505,344.5Q484,439,386,460Q288,481,207.5,439.5Q127,398,98.5,315Q70,232,142,176.5Q214,121,305,103.5Q396,86,467,142Q538,198,523,286.5Q508,375,505,344.5Z"
            fill="url(#purpleGradient)"
          />
        </svg>
        <svg
          className="mesh-gradient mesh-gradient--blue"
          viewBox="0 0 600 600"
        >
          <defs>
            <linearGradient id="blueGradient" gradientTransform="rotate(45)">
              <stop offset="0%" stopColor="rgba(135,206,235,0.6)" />
              <stop offset="100%" stopColor="rgba(173,216,230,0.6)" />
            </linearGradient>
          </defs>
          <path
            d="M393,461Q303,522,204.5,494.5Q106,467,92.5,360.5Q79,254,154.5,185.5Q230,117,329.5,105.5Q429,94,471.5,180Q514,266,451.5,323Q389,380,393,461Z"
            fill="url(#blueGradient)"
          />
        </svg>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Image
          src="/hero-graphic.png"
          alt="Logo"
          width={128}
          height={128}
          className="border border-neutral-800 rounded-3xl mb-3 shadow-xl"
        />
      </motion.div>
      <motion.h1
        className="text-4xl"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Welcome to <strong>Qursor.</strong>
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <TextScramble className="text-muted-foreground font-mono text-sm uppercase">
          Plug N' Play Cursors for React
        </TextScramble>
      </motion.div>
      <motion.hr
        className="w-36 border-border my-8"
        initial={{ width: 0 }}
        animate={{ width: 144 }}
        transition={{ delay: 0.75 }}
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        className="flex"
      >
        <a
          href="https://github.com/haaarshsingh/qursor"
          target="_blank"
          rel="noopener noreferrer"
          draggable={false}
          data-cursor="hover"
          className="group active:scale-[.98] text-sm inline-flex items-center rounded-full pl-5 pr-6 py-2.5 transition"
        >
          Get Started
          <svg
            className="ml-2 -mr-1 stroke-white stroke-2"
            fill="none"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            aria-hidden="true"
          >
            <path
              className="opacity-0 transition group-hover:opacity-100"
              d="M0 5h7"
            ></path>
            <path
              className="transition group-hover:translate-x-[3px]"
              d="M1 1l4 4-4 4"
            ></path>
          </svg>
        </a>
      </motion.div>
    </div>
  );
}
