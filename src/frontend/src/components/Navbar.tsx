import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Globe, Heart, Menu, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ACTIVE_LANGUAGES, useLanguage } from "../contexts/LanguageContext";
import { useMemberAuth } from "../hooks/useMemberAuth";
import MemberLoginModal from "./MemberLoginModal";

function LanguageDropdown({ mobile = false }: { mobile?: boolean }) {
  const { language, setLanguage, currentOption } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const filtered = ACTIVE_LANGUAGES.filter(
    (l) =>
      l.englishLabel.toLowerCase().includes(search.toLowerCase()) ||
      l.label.toLowerCase().includes(search.toLowerCase()) ||
      l.shortLabel.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className={`flex items-center gap-1.5 border border-[#FF9933] rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF9933] hover:bg-[#FF9933] hover:text-white transition-colors ${
          mobile ? "w-full justify-center" : ""
        }`}
        onClick={() => {
          setOpen((v) => !v);
          setSearch("");
        }}
        data-ocid="nav.toggle"
      >
        <Globe className="h-3.5 w-3.5" />
        {currentOption?.shortLabel ?? "EN"}
      </button>

      {open && (
        <div
          className={`absolute ${
            mobile ? "left-0 right-0" : "right-0"
          } mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden`}
          style={{ width: mobile ? "100%" : "220px" }}
        >
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5">
              <Search className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search language..."
                className="bg-transparent text-xs outline-none w-full text-gray-700 placeholder-gray-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <div className="px-3 py-1 bg-[#FF9933]/5 border-b border-gray-100">
            <span className="text-[10px] text-[#FF9933] font-semibold uppercase tracking-wider">
              {filtered.length} language{filtered.length !== 1 ? "s" : ""}{" "}
              available
            </span>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: "260px" }}>
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-xs text-gray-400 text-center">
                No language found
              </div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  className={`w-full text-left px-3 py-2 transition-colors flex items-center justify-between gap-2 ${
                    language === opt.code
                      ? "bg-[#FF9933]/10 text-[#FF9933]"
                      : "text-gray-700 hover:bg-[#FF9933]/5 hover:text-[#FF9933]"
                  }`}
                  onClick={() => {
                    setLanguage(opt.code);
                    setOpen(false);
                    setSearch("");
                  }}
                  data-ocid="nav.toggle"
                >
                  <span className="text-xs font-semibold">{opt.label}</span>
                  <span className="text-[10px] text-gray-400 font-mono flex-shrink-0">
                    {opt.shortLabel}
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="px-3 py-1.5 border-t border-gray-100 bg-red-50">
            <span className="text-[9px] text-red-400 font-medium">
              &#9940; Pakistan traffic restricted
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function useAdminAuth() {
  const [isAdminAuthed, setIsAdminAuthed] = useState(() => {
    return localStorage.getItem("ebs_admin_auth") === "true";
  });

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "ebs_admin_auth") {
        setIsAdminAuthed(e.newValue === "true");
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    function onFocus() {
      setIsAdminAuthed(localStorage.getItem("ebs_admin_auth") === "true");
    }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return isAdminAuthed;
}

/** 3-D tilt + gloss-shine logo */
function Logo3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    const rotX = -y * 12;
    const rotY = x * 12;

    el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04,1.04,1.04)`;

    if (shineRef.current) {
      const px = ((x + 1) / 2) * 100;
      const py = ((y + 1) / 2) * 100;
      shineRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.55) 0%, rgba(255,220,100,0.18) 35%, transparent 65%)`;
      shineRef.current.style.opacity = "1";
    }
  }

  function handleMouseLeave() {
    const el = containerRef.current;
    if (el) {
      el.style.transform =
        "perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    }
    if (shineRef.current) {
      shineRef.current.style.opacity = "0";
    }
    setHovered(false);
  }

  return (
    <div
      style={{
        flexShrink: 0,
        width: "200px",
        height: "80px",
        padding: 0,
        perspective: "600px",
        perspectiveOrigin: "center center",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          cursor: "pointer",
          transition: hovered
            ? "none"
            : "transform 0.5s cubic-bezier(.23,1,.32,1)",
          transformStyle: "preserve-3d",
          willChange: "transform",
          borderRadius: "10px",
          filter:
            "drop-shadow(0 6px 14px rgba(255,153,51,0.4)) drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
        }}
      >
        <img
          src="/assets/uploads/ebs_logo-019d1d9c-c55a-7198-bb68-22a6ae85a1fc-1.png"
          alt="EarningBySurfing — One World One Future"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            imageRendering: "auto",
            borderRadius: "10px",
            mixBlendMode: "multiply",
          }}
        />

        <div
          ref={shineRef}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "10px",
            opacity: 0,
            transition: "opacity 0.1s ease",
            pointerEvents: "none",
            mixBlendMode: "screen",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "5%",
            right: "5%",
            height: "6px",
            borderRadius: "0 0 10px 10px",
            background:
              "linear-gradient(to right, transparent, rgba(255,153,51,0.5), rgba(255,215,0,0.4), transparent)",
            filter: "blur(3px)",
            transform: "translateZ(-2px)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _navigate = useNavigate();
  const { member, loginMember, logoutMember } = useMemberAuth();
  const isAdminAuthed = useAdminAuth();
  const { t } = useLanguage();

  const navLinks = [
    { labelKey: "HOME", to: "/" },
    { labelKey: "SHOP ALL", to: "/" },
    { labelKey: "TRENDING", to: "/" },
    { labelKey: "ABOUT", to: "/about" },
  ];

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      {/* Top utility strip */}
      <div
        className="bg-[#FF9933] text-white text-center py-1.5"
        style={{ letterSpacing: "0.15em" }}
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
          &#10054; One World One Future &#10054;
        </span>
      </div>

      {/* Main nav row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-24 gap-2">
          {/* FAR LEFT: Logo only */}
          <div className="hidden md:flex items-center flex-shrink-0">
            <Link
              to="/"
              style={{ textDecoration: "none" }}
              data-ocid="nav.link"
            >
              <Logo3D />
            </Link>
          </div>

          {/* CENTER-LEFT: Navigation Links */}
          <nav className="hidden md:flex items-center gap-3 flex-shrink-0 ml-3">
            {navLinks.map((link) => (
              <Link
                key={link.labelKey}
                to={link.to}
                className="text-xs font-semibold uppercase tracking-widest text-foreground hover:text-[#FF9933] transition-colors whitespace-nowrap"
                data-ocid="nav.link"
              >
                {t(link.labelKey)}
              </Link>
            ))}
            <Link
              to="/vendor"
              className="text-xs font-bold uppercase tracking-widest bg-[#FF9933] text-white px-3 py-1.5 rounded-full hover:bg-orange-600 transition-colors whitespace-nowrap"
              data-ocid="nav.link"
            >
              VENDOR
            </Link>
            {member && (
              <Link
                to="/dashboard"
                className="text-xs font-semibold uppercase tracking-widest text-foreground hover:text-[#FF9933] transition-colors whitespace-nowrap"
                data-ocid="nav.link"
              >
                {t("DASHBOARD")}
              </Link>
            )}
            {isAdminAuthed && (
              <Link
                to="/admin"
                className="text-xs font-bold uppercase tracking-widest text-[#FF9933] hover:text-orange-600 transition-colors whitespace-nowrap border border-[#FF9933] px-2 py-1 rounded"
                data-ocid="nav.link"
              >
                ADMIN
              </Link>
            )}
          </nav>

          {/* SPACER */}
          <div className="flex-1" />

          {/* FAR RIGHT: Language + Search + Icons + Login */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <LanguageDropdown />
            <div className="flex items-center border border-border rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-1.5 text-xs outline-none bg-transparent w-20"
                data-ocid="search.input"
              />
              <button
                type="button"
                className="bg-[#FF9933] px-3 py-1.5 text-white"
                data-ocid="search.button"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              type="button"
              className="p-2 text-foreground hover:text-[#FF9933] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="p-2 text-foreground hover:text-[#FF9933] transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
            {member ? (
              <Button
                variant="outline"
                size="sm"
                className="border-[#FF9933] text-[#FF9933] hover:bg-[#FF9933] hover:text-white text-xs uppercase tracking-wider font-bold"
                onClick={() => logoutMember()}
                data-ocid="nav.button"
              >
                {t("LOGOUT")}
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-[#FF9933] hover:bg-orange-600 text-white text-xs uppercase tracking-wider font-bold"
                onClick={() => setLoginOpen(true)}
                data-ocid="nav.button"
              >
                {t("LOGIN")}
              </Button>
            )}
          </div>

          {/* Mobile: Logo left, hamburger right */}
          <div className="md:hidden flex items-center justify-between w-full">
            <Link
              to="/"
              style={{ textDecoration: "none" }}
              data-ocid="nav.link"
            >
              <Logo3D />
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-foreground"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                data-ocid="nav.toggle"
              >
                {menuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.labelKey}
              to={link.to}
              className="text-sm font-semibold uppercase tracking-widest text-foreground hover:text-[#FF9933] transition-colors py-2"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.link"
            >
              {t(link.labelKey)}
            </Link>
          ))}
          <Link
            to="/vendor"
            className="text-sm font-bold uppercase tracking-widest bg-[#FF9933] text-white px-4 py-2 rounded-full text-center"
            onClick={() => setMenuOpen(false)}
            data-ocid="nav.link"
          >
            VENDOR
          </Link>
          {member && (
            <Link
              to="/dashboard"
              className="text-sm font-semibold uppercase tracking-widest text-[#FF9933] py-2"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.link"
            >
              {t("DASHBOARD")}
            </Link>
          )}
          {isAdminAuthed && (
            <Link
              to="/admin"
              className="text-sm font-semibold uppercase tracking-widest text-[#FF9933] py-2 border border-[#FF9933] px-3 rounded text-center"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.link"
            >
              ADMIN
            </Link>
          )}
          <div className="pt-2 border-t border-border">
            <LanguageDropdown mobile />
          </div>
          <div className="pt-2 border-t border-border">
            {member ? (
              <Button
                variant="outline"
                className="w-full border-[#FF9933] text-[#FF9933] font-bold uppercase tracking-wider"
                onClick={() => {
                  logoutMember();
                  setMenuOpen(false);
                }}
                data-ocid="nav.button"
              >
                {t("LOGOUT")}
              </Button>
            ) : (
              <Button
                className="w-full bg-[#FF9933] text-white font-bold uppercase tracking-wider"
                onClick={() => {
                  setLoginOpen(true);
                  setMenuOpen(false);
                }}
                data-ocid="nav.button"
              >
                {t("LOGIN")}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Member Login Modal */}
      <MemberLoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onLogin={(m) => {
          loginMember(m);
          setLoginOpen(false);
        }}
      />
    </header>
  );
}
