import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Home, Users, ClipboardList, Newspaper, UserCircle, Brain, ArrowRight, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY_PREFIX = 'cff_app_onboarding_done';

function storageKey(userId: string | undefined): string {
  return userId ? `${STORAGE_KEY_PREFIX}_${userId}` : STORAGE_KEY_PREFIX;
}

/** Detect if this user has already completed onboarding (no asking). */
export function getOnboardingDone(userId: string | undefined): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(storageKey(userId)) === 'true';
}

export function setOnboardingDone(userId: string | undefined): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(storageKey(userId), 'true');
}

export function resetOnboarding(userId: string | undefined): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(storageKey(userId));
}

type Role = 'viewer' | 'member' | 'admin' | null;

interface StepConfig {
  id: string;
  title: string;
  description: string;
  icon: typeof Home;
  roles: Role[];
}

const ALL_STEPS: StepConfig[] = [
  {
    id: 'welcome',
    title: 'Welcome to the Fund Manager Portal',
    description: 'A short guided tour will show you where to find key features and how to get the most out of the platform. You can skip at any time.',
    icon: Sparkles,
    roles: ['viewer', 'member', 'admin'],
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Your home base for surveys, quick actions, and updates. Start here to access the latest activities and tasks relevant to your role.',
    icon: Home,
    roles: ['viewer', 'member', 'admin'],
  },
  {
    id: 'network',
    title: 'Network',
    description: 'Browse fund managers and organizations, view profiles and survey responses, and connect with the community.',
    icon: Users,
    roles: ['viewer', 'member', 'admin'],
  },
  {
    id: 'application',
    title: 'Membership application',
    description: 'As a viewer, you can apply for full membership here. Submit your organization details and supporting documents when ready.',
    icon: ClipboardList,
    roles: ['viewer'],
  },
  {
    id: 'community',
    title: 'Community',
    description: 'Blogs, learning resources, and peer content. Stay informed and develop your practice with the network.',
    icon: Newspaper,
    roles: ['viewer', 'member', 'admin'],
  },
  {
    id: 'portiq',
    title: 'PortIQ',
    description: 'Members and admins can use PortIQ for quick answers and support. Find it in the sidebar when you need it.',
    icon: Brain,
    roles: ['member', 'admin'],
  },
  {
    id: 'profile',
    title: 'My Profile',
    description: 'Keep your profile, company details, and team information up to date. Manage settings and preferences here.',
    icon: UserCircle,
    roles: ['viewer', 'member', 'admin'],
  },
];

interface AppOnboardingTourProps {
  userRole: Role;
  userId: string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppOnboardingTour({ userRole, userId, open, onOpenChange }: AppOnboardingTourProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = ALL_STEPS.filter((s) => userRole && s.roles.includes(userRole));
  const currentStep = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  /** Mark onboarding complete and close. Ensures user never sees the tour again. */
  const completeAndClose = () => {
    setOnboardingDone(userId);
    onOpenChange(false);
  };

  const handleNext = () => {
    if (isLast) {
      completeAndClose();
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const handleSkip = () => {
    completeAndClose();
  };

  /** If dialog is closed by any means (e.g. overlay, escape), mark done so it never shows again. */
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) completeAndClose();
    onOpenChange(nextOpen);
  };

  useEffect(() => {
    if (!open) return;
    setStepIndex(0);
  }, [open]);

  if (!currentStep) return null;

  const Icon = currentStep.icon;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-lg rounded-xl border border-slate-200/90 bg-[#faf6f0] shadow-finance p-0 gap-0 overflow-hidden font-sans antialiased selection:bg-gold-500/20 selection:text-navy-900"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={() => handleSkip()}
        aria-describedby="onboarding-description"
      >
        {/* Top accent */}
        <div className="h-1 w-full bg-gold-500 shrink-0" aria-hidden />

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-white border border-slate-200/90 shadow-finance flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-gold-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600">
                  Quick tour
                </p>
                <DialogTitle className="text-base sm:text-lg font-display font-normal text-navy-900 mt-0.5">
                  {currentStep.title}
                </DialogTitle>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 h-8 w-8 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-slate-200/60"
              onClick={handleSkip}
              aria-label="Close tour"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <DialogDescription
            id="onboarding-description"
            className="text-sm text-slate-600 leading-relaxed pt-1 pb-4"
          >
            {currentStep.description}
          </DialogDescription>

          {/* Progress */}
          <div className="flex items-center gap-1.5 pb-4">
            <span className="text-[10px] text-slate-500 font-medium mr-2">
              {stepIndex + 1} of {steps.length}
            </span>
            {steps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-200',
                  i <= stepIndex ? 'flex-1 max-w-8 bg-gold-500' : 'w-1.5 bg-slate-200'
                )}
                aria-hidden
              />
            ))}
          </div>

          <DialogFooter className="flex-row justify-between gap-2 pt-2 border-t border-slate-200/80 sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              className="text-slate-500 hover:text-navy-900 hover:bg-slate-200/60 rounded-lg font-sans text-sm"
              onClick={handleSkip}
            >
              Skip tour
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              className="bg-navy-900 hover:bg-navy-800 text-white font-sans text-sm font-medium rounded-lg shadow-finance px-4"
            >
              {isLast ? 'Get started' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface AppOnboardingTriggerProps {
  userRole: Role;
  userId: string | undefined;
  children: React.ReactNode;
}

/** Show the tour once per user (viewer, member, or admin) if not already completed. */
export function AppOnboardingTrigger({ userRole, userId, children }: AppOnboardingTriggerProps) {
  const [showTour, setShowTour] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked || !userRole || !userId) return;
    const alreadyDone = getOnboardingDone(userId);
    if (!alreadyDone && (userRole === 'viewer' || userRole === 'member' || userRole === 'admin')) {
      setShowTour(true);
    }
    setChecked(true);
  }, [userRole, userId, checked]);

  return (
    <>
      {children}
      <AppOnboardingTour
        userRole={userRole}
        userId={userId}
        open={showTour}
        onOpenChange={setShowTour}
      />
    </>
  );
}
