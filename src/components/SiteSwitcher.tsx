"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { withBasePath } from "@/lib/basePath";

const STORAGE_KEY = "active_site_v1";
const TOGGLE_KEY = "F2"; // desktop keyboard shortcut (also always available via the on-screen button)

type SiteId = "fuelwise" | "timecalc";

export function SiteSwitcher({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<SiteId>("fuelwise");
  const [mounted, setMounted] = useState(false);

  // Restore last-used site (per browser) once on load.
  useEffect(() => {
    setMounted(true);
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as SiteId | null;
      if (saved === "fuelwise" || saved === "timecalc") {
        setActive(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    setActive((prev) => {
      const next: SiteId = prev === "fuelwise" ? "timecalc" : "fuelwise";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Keyboard shortcut: F2 switches sites from anywhere, even while typing in a field.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === TOGGLE_KEY) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle]);

  return (
    <>
      {/* FuelWise (the main Next.js app) stays mounted; we just hide it so its
          React state is never lost when switching away. */}
      <div style={{ display: active === "fuelwise" ? "contents" : "none" }}>
        {children}
      </div>

      {/* TimeCalc runs inside a persistent iframe. Because the iframe is only
          hidden (not removed or reloaded), everything typed inside it stays
          exactly as it was when you switch back. */}
      <div
        style={{
          display: active === "timecalc" ? "block" : "none",
          position: "fixed",
          inset: 0,
          zIndex: 40,
        }}
      >
        <iframe
          src={withBasePath("/timecalc.html")}
          title="TimeCalc"
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </div>

      {mounted && (
        <button
          type="button"
          onClick={toggle}
          title={`Переключити сайт (F2) — зараз: ${
            active === "fuelwise" ? "FuelWise" : "TimeCalc"
          }`}
          aria-label="Переключити між FuelWise і TimeCalc"
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 50,
            width: 52,
            height: 52,
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1E3A8A",
            color: "#fff",
            boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 2l4 4-4 4" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="M7 22l-4-4 4-4" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        </button>
      )}

      {mounted && (
        <div
          style={{
            position: "fixed",
            bottom: 16,
            right: 76,
            zIndex: 50,
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            fontSize: 12,
            padding: "6px 10px",
            borderRadius: 8,
            pointerEvents: "none",
          }}
        >
          {active === "fuelwise" ? "FuelWise" : "TimeCalc"} · F2
        </div>
      )}
    </>
  );
}
