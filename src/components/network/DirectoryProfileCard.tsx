import { useState } from 'react';
import { Building2, Mail, Globe, FileText, Users, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  surveyBadgeText: string | null;
  isClickable: boolean;
  onClick: () => void;
}

const DESCRIPTION_PREVIEW_CHARS = 120;

/**
 * Image = full background. Content on top: small icon left, link right; description + Read more.
 */
export default function DirectoryProfileCard({
  profile,
  surveyBadgeText,
  isClickable,
  onClick,
}: DirectoryProfileCardProps) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const hasDescription = profile.description && profile.description.trim().length > 0;
  const isLongDescription = hasDescription && profile.description!.length > DESCRIPTION_PREVIEW_CHARS;

  const Wrapper = isClickable ? 'button' : 'div';
  const bgImage = profile.profile_picture_url || '';
  const displayName = profile.company_name || '—';

  return (
    <Wrapper
      type={isClickable ? 'button' : undefined}
      onClick={isClickable ? onClick : undefined}
      className={cn(
        'group relative w-full text-left rounded-2xl border border-slate-200/90 overflow-hidden transition-all duration-300',
        'shadow-finance hover:shadow-card-hover min-h-[420px] flex flex-col',
        isClickable
          ? 'cursor-pointer hover:-translate-y-1 hover:border-gold-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 focus-visible:ring-offset-2'
          : 'cursor-default'
      )}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        {bgImage ? (
          <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex items-center justify-center">
            <Building2 className="w-20 h-20 text-gold-500/30" />
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-950/40 to-navy-950/95" aria-hidden />

      {/* Content on image */}
      <div className="relative flex flex-col min-h-[420px] p-5 sm:p-6">
        {isClickable && (
          <span className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/95 flex items-center justify-center text-gold-600 group-hover:bg-gold-500 group-hover:text-navy-900 transition-colors duration-300 shadow-finance">
            <ArrowRight className="h-5 w-5" />
          </span>
        )}

        <div className="flex-1 flex flex-col justify-end pt-8">
          <h3 className="font-display font-normal text-white text-xl sm:text-2xl leading-tight drop-shadow-md">
            {displayName}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {surveyBadgeText && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-gold-500/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-navy-900 font-sans">
                <FileText className="h-3 w-3" />
                {surveyBadgeText}
              </span>
            )}
            {(profile.team_member_count ?? 0) > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-2.5 py-1 text-[11px] font-medium text-white font-sans">
                <Users className="h-3 w-3" />
                {profile.team_member_count} team
              </span>
            )}
          </div>

          {/* Small icon left, link right — no boxes */}
          {profile.email && !profile.email.includes('test@') && (
            <a
              href={`mailto:${profile.email}`}
              onClick={(e) => e.stopPropagation()}
              className="mt-3 flex items-center gap-2.5 text-white hover:text-gold-200 transition-colors drop-shadow-sm"
            >
              <Mail className="h-4 w-4 flex-shrink-0 text-gold-400" />
              <span className="text-sm font-medium truncate font-sans underline decoration-white/40 hover:decoration-gold-300">
                {profile.email}
              </span>
            </a>
          )}
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-1.5 flex items-center gap-2.5 text-white hover:text-gold-200 transition-colors drop-shadow-sm"
            >
              <Globe className="h-4 w-4 flex-shrink-0 text-gold-400" />
              <span className="text-sm font-medium truncate font-sans underline decoration-white/40 hover:decoration-gold-300">
                {profile.website.replace(/^https?:\/\//i, '').split('/')[0]}
              </span>
            </a>
          )}

          {/* Description + Read more button */}
          {hasDescription && (
            <>
              <p
                className={cn(
                  'mt-3 text-sm text-white/95 leading-relaxed font-sans font-light drop-shadow-sm',
                  !descriptionExpanded && 'line-clamp-2'
                )}
              >
                {profile.description}
              </p>
              {isLongDescription && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDescriptionExpanded(!descriptionExpanded);
                  }}
                  className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-gold-300 hover:text-gold-200 font-sans transition-colors drop-shadow-sm"
                >
                  {descriptionExpanded ? (
                    <>
                      <ChevronUp className="h-3.5 w-3.5" />
                      Read less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" />
                      Read more
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
