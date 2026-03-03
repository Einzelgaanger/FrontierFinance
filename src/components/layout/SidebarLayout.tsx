import { useState, useEffect, type ReactNode } from 'react';
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
  Rocket,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { AnimatePresence, motion } from 'framer-motion';

interface SidebarLayoutProps {
  children: React.ReactNode;
  headerActions?: ReactNode;
}

const SidebarLayout = ({ children, headerActions }: SidebarLayoutProps) => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile
  const [expanded, setExpanded] = useState(false); // desktop hover
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
      name: 'Launch +',
      href: '/admin/launch-plus-analytics',
      icon: Rocket,
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

  // Desktop sidebar
  const DesktopSidebar = () => (
    <motion.div
      className={cn(
        'hidden lg:flex flex-col fixed inset-y-0 left-0 z-50',
        'bg-navy-900 border-r border-navy-800 shadow-2xl',
        'overflow-hidden'
      )}
      animate={{ width: expanded ? 220 : 68 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-navy-800 px-3 shrink-0">
        <img
          src="/CFF%20LOGO.png"
          alt="CFF"
          className={cn(
            'object-contain transition-all duration-200',
            expanded ? 'h-10 w-auto' : 'h-8 w-8'
          )}
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
                'w-full flex items-center gap-3 rounded-xl transition-all duration-200 group',
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
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
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
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <p className="text-xs font-medium text-white capitalize">
                  {userRole || 'Viewer'}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[130px]">
                  {user?.email}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
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
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm whitespace-nowrap overflow-hidden"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );

  // Mobile sidebar
  const MobileSidebar = () => (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-72 lg:hidden',
              'bg-navy-900 shadow-2xl flex flex-col',
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
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <div className="min-h-screen min-h-[100dvh] bg-slate-100 overflow-x-hidden">
      <DesktopSidebar />
      <MobileSidebar />

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed z-40 text-slate-600 bg-white/95 hover:bg-white shadow-md border border-slate-200/80 rounded-xl min-h-[44px] min-w-[44px] p-0 touch-manipulation top-[max(0.75rem,env(safe-area-inset-top,0))] left-[max(0.75rem,env(safe-area-inset-left,0))]"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Main content - offset by collapsed sidebar width on desktop */}
      <div className="flex flex-col min-w-0 lg:ml-[68px]">
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
  );
};

export default SidebarLayout;
