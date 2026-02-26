import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  BarChart3,
  Shield,
  Network,
  LogOut,
  Menu,
  X,
  Crown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  Send,
  User,
  Brain,
  BookOpen,
  Home,
  Users,
  ClipboardList,
  Sparkles,
  Newspaper,
  LockKeyhole,
  UserCircle,
  PlusCircle,
  Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface SidebarLayoutProps {
  children: React.ReactNode;
  headerActions?: ReactNode;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

interface RecentActivity {
  id: string;
  action: string;
  timestamp: string;
  icon: any;
  color: string;
}

const SidebarLayout = ({ children, headerActions }: SidebarLayoutProps) => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from('user_profiles')
        .select('profile_picture_url')
        .eq('id', user.id)
        .single();
      if (!error) setAvatarUrl(data?.profile_picture_url ?? null);
    };
    fetchAvatar();
  }, [user?.id]);


  const handleNavigation = (to: string) => {
    navigate(to);
    setSidebarOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["admin", "member", "viewer"],
      description: (userRole === "viewer" || !userRole) ? "Your overview and insights" : userRole === "member" ? "Your member dashboard and activity" : "Overview and analytics",
      badge: null,
      color: "blue"
    },
    {
      name: "Network",
      href: "/network",
      icon: Users,
      roles: ["admin", "member", "viewer"],
      description: (userRole === "viewer" || !userRole) ? "Browse approved fund managers" : "Fund manager directory",
      badge: null,
      color: "green"
    },
    {
      name: "Application",
      href: "/application",
      icon: ClipboardList,
      roles: ["viewer"],
      description: "Submit membership application",
      badge: null,
      color: "orange"
    },
    {
      name: "Community hub",
      href: "/community",
      icon: Newspaper,
      roles: ["admin", "member", "viewer"],
      description: "Network updates & learning resources",
      badge: null,
      color: "teal"
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      roles: ["admin"],
      description: "Data insights and reports",
      badge: null,
      color: "red"
    },
    {
      name: "Launch +",
      href: "/admin/launch-plus-analytics",
      icon: Rocket,
      roles: ["admin"],
      description: "LAUNCH+ assessment submissions",
      badge: null,
      color: "purple"
    },
    {
      name: "Admin Panel",
      href: "/admin",
      icon: LockKeyhole,
      roles: ["admin"],
      description: "User and system management",
      badge: null,
      color: "black"
    },
    {
      name: "My Profile",
      href: "/profile",
      icon: UserCircle,
      roles: ["admin", "member", "viewer"],
      description: "Manage your company information and profile",
      badge: null,
      color: "indigo"
    },
    {
      name: "Portiq",
      href: "/admin-chat",
      icon: Brain,
      roles: ["admin", "member"],
      description: "Personal AI chat assistant",
      badge: null,
      color: "purple"
    },
  ];


  const filteredNavItems = navigationItems.filter(item =>
    userRole ? item.roles.includes(userRole) : item.roles.includes('viewer')
  );

  // Helper function to get clean color classes
  const getSmoothColorClasses = (color: string, isActive: boolean = false) => {
    return {
      icon: isActive ? 'text-black' : 'text-[#f5f5dc]',
      iconBg: isActive ? 'bg-[#f5f5dc]' : 'bg-[#f5f5dc]/20',
      text: isActive ? 'text-[#f5f5dc] font-semibold' : 'text-[#f5f5dc]',
      bg: isActive ? 'bg-[#f5f5dc]/20' : 'bg-transparent',
      hover: 'hover:bg-[#f5f5dc]/10 hover:shadow-lg hover:scale-[1.02]',
      border: 'border-transparent',
      accent: 'bg-[#f5f5dc]'
    };
  };

  const isActive = (href: string) => {
    if (href === "/dashboard" && location.pathname === "/dashboard") return true;
    if (href === "/profile" && location.pathname === "/profile") return true;
    if (href === "/network" && location.pathname === "/network") return true;
    if (href === "/analytics" && location.pathname === "/analytics") return true;
    if (href === "/admin/launch-plus-analytics" && location.pathname === "/admin/launch-plus-analytics") return true;
    if (href === "/admin" && location.pathname === "/admin") return true;
    if (href === "/application" && location.pathname === "/application") return true;
    if (href === "/admin-chat" && location.pathname === "/admin-chat") return true;
    if (href === "/community" && (location.pathname === "/community" || location.pathname === "/blogs")) return true;
    return false;
  };


  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            navigate('/dashboard');
            break;
          case 's':
            e.preventDefault();
            navigate('/survey');
            break;
          case 'n':
            e.preventDefault();
            navigate('/network');
            break;
          case 'p':
            e.preventDefault();
            navigate('/admin');
            break;
          case 'b':
            e.preventDefault();
            setSidebarCollapsed(!sidebarCollapsed);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate, sidebarCollapsed]);

  return (
    <div className="min-h-screen transition-all duration-300 bg-slate-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "w-56",
          "bg-navy-900 shadow-2xl overflow-hidden font-sans border-r border-navy-800"
        )}
      >
        <div className="flex flex-col h-screen overflow-hidden">
          {/* CFF Logo at Top */}
          <div className="p-4 border-b border-navy-800">
            <img
              src="/CFF%20LOGO.png"
              alt="CFF Logo"
              className="h-12 w-auto object-contain mx-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-hidden min-h-0">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const isPortiq = item.name === "Portiq";

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    active
                      ? "bg-gold-500 text-navy-950"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  )}
                  title={item.name}
                >
                  {isPortiq ? (
                    <img
                      src="/robot.png"
                      alt="Portiq"
                      className="w-5 h-5 flex-shrink-0 object-contain"
                    />
                  ) : (
                    <Icon className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="font-medium text-sm">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Email and Profile Picture at Bottom */}
          <div className="p-4 border-t border-navy-800 space-y-3">
            {/* Email */}
            <div className="px-4">
              <p className="text-xs text-slate-400 mb-1">Email</p>
              <p className="text-sm text-white truncate">{user?.email}</p>
            </div>

            {/* Profile Picture */}
            <div className="flex items-center gap-3 px-4">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center text-navy-950 font-semibold text-sm flex-shrink-0">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-white capitalize">
                  {userRole || 'Viewer'}
                </p>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-slate-400 hover:text-red-400 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content - no top header bar; pages use their own section-label + title */}
      <div className="flex flex-col min-w-0 lg:ml-56">
        {/* Mobile only: menu button to open sidebar (no white bar) */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden fixed top-3 left-3 z-40 text-slate-600 bg-white/90 hover:bg-white shadow-sm border border-slate-200/80 rounded-md"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <main className="flex-1 min-h-0">
          {headerActions ? (
            <div className="flex justify-end items-center gap-2 px-4 py-2 lg:px-6">
              {headerActions}
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
