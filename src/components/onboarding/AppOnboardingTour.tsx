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
import { Home, Users, ClipboardList, Newspaper, UserCircle, Brain, ArrowRight, Sparkles } from 'lucide-react';
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
    title: 'Welcome to Frontier Finance',
    description: "You're in the platform. This short tour will show you where everything lives and what you can do.",
    icon: Sparkles,
    roles: ['viewer', 'member', 'admin'],
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Your home base. Here you’ll see surveys, quick actions, and updates. Use it to jump to the latest surveys or key tasks.',
    icon: Home,
    roles: ['viewer', 'member', 'admin'],
  },
  {
    id: 'network',
    title: 'Network',
    description: 'Explore fund managers and organizations in the network. View profiles, survey responses, and connect with the community.',
    icon: Users,
    roles: ['viewer', 'member', 'admin'],
  },
  {
    id: 'application',
    title: 'Application',
    description: 'As a viewer, you can apply to become a full member here. Submit your organization details and supporting documents when you’re ready.',
    icon: ClipboardList,
    roles: ['viewer'],
  },
  {
    id: 'community',
    title: 'Community Hub',
    description: 'Access blogs, learning resources, and community content. Stay updated and learn from peers.',
    icon: Newspaper,
    roles: ['viewer', 'member', 'admin'],
  },
  {
    id: 'portiq',
    title: 'Portiq (AI assistant)',
    description: 'Members and admins can use Portiq for quick answers and help. Find it in the sidebar when you need it.',
    icon: Brain,
    roles: ['member', 'admin'],
  },
  {
    id: 'profile',
    title: 'My Profile',
    description: 'Update your profile, manage team members, and change settings. Keep your info and company details up to date.',
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

  const handleNext = () => {
    if (isLast) {
      setOnboardingDone(userId);
      onOpenChange(false);
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const handleSkip = () => {
    setOnboardingDone(userId);
    onOpenChange(false);
  };

  if (!currentStep) return null;

  const Icon = currentStep.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md rounded-2xl border-navy-700/50 bg-white dark:bg-navy-900 shadow-xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          handleSkip();
        }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gold-500/20 dark:bg-gold-500/30 flex items-center justify-center">
              <Icon className="w-6 h-6 text-gold-600 dark:text-gold-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-display font-semibold text-slate-900 dark:text-white">
                {currentStep.title}
              </DialogTitle>
              <p className="text-xs text-slate-500 dark:text-navy-400 mt-0.5">
                Step {stepIndex + 1} of {steps.length}
              </p>
            </div>
          </div>
          <DialogDescription className="text-left text-sm text-slate-600 dark:text-navy-300 leading-relaxed pt-2">
            {currentStep.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-1.5 justify-center py-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all duration-200',
                i <= stepIndex ? 'w-6 bg-gold-500' : 'w-1.5 bg-slate-200 dark:bg-navy-600'
              )}
            />
          ))}
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between gap-2 pt-4">
          <Button
            type="button"
            variant="ghost"
            className="text-slate-500 hover:text-slate-700 dark:text-navy-400 dark:hover:text-white"
            onClick={handleSkip}
          >
            Skip tour
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold rounded-xl"
          >
            {isLast ? 'Get started' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface AppOnboardingTriggerProps {
  userRole: Role;
  userId: string | undefined;
  children: React.ReactNode;
}

/** Detect first-time viewers/members and show the tour automatically (no prompt, no asking). */
export function AppOnboardingTrigger({ userRole, userId, children }: AppOnboardingTriggerProps) {
  const [showTour, setShowTour] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked || !userRole || !userId) return;
    const alreadyDone = getOnboardingDone(userId);
    if (!alreadyDone && (userRole === 'viewer' || userRole === 'member')) {
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
