import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  points: number;
  description: string;
  constraints: string[];
  inputFormat: string;
  outputFormat: string;
}

interface ProblemViewProps {
  problem: Problem;
  sampleCases: Example[];
  submissionCases: { input: string; output: string }[];
}

export default function ProblemView({ problem, sampleCases, submissionCases }: ProblemViewProps) {
  const getDifficultyColor = () => {
    switch (problem.difficulty) {
      case 'Easy':
        return 'border-green-500 text-green-400 bg-green-950';
      case 'Medium':
        return 'border-yellow-500 text-yellow-400 bg-yellow-950';
      case 'Hard':
        return 'border-red-500 text-red-400 bg-red-950';
      default:
        return 'border-slate-500 text-slate-400 bg-slate-950';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Problem Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl text-slate-100">{problem.title}</h1>
          <Badge className={getDifficultyColor()}>
            {problem.difficulty}
          </Badge>
          <Badge variant="outline" className="border-blue-500 text-blue-400">
            {problem.points} points
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="bg-slate-800 border border-slate-700 w-full justify-start">
          <TabsTrigger value="description" className="data-[state=active]:bg-slate-700">
            Description
          </TabsTrigger>
          <TabsTrigger value="examples" className="data-[state=active]:bg-slate-700">
            Examples
          </TabsTrigger>
          <TabsTrigger value="constraints" className="data-[state=active]:bg-slate-700">
            Constraints
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4 mt-4">
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <p className="text-slate-300 leading-relaxed">{problem.description}</p>
          </Card>

          <div className="space-y-3">
            <div>
              <h3 className="text-slate-100 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Input Format
              </h3>
              <Card className="bg-slate-800/50 border-slate-700 p-4">
                <p className="text-slate-400 text-sm">{problem.inputFormat}</p>
              </Card>
            </div>

            <div>
              <h3 className="text-slate-100 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                Output Format
              </h3>
              <Card className="bg-slate-800/50 border-slate-700 p-4">
                <p className="text-slate-400 text-sm">{problem.outputFormat}</p>
              </Card>
            </div>
          </div>

          {/* Sample Cases in Description Tab */}
          <div className="space-y-4 mt-6">
            <h3 className="text-slate-100">Sample Test Cases</h3>
            {sampleCases.map((example, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 p-4">
                <h4 className="text-slate-100 mb-3">Sample {index + 1}</h4>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Input:</p>
                    <pre className="bg-slate-900 p-3 rounded-lg text-green-400 text-sm overflow-x-auto font-mono">
                      {example.input}
                    </pre>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm mb-1">Output:</p>
                    <pre className="bg-slate-900 p-3 rounded-lg text-blue-400 text-sm overflow-x-auto font-mono">
                      {example.output}
                    </pre>
                  </div>

                  {example.explanation && (
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Explanation:</p>
                      <p className="text-slate-300 text-sm">{example.explanation}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4 mt-4">
          <div className="bg-blue-950/30 border border-blue-700 rounded-lg p-4 mb-4">
            <p className="text-blue-300 text-sm">
              These are the test cases that will be used to evaluate your submission. 
              Your code must pass all {submissionCases.length} test cases to get full points.
            </p>
          </div>

          {submissionCases.map((testCase, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 p-4">
              <h4 className="text-slate-100 mb-3">Test Case {index + 1}</h4>
              
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Input:</p>
                  <pre className="bg-slate-900 p-3 rounded-lg text-green-400 text-sm overflow-x-auto font-mono">
                    {testCase.input}
                  </pre>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-1">Expected Output:</p>
                  <pre className="bg-slate-900 p-3 rounded-lg text-blue-400 text-sm overflow-x-auto font-mono">
                    {testCase.output}
                  </pre>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="constraints" className="space-y-4 mt-4">
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="space-y-2">
              {problem.constraints.map((constraint, index) => (
                <div key={index} className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-300 text-sm font-mono">{constraint}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
