import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Globe, Heart, Menu, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ACTIVE_LANGUAGES, useLanguage } from "../contexts/LanguageContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

function LanguageDropdown({ mobile = false }: { mobile?: boolean }) {
  const { language, setLanguage, currentOption } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
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
          {/* Search input */}
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

          {/* Header count */}
          <div className="px-3 py-1 bg-[#FF9933]/5 border-b border-gray-100">
            <span className="text-[10px] text-[#FF9933] font-semibold uppercase tracking-wider">
              {filtered.length} language{filtered.length !== 1 ? "s" : ""}{" "}
              available
            </span>
          </div>

          {/* Language list */}
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

          {/* Pakistan blocked notice */}
          <div className="px-3 py-1.5 border-t border-gray-100 bg-red-50">
            <span className="text-[9px] text-red-400 font-medium">
              ⛔ Pakistan traffic restricted
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _navigate = useNavigate();
  const { login, clear, identity, loginStatus } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const { t } = useLanguage();

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const navLinks = [
    { labelKey: "HOME", to: "/" },
    { labelKey: "SHOP ALL", to: "/" },
    { labelKey: "TRENDING", to: "/" },
    { labelKey: "ABOUT", to: "/about" },
  ];

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      {/* Top utility strip */}
      <div className="bg-[#FF9933] text-white text-center text-xs font-semibold tracking-widest py-1.5 uppercase">
        EarningBySurfing &mdash; Premium Products &amp; Exclusive Deals
        <span className="mx-3 opacity-60">|</span>
        <span className="italic font-bold tracking-[0.2em] text-white/95">
          ❆ {t("One World One Future")} ❆
        </span>
      </div>

      {/* Main nav row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex-shrink-0" data-ocid="nav.link">
            <img
              src="/assets/generated/earning-by-surfing-logo-transparent.dim_1200x600.png"
              alt="EarningBySurfing"
              className="h-10 w-auto max-w-[200px] object-contain"
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.labelKey}
                to={link.to}
                className="text-xs font-semibold uppercase tracking-widest text-foreground hover:text-[#FF9933] transition-colors"
                data-ocid="nav.link"
              >
                {t(link.labelKey)}
              </Link>
            ))}
            <Link
              to="/vendor"
              className="text-xs font-bold uppercase tracking-widest bg-saffron text-white px-4 py-1.5 rounded-full hover:bg-saffron-dark transition-colors"
              data-ocid="nav.link"
            >
              Become a Vendor
            </Link>
            {isLoggedIn && (
              <Link
                to="/dashboard"
                className="text-xs font-semibold uppercase tracking-widest text-foreground hover:text-[#FF9933] transition-colors"
                data-ocid="nav.link"
              >
                {t("DASHBOARD")}
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-xs font-semibold uppercase tracking-widest text-foreground hover:text-[#FF9933] transition-colors"
                data-ocid="nav.link"
              >
                {t("ADMIN")}
              </Link>
            )}
          </nav>

          {/* Right side: language + search + icons + login */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageDropdown />
            <div className="flex items-center border border-border rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Search products..."
                className="px-3 py-1.5 text-xs outline-none bg-transparent w-36"
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
            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                className="border-[#FF9933] text-[#FF9933] hover:bg-[#FF9933] hover:text-white text-xs uppercase tracking-wider font-bold"
                onClick={() => clear()}
                data-ocid="nav.button"
              >
                {t("LOGOUT")}
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-[#FF9933] hover:bg-orange-600 text-white text-xs uppercase tracking-wider font-bold"
                onClick={() => login()}
                disabled={isLoggingIn}
                data-ocid="nav.button"
              >
                {isLoggingIn ? "LOGGING IN..." : t("LOGIN")}
              </Button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground"
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
            className="text-sm font-bold uppercase tracking-widest bg-saffron text-white px-4 py-2 rounded-full text-center"
            onClick={() => setMenuOpen(false)}
            data-ocid="nav.link"
          >
            Become a Vendor
          </Link>
          {isLoggedIn && (
            <Link
              to="/dashboard"
              className="text-sm font-semibold uppercase tracking-widest text-[#FF9933] py-2"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.link"
            >
              {t("DASHBOARD")}
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-semibold uppercase tracking-widest text-[#FF9933] py-2"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.link"
            >
              {t("ADMIN")}
            </Link>
          )}
          <div className="pt-2 border-t border-border">
            <LanguageDropdown mobile />
          </div>
          <div className="pt-2 border-t border-border">
            {isLoggedIn ? (
              <Button
                variant="outline"
                className="w-full border-[#FF9933] text-[#FF9933] font-bold uppercase tracking-wider"
                onClick={() => {
                  clear();
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
                  login();
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
    </header>
  );
}
