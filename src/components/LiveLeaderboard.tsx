import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  submissionCount: number;
  lastSubmissionTime: string;
}

interface LiveLeaderboardProps {
  contestId: string;
  onNavigateToFullView?: () => void;
}

// Mock leaderboard data
const generateMockLeaderboard = (): LeaderboardEntry[] => {
  const users = [
    'AliceCode', 'BobDev', 'CharlieAI', 'DianaTech', 'EvanPro',
    'FionaScript', 'GeorgeByte', 'HelenData', 'IvanLogic', 'JuliaOpt',
    'KevinHash', 'LisaTree', 'MikeGraph', 'NinaLoop', 'OscarBit'
  ];

  return users.map((username, index) => ({
    rank: index + 1,
    username,
    score: Math.max(0, 450 - index * 30 - Math.floor(Math.random() * 20)),
    submissionCount: Math.floor(Math.random() * 15) + 1,
    lastSubmissionTime: `${Math.floor(Math.random() * 60)} min ago`
  })).sort((a, b) => b.score - a.score);
};

export default function LiveLeaderboard({ contestId, onNavigateToFullView }: LiveLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Initial load
    setLeaderboard(generateMockLeaderboard());

    // Auto-refresh every 15 seconds
    const interval = setInterval(() => {
      setLeaderboard(generateMockLeaderboard());
      setLastUpdate(new Date());
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLeaderboard(generateMockLeaderboard());
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 500);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-slate-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-slate-400 text-sm">{rank}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-slate-400 text-sm">
              Updated {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="text-slate-400 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        {onNavigateToFullView && (
          <Button
            size="sm"
            variant="outline"
            onClick={onNavigateToFullView}
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Full Leaderboard
          </Button>
        )}
      </div>

      {/* Leaderboard List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {leaderboard.slice(0, 10).map((entry) => (
            <Card
              key={entry.username}
              className={`p-3 border transition-all ${
                entry.rank <= 3
                  ? 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600'
                  : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 flex items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                    {entry.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm truncate">
                    {entry.username}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {entry.submissionCount} submissions
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-blue-400">{entry.score}</p>
                  <p className="text-slate-500 text-xs">{entry.lastSubmissionTime}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Auto-refresh indicator */}
      <div className="p-3 border-t border-slate-700">
        <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Auto-refreshing every 15s
        </div>
      </div>
    </div>
  );
}
