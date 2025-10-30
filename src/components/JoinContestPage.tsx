import { useState } from 'react';
import { Code2, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';

interface JoinContestPageProps {
  onJoinContest: (contestId: string, username: string) => void;
}

export default function JoinContestPage({ onJoinContest }: JoinContestPageProps) {
  const [contestId, setContestId] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contestId.trim() || !username.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Joined contest successfully!');
      onJoinContest(contestId, username);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-[#0f172a] to-purple-950 opacity-70" />
      
      <div className="relative w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl">
              <Code2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Shodh-a-Code
          </h1>
          <p className="text-slate-400">Real-Time Coding Contest Platform</p>
        </div>

        {/* Join Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl mb-6 text-center text-slate-100">Join a Contest</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="contestId" className="text-slate-300">
                Contest ID
              </Label>
              <Input
                id="contestId"
                type="text"
                placeholder="e.g., CONTEST2025"
                value={contestId}
                onChange={(e) => setContestId(e.target.value)}
                className="bg-slate-900 border-slate-600 text-slate-100 placeholder:text-slate-500 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-300">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-900 border-slate-600 text-slate-100 placeholder:text-slate-500 h-12"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Joining...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Join Contest
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-8">
          Powered by <span className="text-purple-400">Shodh AI</span>
        </p>
      </div>
    </div>
  );
}
