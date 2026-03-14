import explorerBadge from '@/assets/badges/explorer.png';
import scoutBadge from '@/assets/badges/scout.png';
import navigatorBadge from '@/assets/badges/navigator.png';
import strategistBadge from '@/assets/badges/strategist.png';
import trailblazerBadge from '@/assets/badges/trailblazer.png';
import catalystBadge from '@/assets/badges/catalyst.png';
import vanguardBadge from '@/assets/badges/vanguard.png';
import titanBadge from '@/assets/badges/titan.png';

export interface Badge {
  name: string;
  minPoints: number;
  color: string;
  icon: string;
  image: string;
  description: string;
}

export const badges: Badge[] = [
  { name: "Explorer", minPoints: 0, color: "bg-slate-500", icon: "🦊", image: explorerBadge, description: "Welcome aboard! Start exploring the network to earn your stripes." },
  { name: "Scout", minPoints: 50, color: "bg-blue-500", icon: "🦉", image: scoutBadge, description: "You've got sharp eyes — keep digging into insights and content." },
  { name: "Navigator", minPoints: 150, color: "bg-cyan-600", icon: "🐺", image: navigatorBadge, description: "You know your way around. A trusted contributor to the community." },
  { name: "Strategist", minPoints: 300, color: "bg-indigo-600", icon: "🦁", image: strategistBadge, description: "Bold moves, sharp thinking. You're shaping the conversation." },
  { name: "Trailblazer", minPoints: 500, color: "bg-purple-600", icon: "🦅", image: trailblazerBadge, description: "Leading from the front — your engagement sets the standard." },
  { name: "Catalyst", minPoints: 800, color: "bg-amber-600", icon: "🔥", image: catalystBadge, description: "You spark action wherever you go. A force in the network." },
  { name: "Vanguard", minPoints: 1200, color: "bg-yellow-600", icon: "🏅", image: vanguardBadge, description: "Among the elite few. Your presence elevates the entire network." },
  { name: "Titan", minPoints: 2000, color: "bg-gradient-to-r from-yellow-500 to-amber-600", icon: "👑", image: titanBadge, description: "Legendary status. The network's ultimate champion." },
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
