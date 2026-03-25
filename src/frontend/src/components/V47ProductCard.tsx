import { Copy, ExternalLink, LogIn } from "lucide-react";
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

export interface V47ProductCardProps {
  name: string;
  price: number;
  category: string;
  affiliateLink: string;
  onSmartLink?: () => void;
  isLoggedIn: boolean;
  index?: number;
  ocidIndex?: number;
}

export default function V47ProductCard({
  name,
  price,
  category,
  affiliateLink,
  onSmartLink,
  isLoggedIn,
  index = 0,
  ocidIndex = 1,
}: V47ProductCardProps) {
  const score = (index % 15) + 85;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
        delay: Math.min(index * 0.04, 0.3),
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      data-ocid={`shop.item.${ocidIndex}`}
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow:
          "0 4px 6px rgba(0,0,0,0.07), 0 10px 30px rgba(0,0,0,0.13), 0 20px 60px rgba(255,138,18,0.18)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── TOP STRIP — hardcoded #FF8A12 inline, color-locked ── */}
      <div
        style={{
          backgroundColor: "#FF8A12",
          height: "160px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {/* Top-left category label */}
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
          {category.toUpperCase()}
        </span>

        {/* Top-right star score badge */}
        <div
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
            {score}
          </span>
        </div>

        {/* Center trending graph icon */}
        <TrendingGraphIcon />
      </div>

      {/* ── BOTTOM SECTION — pure white ── */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "18px 18px 20px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Product name */}
        <h3
          style={{
            color: "#000000",
            fontSize: "14px",
            fontWeight: 900,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            lineHeight: 1.35,
            marginBottom: "8px",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          }}
        >
          {name.toUpperCase()}
        </h3>

        {/* Price */}
        <p
          style={{
            color: "#FF8A12",
            fontSize: "20px",
            fontWeight: 900,
            fontFamily: "sans-serif",
            marginBottom: "14px",
            lineHeight: 1,
          }}
        >
          ${price.toFixed(2)}
        </p>

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "auto",
          }}
        >
          {/* View Product */}
          <a
            href={affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="shop.button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              width: "100%",
              backgroundColor: "transparent",
              color: "#FF8A12",
              border: "1.5px solid #FF8A12",
              borderRadius: "7px",
              padding: "9px 0",
              fontSize: "11px",
              fontWeight: 900,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
              cursor: "pointer",
              textDecoration: "none",
              transition: "background-color 0.18s ease, color 0.18s ease",
              WebkitFontSmoothing: "antialiased",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                "#FF8A12";
              (e.currentTarget as HTMLAnchorElement).style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color = "#FF8A12";
            }}
          >
            <ExternalLink size={12} /> VIEW PRODUCT
          </a>

          {/* Smart Link / Login */}
          {isLoggedIn ? (
            <button
              type="button"
              data-ocid="shop.primary_button"
              onClick={onSmartLink}
              style={{
                width: "100%",
                backgroundColor: "#FF8A12",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "7px",
                padding: "9px 0",
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontFamily: "sans-serif",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
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
              <Copy size={12} /> GENERATE SMART LINK
            </button>
          ) : (
            <button
              type="button"
              data-ocid="shop.secondary_button"
              style={{
                width: "100%",
                backgroundColor: "transparent",
                color: "#FF8A12",
                border: "1.5px solid #FF8A12",
                borderRadius: "7px",
                padding: "9px 0",
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontFamily: "sans-serif",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                WebkitFontSmoothing: "antialiased",
                transition: "background-color 0.18s ease, color 0.18s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#FF8A12";
                (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#FF8A12";
              }}
            >
              <LogIn size={12} /> LOGIN TO GENERATE
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
