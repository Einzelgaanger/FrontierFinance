import { useState, useEffect, useRef, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Network,
  LogOut,
  Menu,
  X,
  Home,
  Users,
  ClipboardList,
  Newspaper,
  LockKeyhole,
  UserCircle,
  Brain,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { AppOnboardingTrigger } from '@/components/onboarding/AppOnboardingTour';

interface SidebarLayoutProps {
  children: React.ReactNode;
  headerActions?: ReactNode;
}

const SidebarLayout = ({ children, headerActions }: SidebarLayoutProps) => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const savedScrollY = useRef(0);
  const scrollLockStyleId = 'mobile-menu-scroll-lock';
  const [coverStripVisible, setCoverStripVisible] = useState(false);

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

  // Remove body lock and restore scroll when mobile menu closes (delay so no scrollbar flash)
  useEffect(() => {
    if (!sidebarOpen) return;
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    if (!isMobile) return;
    return () => {
      const y = savedScrollY.current;
      document.getElementById(scrollLockStyleId)?.remove();
      document.documentElement.classList.remove('mobile-menu-open');
      document.body.classList.remove('mobile-menu-open');
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
        requestAnimationFrame(() => window.scrollTo(0, y));
      });
      setTimeout(() => setCoverStripVisible(false), 120);
    };
  }, [sidebarOpen]);

  const handleNavigation = (to: string) => {
    window.scrollTo(0, 0);
    navigate(to);
    setSidebarOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      roles: ['admin', 'member', 'viewer'],
    },
    {
      name: 'Network',
      href: '/network',
      icon: Users,
      roles: ['admin', 'member', 'viewer'],
    },
    {
      name: 'Application',
      href: '/application',
      icon: ClipboardList,
      roles: ['viewer'],
    },
    {
      name: 'Community Hub',
      href: '/community',
      icon: Newspaper,
      roles: ['admin', 'member', 'viewer'],
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      roles: ['admin'],
    },
    {
      name: 'Admin Panel',
      href: '/admin',
      icon: LockKeyhole,
      roles: ['admin'],
    },
    {
      name: 'My Profile',
      href: '/profile',
      icon: UserCircle,
      roles: ['admin', 'member', 'viewer'],
    },
    {
      name: 'Portiq',
      href: '/admin-chat',
      icon: Brain,
      roles: ['admin', 'member'],
    },
  ];

  const filteredNavItems = navigationItems.filter((item) =>
    userRole ? item.roles.includes(userRole) : item.roles.includes('viewer')
  );

  const isActive = (href: string) => {
    if (href === '/community') return location.pathname === '/community' || location.pathname === '/blogs';
    return location.pathname === href;
  };

  // Desktop sidebar — always fully open, no collapse
  const DesktopSidebar = () => (
    <div
      className={cn(
        'hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 w-[220px]',
        'bg-navy-900 border-r border-navy-800 shadow-2xl',
        'overflow-hidden'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-navy-800 px-3 shrink-0">
        <img
          src="/CFF%20LOGO.png"
          alt="CFF"
          className="object-contain h-10 w-auto"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const isPortiq = item.name === 'Portiq';

          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl transition-all duration-200',
                'min-h-[44px] px-3',
                active
                  ? 'bg-gold-500 text-navy-950 shadow-md shadow-gold-500/20'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              )}
              title={item.name}
            >
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                {isPortiq ? (
                  <img
                    src="/robot.png"
                    alt="Portiq"
                    className="w-5 h-5 object-contain"
                  />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span className="text-sm font-medium whitespace-nowrap truncate">
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom user section */}
      <div className="border-t border-navy-800 p-2 shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-8 h-8 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center text-navy-950 font-bold text-xs shrink-0">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className="min-w-0 overflow-hidden">
            <p className="text-xs font-medium text-white capitalize">
              {userRole || 'Viewer'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className={cn(
            'w-full flex items-center gap-3 rounded-xl transition-all duration-200',
            'min-h-[40px] px-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400'
          )}
          title="Sign Out"
        >
          <div className="w-7 h-7 flex items-center justify-center shrink-0">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="text-sm whitespace-nowrap">Sign Out</span>
        </button>
      </div>
    </div>
  );

  // Mobile sidebar — static show/hide, no animations
  const MobileSidebar = () => (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}
      {/* Cover right edge so OS scrollbar never shows; keep briefly after close to avoid flash */}
      {(sidebarOpen || coverStripVisible) && (
        <div
          className={cn(
            'fixed right-0 top-0 bottom-0 w-10 z-[41] lg:hidden pointer-events-none',
            sidebarOpen ? 'bg-black/60' : 'bg-slate-100'
          )}
          aria-hidden
        />
      )}

      {sidebarOpen && (
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-72 lg:hidden overflow-hidden flex flex-col',
            'bg-navy-900 shadow-2xl',
            'pl-[env(safe-area-inset-left,0)]'
          )}
        >
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-navy-800 pt-[env(safe-area-inset-top,0)] shrink-0">
              <img
                src="/CFF%20LOGO.png"
                alt="CFF"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const isPortiq = item.name === 'Portiq';

                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-xl transition-all duration-200',
                      'min-h-[48px] px-4 text-left',
                      active
                        ? 'bg-gold-500 text-navy-950 shadow-md'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    {isPortiq ? (
                      <img
                        src="/robot.png"
                        alt="Portiq"
                        className="w-5 h-5 object-contain shrink-0"
                      />
                    ) : (
                      <Icon className="w-5 h-5 shrink-0" />
                    )}
                    <span className="text-sm font-medium">{item.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Bottom */}
            <div className="border-t border-navy-800 p-4 pb-[max(1rem,env(safe-area-inset-bottom,0))] space-y-3 shrink-0">
              <div className="flex items-center gap-3 px-2">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center text-navy-950 font-bold text-sm shrink-0">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white capitalize">
                    {userRole || 'Viewer'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 rounded-xl min-h-[44px] px-4 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
        </div>
      )}
    </>
  );

  return (
    <AppOnboardingTrigger userRole={userRole as 'viewer' | 'member' | 'admin' | null} userId={user?.id}>
    <div
      className={cn(
        'min-h-screen min-h-[100dvh] bg-slate-100 overflow-x-hidden',
        sidebarOpen && 'max-lg:overflow-y-hidden max-lg:overscroll-none'
      )}
      data-layout="sidebar-layout"
    >
      <DesktopSidebar />
      <MobileSidebar />

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed z-40 text-slate-600 bg-white/95 hover:bg-white shadow-md border border-slate-200/80 rounded-xl min-h-[44px] min-w-[44px] p-0 touch-manipulation top-[max(0.75rem,env(safe-area-inset-top,0))] left-[max(0.75rem,env(safe-area-inset-left,0))]"
        onClick={() => {
          const isMobile = window.matchMedia('(max-width: 1023px)').matches;
          if (isMobile) {
            savedScrollY.current = window.scrollY;
            document.documentElement.classList.add('mobile-menu-open');
            document.body.classList.add('mobile-menu-open');
            document.body.style.top = `-${savedScrollY.current}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';
            let el = document.getElementById(scrollLockStyleId);
            if (!el) {
              el = document.createElement('style');
              el.id = scrollLockStyleId;
              el.textContent = `html.mobile-menu-open,body.mobile-menu-open{overflow:hidden!important;scrollbar-width:none!important;-ms-overflow-style:none!important}html.mobile-menu-open::-webkit-scrollbar,body.mobile-menu-open::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}`;
              document.head.appendChild(el);
            }
          }
          flushSync(() => {
            setSidebarOpen(true);
            setCoverStripVisible(true);
          });
        }}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Main content - offset by sidebar width on desktop */}
      <div className="flex flex-col min-w-0 lg:ml-[220px]">
        <main className="flex-1 min-h-0 pt-14 sm:pt-16 lg:pt-0 px-3 sm:px-4 lg:px-0 pb-[env(safe-area-inset-bottom,0)]">
          {headerActions && (
            <div className="flex justify-end items-center gap-2 px-4 py-2 lg:px-6">
              {headerActions}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
    </AppOnboardingTrigger>
  );
};

export default SidebarLayout;
