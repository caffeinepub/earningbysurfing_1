import { motion } from "motion/react";

// Trending graph SVG — pure white, high-contrast upward line chart
function TrendingGraphIcon() {
  return (
    <svg
      width="72"
      height="48"
      viewBox="0 0 72 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Grid lines */}
      <line
        x1="0"
        y1="40"
        x2="72"
        y2="40"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
      />
      <line
        x1="0"
        y1="28"
        x2="72"
        y2="28"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
      />
      <line
        x1="0"
        y1="16"
        x2="72"
        y2="16"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
      />
      {/* Trend line — upward trajectory */}
      <polyline
        points="4,38 14,32 24,28 32,22 42,16 52,10 66,4"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Area fill under line */}
      <polygon
        points="4,38 14,32 24,28 32,22 42,16 52,10 66,4 66,40 4,40"
        fill="rgba(255,255,255,0.12)"
      />
      {/* Data point dots */}
      <circle cx="4" cy="38" r="2.5" fill="white" />
      <circle cx="14" cy="32" r="2.5" fill="white" />
      <circle cx="24" cy="28" r="2.5" fill="white" />
      <circle cx="32" cy="22" r="2.5" fill="white" />
      <circle cx="42" cy="16" r="2.5" fill="white" />
      <circle cx="52" cy="10" r="2.5" fill="white" />
      {/* Peak dot — highlighted */}
      <circle cx="66" cy="4" r="4" fill="white" />
      <circle cx="66" cy="4" r="2" fill="rgba(255,138,18,0.9)" />
    </svg>
  );
}

export default function AnkerProductCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      data-ocid="featured_product.card"
      style={{
        width: "320px",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow:
          "0 4px 6px rgba(0,0,0,0.07), 0 10px 30px rgba(0,0,0,0.13), 0 20px 60px rgba(255,138,18,0.18)",
        flexShrink: 0,
      }}
    >
      {/* ── TOP STRIP — hardcoded #FF8A12, NO filter, NO variable, NO opacity ── */}
      <div
        style={{
          backgroundColor: "#FF8A12",
          height: "180px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Top-left TECH label */}
        <span
          style={{
            position: "absolute",
            top: "14px",
            left: "16px",
            color: "#FFFFFF",
            fontSize: "11px",
            fontWeight: 900,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            lineHeight: 1,
          }}
        >
          TECH
        </span>

        {/* Top-right star score badge */}
        <div
          data-ocid="featured_product.toggle"
          style={{
            position: "absolute",
            top: "10px",
            right: "12px",
            backgroundColor: "#FFFFFF",
            borderRadius: "9999px",
            padding: "4px 10px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <span style={{ color: "#FF8A12", fontSize: "13px", lineHeight: 1 }}>
            ★
          </span>
          <span
            style={{
              color: "#1a1a1a",
              fontSize: "12px",
              fontWeight: 900,
              fontFamily: "sans-serif",
              lineHeight: 1,
            }}
          >
            92
          </span>
        </div>

        {/* Center trending graph icon */}
        <TrendingGraphIcon />
      </div>

      {/* ── BOTTOM SECTION — pure white ── */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "20px 20px 22px",
        }}
      >
        {/* Product title */}
        <h3
          style={{
            color: "#000000",
            fontSize: "15px",
            fontWeight: 900,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            lineHeight: 1.35,
            marginBottom: "10px",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          }}
        >
          ANKER 737 POWER BANK 24000MAH
        </h3>

        {/* Technical details */}
        <p
          style={{
            color: "#374151",
            fontSize: "11.5px",
            fontWeight: 500,
            lineHeight: 1.65,
            fontFamily: "sans-serif",
            marginBottom: "18px",
            WebkitFontSmoothing: "antialiased",
          }}
        >
          24,000mAh&nbsp;&nbsp;|&nbsp;&nbsp;140W Max Output
          <br />
          USB-C &times;2, USB-A &times;1&nbsp;&nbsp;|&nbsp;&nbsp;Fast Charge 3.0
        </p>

        {/* CTA button — hardcoded #FF8A12 */}
        <button
          type="button"
          data-ocid="featured_product.primary_button"
          style={{
            width: "100%",
            backgroundColor: "#FF8A12",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "7px",
            padding: "11px 0",
            fontSize: "12px",
            fontWeight: 900,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            cursor: "pointer",
            WebkitFontSmoothing: "antialiased",
            boxShadow: "0 3px 12px rgba(255,138,18,0.38)",
            transition: "box-shadow 0.18s ease, transform 0.15s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 5px 20px rgba(255,138,18,0.55)";
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 3px 12px rgba(255,138,18,0.38)";
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateY(0)";
          }}
        >
          VIEW DEAL
        </button>
      </div>
    </motion.div>
  );
}
