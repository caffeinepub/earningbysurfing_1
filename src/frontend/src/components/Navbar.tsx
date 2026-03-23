import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _navigate = useNavigate();
  const { login, clear, identity, loginStatus } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const navLinks = [
    { label: "HOME", to: "/" },
    { label: "SHOP ALL", to: "/" },
    { label: "TRENDING", to: "/" },
    { label: "ABOUT", to: "/" },
  ];

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      {/* Top utility strip */}
      <div className="bg-saffron text-white text-center text-xs font-semibold tracking-widest py-1.5 uppercase">
        EarningBySurfing &mdash; Premium Products &amp; Exclusive Deals
      </div>

      {/* Main nav row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <Link to="/" className="flex-shrink-0" data-ocid="nav.link">
            <span className="text-lg font-black uppercase tracking-widest text-saffron">
              EarningBySurfing
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-xs font-semibold uppercase tracking-widest text-foreground hover:text-saffron transition-colors"
                data-ocid="nav.link"
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn && (
              <Link
                to="/dashboard"
                className="text-xs font-semibold uppercase tracking-widest text-foreground hover:text-saffron transition-colors"
                data-ocid="nav.link"
              >
                DASHBOARD
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-xs font-semibold uppercase tracking-widest text-foreground hover:text-saffron transition-colors"
                data-ocid="nav.link"
              >
                ADMIN
              </Link>
            )}
          </nav>

          {/* Right side: search + icons + login */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center border border-border rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Search products..."
                className="px-3 py-1.5 text-xs outline-none bg-transparent w-36"
                data-ocid="search.input"
              />
              <button
                type="button"
                className="bg-saffron px-3 py-1.5 text-white"
                data-ocid="search.button"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              type="button"
              className="p-2 text-foreground hover:text-saffron transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="p-2 text-foreground hover:text-saffron transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                className="border-saffron text-saffron hover:bg-saffron hover:text-white text-xs uppercase tracking-wider font-bold"
                onClick={() => clear()}
                data-ocid="nav.button"
              >
                LOGOUT
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-saffron hover:bg-saffron-dark text-white text-xs uppercase tracking-wider font-bold"
                onClick={() => login()}
                disabled={isLoggingIn}
                data-ocid="nav.button"
              >
                {isLoggingIn ? "LOGGING IN..." : "LOGIN"}
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
              key={link.label}
              to={link.to}
              className="text-sm font-semibold uppercase tracking-widest text-foreground hover:text-saffron transition-colors py-2"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && (
            <Link
              to="/dashboard"
              className="text-sm font-semibold uppercase tracking-widest text-saffron py-2"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.link"
            >
              DASHBOARD
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-semibold uppercase tracking-widest text-saffron py-2"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.link"
            >
              ADMIN
            </Link>
          )}
          <div className="pt-2 border-t border-border">
            {isLoggedIn ? (
              <Button
                variant="outline"
                className="w-full border-saffron text-saffron font-bold uppercase tracking-wider"
                onClick={() => {
                  clear();
                  setMenuOpen(false);
                }}
                data-ocid="nav.button"
              >
                LOGOUT
              </Button>
            ) : (
              <Button
                className="w-full bg-saffron text-white font-bold uppercase tracking-wider"
                onClick={() => {
                  login();
                  setMenuOpen(false);
                }}
                data-ocid="nav.button"
              >
                LOGIN
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
