import { Link } from "@tanstack/react-router";
import { Facebook, Globe, Instagram, Twitter, Youtube } from "lucide-react";
import { useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  useLiveVisitorCount,
  useTrackVisitor,
  useVisitorCount,
} from "../hooks/useQueries";

const socialLinks = [
  { Icon: Twitter, label: "Twitter" },
  { Icon: Instagram, label: "Instagram" },
  { Icon: Facebook, label: "Facebook" },
  { Icon: Youtube, label: "YouTube" },
];

const connectLinks = [
  "Newsletter",
  "Blog",
  "Affiliate Program",
  "Partner With Us",
  "Careers",
];

const legalLinks = [
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Privacy Policy", to: "/privacy" },
];

export default function Footer() {
  const { data: totalVisitors } = useVisitorCount();
  const { data: liveVisitors } = useLiveVisitorCount();
  const { mutate: trackVisitor } = useTrackVisitor();
  const { t } = useLanguage();

  useEffect(() => {
    trackVisitor();
  }, [trackVisitor]);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-saffron text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div>
            <h3 className="text-xl font-black uppercase tracking-widest mb-1">
              EarningBySurfing
            </h3>
            <p className="text-white font-bold italic tracking-widest text-sm mb-4">
              ❖ {t("One World One Future")} ❖
            </p>
            <p className="text-white/80 text-sm font-medium leading-relaxed mb-6 normal-case">
              Your premium destination for high-demand products and exclusive
              affiliate deals. Curated with precision for the modern consumer.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, label }) => (
                <span
                  key={label}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors cursor-pointer"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          {/* Legal / Info Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/80 hover:text-white text-sm transition-colors normal-case font-medium"
                    data-ocid="footer.link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <span className="text-white/80 hover:text-white text-sm transition-colors normal-case font-medium cursor-pointer">
                  FAQs
                </span>
              </li>
              <li>
                <span className="text-white/80 hover:text-white text-sm transition-colors normal-case font-medium cursor-pointer">
                  Return Policy
                </span>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4">
              Connect With Us
            </h4>
            <ul className="space-y-2">
              {connectLinks.map((link) => (
                <li key={link}>
                  <span className="text-white/80 hover:text-white text-sm transition-colors normal-case font-medium cursor-pointer">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4">
              Stay Updated
            </h4>
            <p className="text-white/70 text-sm normal-case mb-4">
              Join thousands of members earning through our platform.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 text-xs bg-white/20 text-white placeholder-white/60 outline-none rounded-l normal-case"
                data-ocid="footer.input"
              />
              <button
                type="button"
                className="bg-white text-saffron font-bold text-xs px-3 py-2 rounded-r uppercase tracking-wide hover:bg-white/90 transition-colors"
                data-ocid="footer.button"
              >
                JOIN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Legal nav strip */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-white/70 hover:text-white text-xs normal-case transition-colors"
                data-ocid="footer.link"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Globe className="h-4 w-4" />
            <span>
              TOTAL VISITORS:{" "}
              {totalVisitors !== undefined ? totalVisitors.toString() : "—"}
            </span>
            <span className="mx-2 opacity-50">|</span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-white animate-pulse" />
              LIVE NOW:{" "}
              {liveVisitors !== undefined ? liveVisitors.toString() : "—"}
            </span>
          </div>

          <p className="text-white/70 text-xs normal-case">
            &copy; {currentYear}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="underline hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>

          <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider opacity-80">
            <span>VISA</span>
            <span className="mx-1 opacity-40">|</span>
            <span>MASTERCARD</span>
            <span className="mx-1 opacity-40">|</span>
            <span>PAYPAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
