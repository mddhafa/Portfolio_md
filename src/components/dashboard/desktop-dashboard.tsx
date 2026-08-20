"use client";

import {
  FileText,
  House,
  Mail,
  Minus,
  Trash2,
  Volume2,
  Wifi,
  X,
  Maximize2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ProjectSection from "@/components/sections/projectsection";
import styles from "./desktop-dashboard.module.css";

type WindowName =
  | "files"
  | "terminal"
  | "settings"
  | "contact";

type WindowState = {
  id: WindowName;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
};

const INITIAL_WINDOWS: Record<WindowName, WindowState> = {
  files: {
    id: "files",
    x: 120,
    y: 80,
    width: 560,
    height: 390,
    minimized: false,
    maximized: false,
    zIndex: 1,
  },

  terminal: {
    id: "terminal",
    x: 690,
    y: 90,
    width: 520,
    height: 340,
    minimized: false,
    maximized: false,
    zIndex: 1,
  },

  settings: {
    id: "settings",
    x: 430,
    y: 390,
    width: 560,
    height: 350,
    minimized: false,
    maximized: false,
    zIndex: 1,
  },

  contact: {
    id: "contact",
    x: 850,
    y: 390,
    width: 390,
    height: 310,
    minimized: false,
    maximized: false,
    zIndex: 1,
  },
};

const APP_NAMES: Record<WindowName, string> = {
  files: "Projects",
  terminal: "Terminal",
  settings: "Settings",
  contact: "Contact",
};

export default function DesktopDashboard() {
  const [time, setTime] = useState("");
  const [windows, setWindows] =
    useState<Record<WindowName, WindowState>>(INITIAL_WINDOWS);

  const [openWindows, setOpenWindows] = useState<WindowName[]>([]);
  const [activeWindow, setActiveWindow] =
    useState<WindowName | null>(null);

  const [highestZ, setHighestZ] = useState(10);

  const workspaceRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Intl.DateTimeFormat("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date())
      );
    };

    updateTime();

    const interval = window.setInterval(updateTime, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  /*
   * OPEN WINDOW
   */
  const openWindow = (id: WindowName) => {
    setOpenWindows((current) => {
      if (current.includes(id)) {
        return current;
      }

      return [...current, id];
    });

    focusWindow(id);
  };

  /*
   * CLOSE WINDOW
   */
  const closeWindow = (id: WindowName) => {
    setOpenWindows((current) =>
      current.filter((windowId) => windowId !== id)
    );

    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  /*
   * FOCUS WINDOW
   */
  const focusWindow = (id: WindowName) => {
    const nextZ = highestZ + 1;

    setHighestZ(nextZ);

    setWindows((current) => ({
      ...current,
      [id]: {
        ...current[id],
        zIndex: nextZ,
        minimized: false,
      },
    }));

    setActiveWindow(id);
  };

  /*
   * MINIMIZE
   */
  const minimizeWindow = (id: WindowName) => {
    setWindows((current) => ({
      ...current,
      [id]: {
        ...current[id],
        minimized: true,
      },
    }));

    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  /*
   * MAXIMIZE
   */
  const toggleMaximize = (id: WindowName) => {
    focusWindow(id);

    setWindows((current) => ({
      ...current,
      [id]: {
        ...current[id],
        maximized: !current[id].maximized,
      },
    }));
  };

  /*
   * DRAG WINDOW
   */
  const handleWindowDrag = (
    event: React.PointerEvent,
    id: WindowName
  ) => {
    const windowState = windows[id];

    if (windowState.maximized) {
      return;
    }

    const workspace = workspaceRef.current;

    if (!workspace) {
      return;
    }

    focusWindow(id);

    const startMouseX = event.clientX;
    const startMouseY = event.clientY;

    const startX = windowState.x;
    const startY = windowState.y;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startMouseX;
      const deltaY = moveEvent.clientY - startMouseY;

      const maxX =
        workspace.clientWidth - windowState.width;

      const maxY =
        workspace.clientHeight - windowState.height;

      const nextX = Math.min(
        Math.max(0, startX + deltaX),
        Math.max(0, maxX)
      );

      const nextY = Math.min(
        Math.max(0, startY + deltaY),
        Math.max(0, maxY)
      );

      setWindows((current) => ({
        ...current,
        [id]: {
          ...current[id],
          x: nextX,
          y: nextY,
        },
      }));
    };

    const handlePointerUp = () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "pointerup",
        handlePointerUp
      );
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp
    );
  };

  /*
   * WINDOW CONTENT
   */
  const renderWindowContent = (id: WindowName) => {
    if (id === "files") {
      return <ProjectSection />;
    }

    if (id === "terminal") {
      return (
        <div className={styles.console}>
          <p>
            <b>dhafa@dhafa-os:~$</b> whoami
          </p>

          <p>Muhammad Dhafa</p>

          <p>
            <b>dhafa@dhafa-os:~$</b> cat profile.txt
          </p>

          <p>
            Software Developer
            <br />
            Web · Mobile · Backend · AI
          </p>

          <p>
            <b>dhafa@dhafa-os:~$</b> ls skills
          </p>

          <p>
            JavaScript&nbsp;&nbsp;
            TypeScript&nbsp;&nbsp;
            React&nbsp;&nbsp;
            Next.js
            <br />
            Node.js&nbsp;&nbsp;
            Python&nbsp;&nbsp;
            FastAPI
            <br />
            Kotlin&nbsp;&nbsp;
            Jetpack Compose
          </p>

          <p>
            <b>dhafa@dhafa-os:~$</b>{" "}
            <span className={styles.consoleCursor} />
          </p>
        </div>
      );
    }

    if (id === "settings") {
      return (
        <>
          <div className={styles.settingsIntro}>
            <div className={styles.avatar}>
              MD
            </div>

            <div>
              <h2>Muhammad Dhafa</h2>
              <p>Software Developer</p>
            </div>
          </div>

          <div className={styles.settings}>
            <span>
              <label>Based on</label>
              <b>Ubuntu / GNOME</b>
            </span>

            <span>
              <label>Environment</label>
              <b>Wayland</b>
            </span>

            <span>
              <label>Theme</label>
              <b>WhiteSur Dark Purple</b>
            </span>

            <span>
              <label>Stack</label>
              <b>React · Next.js · Python</b>
            </span>

            <span>
              <label>Status</label>
              <b className={styles.online}>
                ● Available
              </b>
            </span>
          </div>
        </>
      );
    }

    return (
      <div className={styles.contact}>
        <Mail />

        <h2>Let&apos;s work together 👋</h2>

        <p>
          Have an idea, opportunity, or project
          to discuss?
        </p>

        <a
          className={styles.mailLink}
          href="mailto:mddhafa@gmail.com"
        >
          <Mail />
          Send an email
        </a>

        <small>
          mddhafa@gmail.com
        </small>
      </div>
    );
  };

  return (
    <main className={styles.desktop}>
      {/* TOP BAR */}
      <header className={styles.topbar}>
        <div className={styles.menu}>
          <i />
          <i />
          <i />

          <span>Apps</span>
          <span>Places</span>
        </div>

        <strong>DHAFA OS</strong>

        <div className={styles.status}>
          <time>{time || "--:--"}</time>
          <Wifi />
          <Volume2 />
        </div>
      </header>

      {/* WORKSPACE */}
      <section
        ref={workspaceRef}
        className={styles.workspace}
        aria-label="Dhafa OS desktop"
      >
        {/* DESKTOP ICONS */}
        <button
          className={`${styles.desktopIcon} ${styles.home}`}
          type="button"
          onDoubleClick={() => openWindow("files")}
        >
          <span className={styles.homeIcon}>
            <House />
          </span>

          <small>Home</small>
        </button>

        <button
          className={`${styles.desktopIcon} ${styles.resume}`}
          type="button"
        >
          <span className={styles.resumeIcon}>
            <FileText />
          </span>

          <small>Resume</small>
        </button>

        <button
          className={`${styles.desktopIcon} ${styles.trash}`}
          type="button"
        >
          <span className={styles.trashIcon}>
            <Trash2 />
          </span>

          <small>Trash</small>
        </button>

        {/* WINDOWS */}
        {openWindows.map((id) => {
          const windowState = windows[id];

          if (windowState.minimized) {
            return null;
          }

          return (
            <section
              key={id}
              className={`${styles.window} ${
                windowState.maximized
                  ? styles.maximized
                  : ""
              }`}
              style={
                windowState.maximized
                  ? {
                      zIndex: windowState.zIndex,
                    }
                  : {
                      left: windowState.x,
                      top: windowState.y,
                      width: windowState.width,
                      height: windowState.height,
                      zIndex: windowState.zIndex,
                    }
              }
              onPointerDown={() => focusWindow(id)}
            >
              {/* WINDOW BAR */}
              <div
                className={styles.windowBar}
                onPointerDown={(event) =>
                  handleWindowDrag(event, id)
                }
              >
                <div className={styles.windowTitle}>
                  <span
                    className={
                      activeWindow === id
                        ? styles.activeWindowDot
                        : ""
                    }
                  />

                  {APP_NAMES[id]}
                </div>

                <div className={styles.windowControls}>
                  <button
                    type="button"
                    onPointerDown={(event) =>
                      event.stopPropagation()
                    }
                    onClick={() =>
                      minimizeWindow(id)
                    }
                    aria-label="Minimize"
                  >
                    <Minus />
                  </button>

                  <button
                    type="button"
                    onPointerDown={(event) =>
                      event.stopPropagation()
                    }
                    onClick={() =>
                      toggleMaximize(id)
                    }
                    aria-label="Maximize"
                  >
                    <Maximize2 />
                  </button>

                  <button
                    type="button"
                    onPointerDown={(event) =>
                      event.stopPropagation()
                    }
                    onClick={() =>
                      closeWindow(id)
                    }
                    aria-label="Close"
                  >
                    <X />
                  </button>
                </div>
              </div>

              {/* CONTENT */}
              <div className={styles.windowBody}>
                {renderWindowContent(id)}
              </div>
            </section>
          );
        })}
      </section>

      {/* DOCK */}
      <nav className={styles.dock} aria-label="Application dock">
        <button
          type="button"
          onClick={() => openWindow("files")}
          aria-label="Projects"
        >
          <img src="/os/icons/file-manager.svg" alt="" />
        </button>

        <button
          type="button"
          onClick={() => openWindow("terminal")}
          aria-label="Terminal"
        >
          <img src="/os/icons/terminal.svg" alt="" />
        </button>

        <button
          type="button"
          onClick={() => openWindow("settings")}
          aria-label="About"
        >
          <img src="/os/icons/preferences-system.svg" alt="" />
        </button>

        <button
          type="button"
          onClick={() => openWindow("contact")}
          aria-label="Contact"
        >
          <img src="/icons/mail.svg" alt="" />
        </button>
      </nav>
    </main>
  );
}
