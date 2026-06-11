import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { LayoutDashboard, Package, Tag, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [location] = useLocation();

  // Redirect non-admins
  if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-foreground/70 mb-6">You do not have permission to access the admin panel.</p>
          <Button onClick={() => window.location.href = "/"}>Go Home</Button>
        </div>
      </div>
    );
  }

  const isActive = (path: string) => location === path;

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/products", label: "Products", icon: Package },
    { path: "/admin/categories", label: "Categories", icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-card border-r border-primary/20 transition-all duration-300 z-40 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-primary/20 flex items-center justify-between">
          <button
            onClick={() => window.location.href = "/admin"}
            className={`flex items-center gap-2 font-display font-bold text-primary hover:text-primary/80 transition-colors ${!sidebarOpen && "justify-center w-full"}`}
          >
            <span className="text-2xl">⚡</span>
            {sidebarOpen && <span className="text-sm">Bhat Clothes</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => window.location.href = item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-primary/10"
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Top Bar */}
        <div className="sticky top-0 z-30 border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-foreground/60">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
