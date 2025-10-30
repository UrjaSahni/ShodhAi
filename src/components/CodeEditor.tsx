import { useState } from 'react';
import { Play, Send, Code, ChevronLeft, ChevronRight, History } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import TestCaseResults from './TestCaseResults';
import { toast } from 'sonner@2.0.3';

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface TestCase {
  input: string;
  output: string;
}

interface CodeEditorProps {
  problemId: string;
  sampleTestCases: Example[];
  submissionTestCases: TestCase[];
}

type Language = 'java' | 'python' | 'cpp';
type SubmissionStatus = 'idle' | 'running' | 'completed';

interface TestResult {
  testCaseNumber: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  status: 'passed' | 'failed';
  executionTime?: string;
}

interface Submission {
  id: number;
  timestamp: Date;
  code: string;
  language: Language;
  status: 'Accepted' | 'Wrong Answer' | 'Partial';
  passedTests: number;
  totalTests: number;
  results: TestResult[];
}

// Problem-specific code templates
const problemCodeTemplates: Record<string, Record<Language, string>> = {
  '1': {
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
    python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        `,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`
  },
  '2': {
    java: `class Solution {
    public boolean isPalindrome(String s) {
        
    }
}`,
    python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        `,
    cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        
    }
};`
  },
  '3': {
    java: `class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        
    }
}`,
    python: `class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        `,
    cpp: `class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        
    }
};`
  }
};

export default function CodeEditor({ problemId, sampleTestCases, submissionTestCases }: CodeEditorProps) {
  const [language, setLanguage] = useState<Language>('java');
  const [code, setCode] = useState(problemCodeTemplates[problemId]?.java || '');
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSubmission, setIsSubmission] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showSubmissions, setShowSubmissions] = useState(false);

  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
    setCode(problemCodeTemplates[problemId]?.[value] || '');
  };

  // Generate test results based on fixed test cases
  const generateTestResults = (testCases: TestCase[] | Example[], isRun: boolean): TestResult[] => {
    return testCases.map((testCase, index) => {
      // Mock execution: All tests pass since we don't have a real backend
      // In production, this would be replaced with actual code execution results
      return {
        testCaseNumber: index + 1,
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: testCase.output, // Mock: shows correct output
        status: 'passed' as const,
        executionTime: `${Math.floor(Math.random() * 100) + 10}ms`
      };
    });
  };

  const runCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first!');
      return;
    }

    setStatus('running');
    setShowResults(false);
    setIsSubmission(false);
    
    // Simulate code execution on sample test cases
    setTimeout(() => {
      const results = generateTestResults(sampleTestCases, true);
      setTestResults(results);
      setStatus('completed');
      setShowResults(true);
      
      const allPassed = results.every(r => r.status === 'passed');
      if (allPassed) {
        toast.success('All sample test cases passed! ✅');
      } else {
        toast.error('Some test cases failed ❌');
      }
    }, 2000);
  };

  const submitCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first!');
      return;
    }

    setStatus('running');
    setShowResults(false);
    setIsSubmission(true);
    
    // Simulate submission with all test cases
    setTimeout(() => {
      const results = generateTestResults(submissionTestCases, false);
      setTestResults(results);
      setStatus('completed');
      setShowResults(true);
      
      const passedCount = results.filter(r => r.status === 'passed').length;
      const totalCount = results.length;
      
      // Create submission record
      const newSubmission: Submission = {
        id: submissions.length + 1,
        timestamp: new Date(),
        code: code,
        language: language,
        status: passedCount === totalCount ? 'Accepted' : passedCount > 0 ? 'Partial' : 'Wrong Answer',
        passedTests: passedCount,
        totalTests: totalCount,
        results: results
      };
      
      setSubmissions([newSubmission, ...submissions]);
      
      if (passedCount === totalCount) {
        toast.success(`Submission Accepted! ${passedCount}/${totalCount} test cases passed! 🎉`);
      } else if (passedCount > 0) {
        toast.warning(`Partial: ${passedCount}/${totalCount} test cases passed`);
      } else {
        toast.error(`Wrong Answer: 0/${totalCount} test cases passed`);
      }
    }, 3000);
  };

  const loadSubmission = (submission: Submission) => {
    setCode(submission.code);
    setLanguage(submission.language);
    setTestResults(submission.results);
    setShowResults(true);
    setIsSubmission(true);
    setStatus('completed');
    setShowSubmissions(false);
    toast.info(`Loaded submission from ${submission.timestamp.toLocaleTimeString()}`);
  };

  const getStatusBadge = () => {
    if (status === 'idle') return null;
    
    if (status === 'running') {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500">
          <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse" />
          Running...
        </Badge>
      );
    }
    
    if (status === 'completed' && testResults.length > 0) {
      const allPassed = testResults.every(r => r.status === 'passed');
      return allPassed ? (
        <Badge className="bg-green-500/20 text-green-400 border-green-500">
          Accepted
        </Badge>
      ) : (
        <Badge className="bg-red-500/20 text-red-400 border-red-500">
          Wrong Answer
        </Badge>
      );
    }
    
    return null;
  };

  const getSubmissionStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'border-green-500 text-green-400 bg-green-950/30';
      case 'Partial':
        return 'border-yellow-500 text-yellow-400 bg-yellow-950/30';
      case 'Wrong Answer':
        return 'border-red-500 text-red-400 bg-red-950/30';
      default:
        return 'border-slate-500 text-slate-400 bg-slate-950/30';
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Editor Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-5 h-5 text-slate-400" />
            <ChevronRight className="w-5 h-5 text-slate-400" />
            <Code className="w-5 h-5 text-blue-400" />
            <span className="text-slate-300">Code Editor</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSubmissions(!showSubmissions)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <History className="w-4 h-4 mr-2" />
              Submissions ({submissions.length})
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-40 bg-slate-900 border-slate-600 text-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="java" className="text-slate-300">Java</SelectItem>
              <SelectItem value="python" className="text-slate-300">Python</SelectItem>
              <SelectItem value="cpp" className="text-slate-300">C++</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1" />

          <Button
            onClick={runCode}
            disabled={status === 'running'}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Run (2 samples)
          </Button>

          <Button
            onClick={submitCode}
            disabled={status === 'running'}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit (10 tests)
          </Button>
        </div>
      </div>

      {/* Code Input Area */}
      <div className="flex-1 p-4 overflow-auto">
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full min-h-[400px] bg-slate-900 border-slate-700 text-slate-100 font-mono text-sm resize-none"
          placeholder="Write your code here..."
          spellCheck={false}
        />
      </div>

      {/* Test Results */}
      {showResults && (
        <div className="border-t border-slate-700">
          <TestCaseResults
            results={testResults}
            isSubmission={isSubmission}
          />
        </div>
      )}

      {/* Previous Submissions Sliding Panel */}
      {showSubmissions && (
        <div className="absolute right-0 top-0 h-full w-96 bg-slate-900 border-l border-slate-700 shadow-2xl z-50 animate-in slide-in-from-right duration-300">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-400" />
                <h3 className="text-slate-100">Previous Submissions</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSubmissions(false)}
                className="text-slate-400 hover:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              {submissions.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No submissions yet</p>
                  <p className="text-slate-500 text-sm mt-2">
                    Submit your code to see your submission history
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((submission) => (
                    <button
                      key={submission.id}
                      onClick={() => loadSubmission(submission)}
                      className="w-full text-left bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-4 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">
                          #{submission.id}
                        </span>
                        <span className="text-slate-500 text-xs">
                          {submission.timestamp.toLocaleTimeString()}
                        </span>
                      </div>

                      <Badge
                        variant="outline"
                        className={getSubmissionStatusColor(submission.status)}
                      >
                        {submission.status}
                      </Badge>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-slate-300 text-sm">
                          {submission.passedTests}/{submission.totalTests} passed
                        </span>
                        <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                          {submission.language}
                        </Badge>
                      </div>

                      <div className="mt-2 bg-slate-900 rounded p-2">
                        <pre className="text-slate-400 text-xs font-mono truncate">
                          {submission.code.split('\n')[0]}...
                        </pre>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
