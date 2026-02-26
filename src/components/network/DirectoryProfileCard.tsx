import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, Globe, FileText, Users } from 'lucide-react';

export interface DirectoryProfileCardProfile {
  id: string;
  company_name: string | null;
  email: string | null;
  description: string | null;
  website: string | null;
  profile_picture_url: string | null;
  user_role: string;
  team_member_count?: number;
}

interface DirectoryProfileCardProps {
  profile: DirectoryProfileCardProfile;
  /** e.g. "3 surveys" or "Has surveys" - shown as badge with FileText icon. Omit to hide. */
  surveyBadgeText: string | null;
  isClickable: boolean;
  onClick: () => void;
}

/**
 * Single shared card for directory (member + viewer). Same UI/UX everywhere.
 */
export default function DirectoryProfileCard({
  profile,
  surveyBadgeText,
  isClickable,
  onClick,
}: DirectoryProfileCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`h-full finance-card overflow-hidden ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 rounded-xl border-2 border-gold-500/40 flex-shrink-0 shadow-finance ring-2 ring-white">
            <AvatarImage src={profile.profile_picture_url || ''} className="object-cover" />
            <AvatarFallback className="rounded-xl bg-navy-900 text-gold-400 text-lg font-semibold">
              <Building2 className="h-7 w-7" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-semibold text-navy-900 truncate text-lg">
              {profile.company_name || '—'}
            </h3>
            {profile.email && !profile.email.includes('test@') && (
              <div className="flex items-center gap-1.5 mt-1 text-slate-600 text-sm truncate">
                <Mail className="h-3.5 w-3.5 flex-shrink-0 text-gold-600" />
                <span className="truncate">{profile.email}</span>
              </div>
            )}
          </div>
        </div>

        {profile.description && (
          <p className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {profile.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {surveyBadgeText && (
            <Badge variant="secondary" className="text-xs font-semibold bg-gold-500/15 text-gold-800 border-0 gap-1">
              <FileText className="h-3 w-3" />
              {surveyBadgeText}
            </Badge>
          )}
          {(profile.team_member_count ?? 0) > 0 && (
            <Badge variant="secondary" className="text-xs font-semibold bg-slate-200 text-slate-700 border-0 gap-1">
              <Users className="h-3 w-3" />
              {profile.team_member_count} team
            </Badge>
          )}
        </div>

        {(profile.website) ? (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gold-700 hover:text-gold-600 flex items-center gap-1 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe className="h-3.5 w-3.5" />
              Website
            </a>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
