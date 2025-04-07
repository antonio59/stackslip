// Removed unused React import
import { Award, MessageSquare, ThumbsUp, Trophy, HelpCircle, Vote } from 'lucide-react';
import type { StackOverflowUser } from '../services/stackOverflowApi'; // Import the type

interface ReceiptStatsProps {
  userData: StackOverflowUser;
}

export function ReceiptStats({ userData }: ReceiptStatsProps) {
  return (
    <div className="border-b border-dashed border-gray-300 py-6 space-y-2">
      {/* Reputation */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Trophy size={16} />
          <span>REPUTATION</span>
        </div>
        <span>{userData.reputation.toLocaleString()}</span>
      </div>
      <div className="text-sm text-gray-600 pl-6 space-y-1">
        <div className="flex justify-between">
          <span>THIS WEEK</span>
          <span>+{userData.reputation_change_week.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>THIS MONTH</span>
          <span>+{userData.reputation_change_month.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>THIS YEAR</span>
          <span>+{userData.reputation_change_year.toLocaleString()}</span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Award size={16} />
          <span>BADGES</span>
        </div>
        <div className="text-right">
          <span className="text-yellow-500 mr-2">●{userData.badge_counts.gold}</span>
          <span className="text-gray-400 mr-2">●{userData.badge_counts.silver}</span>
          <span className="text-amber-600">●{userData.badge_counts.bronze}</span>
        </div>
      </div>

      {/* Questions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <HelpCircle size={16} />
          <span>QUESTIONS</span>
        </div>
        <span>{userData.question_count.toLocaleString()}</span>
      </div>

      {/* Answers */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} />
          <span>ANSWERS</span>
        </div>
        <span>{userData.answer_count.toLocaleString()}</span>
      </div>

      {/* Accept Rate */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ThumbsUp size={16} />
          <span>ACCEPT RATE</span>
        </div>
        <span>{userData.accept_rate != null ? `${userData.accept_rate}%` : 'N/A'}</span> {/* Handle null accept_rate */}
      </div>

      {/* Votes Cast */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Vote size={16} />
          <span>VOTES CAST</span>
        </div>
        <span>+{userData.up_vote_count.toLocaleString()} / -{userData.down_vote_count.toLocaleString()}</span>
      </div>
    </div>
  );
}