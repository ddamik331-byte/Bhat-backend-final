import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2 font-display text-2xl font-bold text-primary hover:text-accent transition-colors">
            <span className="text-2xl">⚡</span>
            <span>Bhat Clothess</span>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/">
            <a className="text-foreground/80 hover:text-primary transition-colors">Home</a>
          </Link>
          <Link href="/shop">
            <a className="text-foreground/80 hover:text-primary transition-colors">Shop</a>
          </Link>
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin">
                  <a className="text-foreground/80 hover:text-primary transition-colors">Admin</a>
                </Link>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-primary/20 bg-card/50 backdrop-blur">
          <div className="container py-4 space-y-4">
            <Link href="/">
              <a className="block text-foreground/80 hover:text-primary transition-colors">Home</a>
            </Link>
            <Link href="/shop">
              <a className="block text-foreground/80 hover:text-primary transition-colors">Shop</a>
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin">
                <a className="block text-foreground/80 hover:text-primary transition-colors">Admin</a>
              </Link>
            )}
            <div className="pt-4 border-t border-primary/20 space-y-2">
              {user ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => logout()}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => (window.location.href = getLoginUrl())}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
