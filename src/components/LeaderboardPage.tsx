import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Crown, Medal, Filter, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  submissionCount: number;
  problemsSolved: number[];
  totalTime: string;
}

interface LeaderboardPageProps {
  contestId: string;
  onBack: () => void;
}

// Generate comprehensive mock leaderboard
const generateFullLeaderboard = (): LeaderboardEntry[] => {
  const users = [
    'AliceCode', 'BobDev', 'CharlieAI', 'DianaTech', 'EvanPro',
    'FionaScript', 'GeorgeByte', 'HelenData', 'IvanLogic', 'JuliaOpt',
    'KevinHash', 'LisaTree', 'MikeGraph', 'NinaLoop', 'OscarBit',
    'PaulStack', 'QuinnDB', 'RachelNet', 'SamCloud', 'TinaML',
    'UmaAI', 'VinceOps', 'WendySec', 'XavierWeb', 'YaraApp'
  ];

  return users.map((username, index) => {
    const problemsSolved: number[] = [];
    const numSolved = Math.max(0, 3 - Math.floor(index / 8));
    
    for (let i = 0; i < numSolved; i++) {
      problemsSolved.push(i + 1);
    }

    return {
      rank: index + 1,
      username,
      score: Math.max(0, 450 - index * 18 - Math.floor(Math.random() * 15)),
      submissionCount: Math.floor(Math.random() * 20) + numSolved,
      problemsSolved,
      totalTime: `${Math.floor(Math.random() * 90)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
    };
  }).sort((a, b) => b.score - a.score);
};

export default function LeaderboardPage({ contestId, onBack }: LeaderboardPageProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setLeaderboard(generateFullLeaderboard());
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLeaderboard(generateFullLeaderboard());
      setIsRefreshing(false);
    }, 500);
  };

  const filteredLeaderboard = filter === 'all'
    ? leaderboard
    : leaderboard.filter(entry => 
        entry.problemsSolved.includes(parseInt(filter))
      );

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-400">{rank}</span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center gap-2">
          <Medal className="w-5 h-5 text-slate-300" />
          <span className="text-slate-300">{rank}</span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center gap-2">
          <Medal className="w-5 h-5 text-amber-600" />
          <span className="text-amber-600">{rank}</span>
        </div>
      );
    }
    return <span className="text-slate-400">{rank}</span>;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Contest
              </Button>
              <div className="h-6 w-px bg-slate-600" />
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h1 className="text-2xl text-slate-100">Leaderboard</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-slate-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all" className="text-slate-300">
                      All Problems
                    </SelectItem>
                    <SelectItem value="1" className="text-slate-300">
                      Problem 1
                    </SelectItem>
                    <SelectItem value="2" className="text-slate-300">
                      Problem 2
                    </SelectItem>
                    <SelectItem value="3" className="text-slate-300">
                      Problem 3
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          <p className="text-slate-400">
            Contest ID: <span className="text-blue-400">{contestId}</span> • {filteredLeaderboard.length} participants
          </p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="max-w-7xl mx-auto p-6">
        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-800">
                <TableHead className="text-slate-300 w-24">Rank</TableHead>
                <TableHead className="text-slate-300">User</TableHead>
                <TableHead className="text-slate-300">Score</TableHead>
                <TableHead className="text-slate-300">Problems Solved</TableHead>
                <TableHead className="text-slate-300">Submissions</TableHead>
                <TableHead className="text-slate-300">Total Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeaderboard.map((entry, index) => (
                <TableRow
                  key={entry.username}
                  className={`border-slate-700 transition-colors ${
                    entry.rank <= 3
                      ? 'bg-slate-700/30 hover:bg-slate-700/50'
                      : 'hover:bg-slate-700/30'
                  }`}
                >
                  <TableCell className="py-4">
                    {getRankBadge(entry.rank)}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {entry.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-slate-200">{entry.username}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-blue-400">{entry.score}</span>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((problemNum) => (
                        <Badge
                          key={problemNum}
                          variant="outline"
                          className={
                            entry.problemsSolved.includes(problemNum)
                              ? 'border-green-500 text-green-400 bg-green-950/30'
                              : 'border-slate-600 text-slate-500 bg-slate-900/30'
                          }
                        >
                          P{problemNum}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-slate-300">{entry.submissionCount}</span>
                  </TableCell>

                  <TableCell>
                    <span className="text-slate-400 font-mono text-sm">{entry.totalTime}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {filteredLeaderboard.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No participants found for this filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
