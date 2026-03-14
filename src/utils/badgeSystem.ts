import internBadge from '@/assets/badges/intern.png';
import analystBadge from '@/assets/badges/analyst.png';
import associateBadge from '@/assets/badges/associate.png';
import vpBadge from '@/assets/badges/vp.png';
import directorBadge from '@/assets/badges/director.png';
import mdBadge from '@/assets/badges/md.png';
import partnerBadge from '@/assets/badges/partner.png';
import seniorPartnerBadge from '@/assets/badges/senior-partner.png';

export interface Badge {
  name: string;
  minPoints: number;
  color: string;
  icon: string;
  image: string;
  description: string;
}

export const badges: Badge[] = [
  { name: "Intern", minPoints: 0, color: "bg-slate-500", icon: "📋", image: internBadge, description: "Welcome to the network! Start engaging to climb the ranks." },
  { name: "Analyst", minPoints: 50, color: "bg-blue-500", icon: "📊", image: analystBadge, description: "You're building momentum. Keep exploring and contributing." },
  { name: "Associate", minPoints: 150, color: "bg-cyan-600", icon: "🛡️", image: associateBadge, description: "A recognized contributor making an impact on the network." },
  { name: "Vice President", minPoints: 300, color: "bg-indigo-600", icon: "🏛️", image: vpBadge, description: "A seasoned member with deep network engagement." },
  { name: "Director", minPoints: 500, color: "bg-purple-600", icon: "🧭", image: directorBadge, description: "A guiding force in the community with consistent excellence." },
  { name: "Managing Director", minPoints: 800, color: "bg-amber-600", icon: "🦅", image: mdBadge, description: "Elite status achieved through outstanding engagement." },
  { name: "Partner", minPoints: 1200, color: "bg-yellow-600", icon: "👑", image: partnerBadge, description: "One of the most influential members of the network." },
  { name: "Senior Partner", minPoints: 2000, color: "bg-gold-600", icon: "🏆", image: seniorPartnerBadge, description: "The pinnacle of achievement. A true network legend." },
];

export function getBadge(points: number): Badge {
  for (let i = badges.length - 1; i >= 0; i--) {
    if (points >= badges[i].minPoints) {
      return badges[i];
    }
  }
  return badges[0];
}

export function getNextBadge(points: number): Badge | null {
  for (const badge of badges) {
    if (points < badge.minPoints) {
      return badge;
    }
  }
  return null;
}

export function getProgressToNextBadge(points: number): number {
  const nextBadge = getNextBadge(points);
  if (!nextBadge) return 100;

  const currentBadge = getBadge(points);
  const range = nextBadge.minPoints - currentBadge.minPoints;
  const progress = points - currentBadge.minPoints;
  
  return (progress / range) * 100;
}

export const POINTS_CONFIG = {
  daily_login: { points: 5, label: 'Daily Login', description: 'Log in each day to earn points' },
  streak_7: { points: 10, label: '7-Day Streak Bonus', description: 'Maintain a 7-day login streak' },
  streak_14: { points: 15, label: '14-Day Streak Bonus', description: 'Maintain a 14-day login streak' },
  streak_30: { points: 25, label: '30-Day Streak Bonus', description: 'Maintain a 30-day login streak' },
  content_read: { points: 2, label: 'Read New Content', description: 'Open a blog post or resource for the first time' },
  comment_made: { points: 3, label: 'Post a Comment', description: 'Comment on a blog post or resource' },
  comment_received: { points: 2, label: 'Receive a Comment', description: 'Someone comments on your blog post' },
  ai_usage: { points: 1, label: 'Use PortIQ', description: 'Ask a question to the AI assistant' },
  blog_post_created: { points: 10, label: 'Create a Blog Post', description: 'Publish a new blog post' },
  learning_resource_created: { points: 10, label: 'Create a Resource', description: 'Add a new learning resource' },
  survey_completion: { points: 20, label: 'Complete a Survey', description: 'Submit an annual survey' },
} as const;
