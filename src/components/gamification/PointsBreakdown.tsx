import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/hooks/useGamification';
import { POINTS_CONFIG, getProgressToNextBadge, getNextBadge, getBadge } from '@/utils/badgeSystem';
import { Flame, Zap, Trophy, Star, BookOpen, MessageSquare, Brain, FileText, ClipboardList } from 'lucide-react';

const activityIcons: Record<string, React.ReactNode> = {
  daily_login: <Flame className="w-4 h-4 text-orange-500" />,
  streak_7: <Flame className="w-4 h-4 text-orange-500" />,
  streak_14: <Flame className="w-4 h-4 text-red-500" />,
  streak_30: <Flame className="w-4 h-4 text-red-600" />,
  content_read: <BookOpen className="w-4 h-4 text-blue-500" />,
  comment_made: <MessageSquare className="w-4 h-4 text-purple-500" />,
  comment_received: <MessageSquare className="w-4 h-4 text-pink-500" />,
  ai_usage: <Brain className="w-4 h-4 text-cyan-500" />,
  blog_post_created: <FileText className="w-4 h-4 text-green-500" />,
  learning_resource_created: <FileText className="w-4 h-4 text-teal-500" />,
  survey_completion: <ClipboardList className="w-4 h-4 text-indigo-500" />,
};

export function PointsBreakdown() {
  const {
    totalPoints, currentBadge, nextBadge, progressToNext,
    loginStreak, longestStreak, aiUsageCount, blogPostsCount,
    commentsCount, commentsReceivedCount, contentReadsCount, loading
  } = useGamification();

  if (loading) {
    return (
      <Card className="finance-card">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-slate-200 rounded-xl" />
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="finance-card overflow-hidden">
      <CardHeader className="border-b border-slate-200/60 bg-amber-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-500 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-display font-normal text-navy-900">Your Engagement</CardTitle>
            <p className="text-[10px] section-label mt-0.5">How you earn points</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        {/* Current Badge & Progress */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-navy-900 to-slate-800 rounded-xl text-white">
          <img src={currentBadge.image} alt={currentBadge.name} className="w-16 h-16 rounded-lg" />
          <div className="flex-1 min-w-0">
            <p className="text-gold-400 text-[10px] font-bold uppercase tracking-wider">Current Rank</p>
            <p className="text-lg font-display">{currentBadge.name}</p>
            <p className="text-[11px] text-slate-300 mt-0.5">{currentBadge.description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-gold-400">{totalPoints}</p>
            <p className="text-[10px] text-slate-400">total pts</p>
          </div>
        </div>

        {/* Progress to next badge */}
        {nextBadge && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Next: {nextBadge.name}</span>
              <span className="text-gold-600 font-bold">{nextBadge.minPoints - totalPoints} pts to go</span>
            </div>
            <Progress value={progressToNext} className="h-2" indicatorClassName="bg-gold-500" />
          </div>
        )}

        {/* Streak */}
        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-200/50">
          <Flame className="w-6 h-6 text-orange-500" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-navy-900">
              {loginStreak} Day{loginStreak !== 1 ? 's' : ''} Streak 🔥
            </p>
            <p className="text-[10px] text-slate-500">Longest: {longestStreak} days</p>
          </div>
          <Zap className="w-4 h-4 text-orange-400" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Content Read', value: contentReadsCount, icon: '📖' },
            { label: 'Comments Made', value: commentsCount, icon: '💬' },
            { label: 'Comments Received', value: commentsReceivedCount, icon: '💌' },
            { label: 'AI Queries', value: aiUsageCount, icon: '🤖' },
            { label: 'Blog Posts', value: blogPostsCount, icon: '✍️' },
            { label: 'Login Streak', value: loginStreak, icon: '🔥' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
              <span className="text-lg">{stat.icon}</span>
              <div>
                <p className="text-sm font-bold text-navy-900">{stat.value}</p>
                <p className="text-[10px] text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* How to earn points */}
        <div>
          <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-gold-500" />
            How to Earn Points
          </h4>
          <div className="space-y-1.5">
            {Object.entries(POINTS_CONFIG).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors">
                {activityIcons[key] || <Star className="w-4 h-4 text-slate-400" />}
                <span className="text-xs text-slate-700 flex-1">{config.description}</span>
                <span className="text-xs font-bold text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full">
                  +{config.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
