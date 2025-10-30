import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

interface TestResult {
  testCaseNumber: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  status: 'passed' | 'failed';
  executionTime?: string;
}

interface TestCaseResultsProps {
  results: TestResult[];
  isSubmission: boolean;
}

export default function TestCaseResults({ results, isSubmission }: TestCaseResultsProps) {
  const passedCount = results.filter(r => r.status === 'passed').length;
  const totalCount = results.length;
  const allPassed = passedCount === totalCount;

  return (
    <div className="bg-slate-800 border-t border-slate-700">
      {/* Summary Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {allPassed ? (
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
            <div>
              <h3 className="text-slate-100">
                {isSubmission ? 'Submission Results' : 'Test Results'}
              </h3>
              <p className="text-slate-400 text-sm">
                {passedCount} / {totalCount} test cases passed
              </p>
            </div>
          </div>

          <Badge
            className={
              allPassed
                ? 'bg-green-500/20 text-green-400 border-green-500'
                : 'bg-red-500/20 text-red-400 border-red-500'
            }
          >
            {Math.round((passedCount / totalCount) * 100)}% Success Rate
          </Badge>
        </div>
      </div>

      {/* Test Cases List */}
      <ScrollArea className="h-64">
        <Accordion type="multiple" className="px-4 py-2">
          {results.map((result) => (
            <AccordionItem
              key={result.testCaseNumber}
              value={`test-${result.testCaseNumber}`}
              className="border-slate-700"
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    {result.status === 'passed' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-slate-300">
                      Test Case {result.testCaseNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {result.executionTime && (
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <Clock className="w-3 h-3" />
                        {result.executionTime}
                      </div>
                    )}
                    <Badge
                      variant="outline"
                      className={
                        result.status === 'passed'
                          ? 'border-green-500 text-green-400'
                          : 'border-red-500 text-red-400'
                      }
                    >
                      {result.status === 'passed' ? 'Passed' : 'Failed'}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="space-y-3 pt-2 pb-3">
                  {/* Input */}
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Input:</p>
                    <Card className="bg-slate-900 border-slate-700 p-3">
                      <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                        {result.input}
                      </pre>
                    </Card>
                  </div>

                  {/* Expected Output */}
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Expected Output:</p>
                    <Card className="bg-slate-900 border-slate-700 p-3">
                      <pre className="text-blue-400 text-xs font-mono whitespace-pre-wrap">
                        {result.expectedOutput}
                      </pre>
                    </Card>
                  </div>

                  {/* Actual Output */}
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Your Output:</p>
                    <Card
                      className={`border p-3 ${
                        result.status === 'passed'
                          ? 'bg-green-950/30 border-green-700'
                          : 'bg-red-950/30 border-red-700'
                      }`}
                    >
                      <pre
                        className={`text-xs font-mono whitespace-pre-wrap ${
                          result.status === 'passed'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {result.actualOutput}
                      </pre>
                    </Card>
                  </div>

                  {result.status === 'failed' && (
                    <div className="flex items-start gap-2 p-3 bg-red-950/20 border border-red-800 rounded-lg">
                      <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-red-300 text-sm">
                        Output does not match expected result
                      </p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
