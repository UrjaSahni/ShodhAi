import { useState, useEffect } from 'react';
import { Code2, LogOut, Trophy, Timer, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import ProblemView from './ProblemView';
import CodeEditor from './CodeEditor';
import LiveLeaderboard from './LiveLeaderboard';
import { toast } from 'sonner@2.0.3';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface User {
  username: string;
  contestId: string;
}

interface ContestDashboardProps {
  user: User;
  onLeaveContest: () => void;
  onNavigateToLeaderboard: () => void;
}

const mockProblems = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    points: 100,
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    inputFormat: 'First line contains n (size of array) and target. Second line contains n space-separated integers.',
    outputFormat: 'Two space-separated integers representing the indices (0-based).',
    sampleCases: [
      {
        input: '4 9\n2 7 11 15',
        output: '0 1',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: '3 6\n3 2 4',
        output: '1 2',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    submissionTestCases: [
      { input: '4 9\n2 7 11 15', output: '0 1' },
      { input: '3 6\n3 2 4', output: '1 2' },
      { input: '2 10\n5 5', output: '0 1' },
      { input: '5 18\n3 5 7 9 11', output: '2 3' },
      { input: '6 15\n1 4 6 8 10 15', output: '1 5' },
      { input: '4 0\n-1 -2 1 2', output: '0 2' },
      { input: '3 -5\n-3 -2 -1', output: '0 1' },
      { input: '7 20\n2 4 6 8 10 12 14', output: '3 5' },
      { input: '2 100\n50 50', output: '0 1' },
      { input: '5 7\n1 2 3 4 5', output: '1 4' }
    ]
  },
  {
    id: '2',
    title: 'Palindrome String',
    difficulty: 'Medium',
    points: 150,
    description: 'Given a string s, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.',
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    inputFormat: 'A single line containing the string s.',
    outputFormat: 'Print "true" if the string is a palindrome, otherwise "false".',
    sampleCases: [
      {
        input: 'A man, a plan, a canal: Panama',
        output: 'true',
        explanation: 'After removing non-alphanumeric characters and converting to lowercase, it reads "amanaplanacanalpanama" which is a palindrome.'
      },
      {
        input: 'race a car',
        output: 'false',
        explanation: 'After processing, it reads "raceacar" which is not a palindrome.'
      }
    ],
    submissionTestCases: [
      { input: 'A man, a plan, a canal: Panama', output: 'true' },
      { input: 'race a car', output: 'false' },
      { input: 'racecar', output: 'true' },
      { input: 'hello', output: 'false' },
      { input: 'Madam', output: 'true' },
      { input: 'Was it a car or a cat I saw?', output: 'true' },
      { input: 'No lemon, no melon', output: 'true' },
      { input: 'abc123', output: 'false' },
      { input: '12321', output: 'true' },
      { input: 'A Santa at NASA', output: 'true' }
    ]
  },
  {
    id: '3',
    title: 'Binary Tree Traversal',
    difficulty: 'Hard',
    points: 200,
    description: 'Given the root of a binary tree, return the inorder traversal of its nodes\' values.',
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100'
    ],
    inputFormat: 'First line contains n (number of nodes). Next n lines contain three space-separated integers: node_value left_child_index right_child_index (-1 if no child).',
    outputFormat: 'Space-separated integers representing the inorder traversal.',
    sampleCases: [
      {
        input: '3\n1 -1 2\n2 -1 -1\n3 0 -1',
        output: '1 3 2',
        explanation: 'Tree structure: 1 -> right child is 3, 3 -> left child is 2. Inorder: left, root, right.'
      },
      {
        input: '1\n5 -1 -1',
        output: '5',
        explanation: 'Single node tree.'
      }
    ],
    submissionTestCases: [
      { input: '3\n1 -1 2\n2 -1 -1\n3 0 -1', output: '1 3 2' },
      { input: '1\n5 -1 -1', output: '5' },
      { input: '0', output: '' },
      { input: '5\n10 1 2\n5 -1 -1\n15 3 4\n12 -1 -1\n20 -1 -1', output: '5 10 12 15 20' },
      { input: '4\n8 1 2\n3 -1 -1\n10 -1 3\n14 -1 -1', output: '3 8 10 14' },
      { input: '2\n1 -1 1\n2 -1 -1', output: '1 2' },
      { input: '6\n4 1 2\n2 3 4\n6 -1 5\n1 -1 -1\n3 -1 -1\n7 -1 -1', output: '1 2 3 4 6 7' },
      { input: '3\n7 0 1\n9 -1 -1\n15 -1 -1', output: '7 9 15' },
      { input: '4\n-5 1 2\n-10 -1 -1\n5 -1 3\n10 -1 -1', output: '-10 -5 5 10' },
      { input: '2\n100 -1 1\n-100 -1 -1', output: '100 -100' }
    ]
  }
];

export default function ContestDashboard({ user, onLeaveContest, onNavigateToLeaderboard }: ContestDashboardProps) {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(90 * 60); // 90 minutes in seconds

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          toast.error('Contest time is up!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining < 300) return 'text-red-400'; // Less than 5 minutes
    if (timeRemaining < 900) return 'text-yellow-400'; // Less than 15 minutes
    return 'text-green-400';
  };

  const handleLeaveContest = () => {
    setShowLeaveDialog(true);
  };

  const confirmLeave = () => {
    toast.info('Left the contest');
    onLeaveContest();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-6 h-6 text-blue-400" />
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Shodh-a-Code
              </span>
            </div>
            <div className="h-6 w-px bg-slate-600" />
            <span className="text-slate-300">Contest: {user.contestId}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer className={`w-5 h-5 ${getTimeColor()}`} />
              <span className={`font-mono ${getTimeColor()}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="text-slate-300 hover:text-white"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </Button>

            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-slate-300">{user.username}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLeaveContest}
              className="text-red-400 hover:text-red-300 hover:bg-red-950"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Leave
            </Button>
          </div>
        </div>
      </div>

      {/* Problem Selector */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-2">
        <div className="flex gap-2 max-w-[1920px] mx-auto">
          {mockProblems.map((problem, index) => (
            <button
              key={problem.id}
              onClick={() => setCurrentProblem(index)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                currentProblem === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <span>Problem {index + 1}</span>
              <Badge
                variant="outline"
                className={`${
                  problem.difficulty === 'Easy'
                    ? 'border-green-500 text-green-400'
                    : problem.difficulty === 'Medium'
                    ? 'border-yellow-500 text-yellow-400'
                    : 'border-red-500 text-red-400'
                }`}
              >
                {problem.difficulty}
              </Badge>
              <span className="text-xs opacity-70">{problem.points} pts</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem View */}
        <div className="w-1/2 border-r border-slate-700 overflow-auto">
          <ProblemView 
            problem={mockProblems[currentProblem]}
            sampleCases={mockProblems[currentProblem].sampleCases}
            submissionCases={mockProblems[currentProblem].submissionTestCases}
          />
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 overflow-auto">
          <CodeEditor
            key={mockProblems[currentProblem].id}
            problemId={mockProblems[currentProblem].id}
            sampleTestCases={mockProblems[currentProblem].sampleCases}
            submissionTestCases={mockProblems[currentProblem].submissionTestCases}
          />
        </div>

        {/* Sliding Leaderboard Panel */}
        {showLeaderboard && (
          <div className="fixed right-0 top-0 h-full w-96 bg-slate-900 border-l border-slate-700 shadow-2xl z-50 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <h3 className="text-slate-100">Live Leaderboard</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLeaderboard(false)}
                className="text-slate-400 hover:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            <LiveLeaderboard contestId={user.contestId} onNavigateToFullView={onNavigateToLeaderboard} />
          </div>
        )}
      </div>

      {/* Leave Contest Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-100">Leave Contest?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to leave this contest? Your progress will be saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 text-slate-300 hover:bg-slate-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLeave}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Leave Contest
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
