"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./boot-screen.module.css";

const bootMessages = [
  "Starting Muhammad Dhafa Portfolio...",
  "Loading interface modules...",
  "Connecting creative systems...",
  "Ready.",
];

export default function BootScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const finishBoot = () => {
    setIsLeaving(true);
    window.setTimeout(() => setIsVisible(false), 800);
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (reduceMotion) {
      const timer = window.setTimeout(finishBoot, 0);
      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = originalOverflow;
      };
    }

    const messages = bootMessages.slice(1).map((_, index) =>
      window.setTimeout(() => setMessageIndex(index + 1), (index + 1) * 560),
    );
    const finishTimer = window.setTimeout(finishBoot, 2400);

    return () => {
      messages.forEach(window.clearTimeout);
      window.clearTimeout(finishTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`${styles.screen} ${isLeaving ? styles.leaving : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      {/* <button className={styles.skip} type="button" onClick={finishBoot}>
        Skip intro
      </button> */}

      <div className={styles.content}>
        <div className={styles.mark}>
          <Image
            className={styles.logo}
            src="/favicon.png"
            alt="Muhammad Dhafa logo"
            width={78}
            height={78}
            priority
          />
        </div>
        <p className={styles.brand}>muhammad dhafa</p>

        <div className={styles.terminal}>
          <span className={styles.prompt}>dhafa@portfolio:~$</span>
          <span className={styles.message}>{bootMessages[messageIndex]}</span>
          <span className={styles.cursor} aria-hidden="true" />
        </div>

        <div className={styles.progress} aria-hidden="true">
          <span />
        </div>
      </div>

      <p className={styles.footer}>Ubuntu-inspired</p>
    </div>
  );
}
