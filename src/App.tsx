import { useState } from 'react';
import JoinContestPage from './components/JoinContestPage';
import ContestDashboard from './components/ContestDashboard';
import LeaderboardPage from './components/LeaderboardPage';
import { Toaster } from './components/ui/sonner';

type Page = 'join' | 'dashboard' | 'leaderboard';

interface User {
  username: string;
  contestId: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('join');
  const [user, setUser] = useState<User | null>(null);

  const handleJoinContest = (contestId: string, username: string) => {
    setUser({ username, contestId });
    setCurrentPage('dashboard');
  };

  const handleLeaveContest = () => {
    setUser(null);
    setCurrentPage('join');
  };

  const handleNavigateToLeaderboard = () => {
    setCurrentPage('leaderboard');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {currentPage === 'join' && (
        <JoinContestPage onJoinContest={handleJoinContest} />
      )}
      {currentPage === 'dashboard' && user && (
        <ContestDashboard
          user={user}
          onLeaveContest={handleLeaveContest}
          onNavigateToLeaderboard={handleNavigateToLeaderboard}
        />
      )}
      {currentPage === 'leaderboard' && user && (
        <LeaderboardPage
          contestId={user.contestId}
          onBack={handleBackToDashboard}
        />
      )}
      <Toaster position="top-right" theme="dark" richColors />
    </div>
  );
}
