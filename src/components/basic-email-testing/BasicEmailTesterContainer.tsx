
import { useState } from "react";
import { BasicEmailTestForm } from "./BasicEmailTestForm";
import { BasicEmailTestResults } from "./BasicEmailTestResults";
import { type BasicEmailTestResult } from "./types";

export const BasicEmailTesterContainer = () => {
  const [testResult, setTestResult] = useState<BasicEmailTestResult | null>(null);
  const [email, setEmail] = useState('');

  return (
    <div className="space-y-4">
      <BasicEmailTestForm 
        email={email} 
        setEmail={setEmail} 
        onResultsChange={setTestResult} 
      />
      <BasicEmailTestResults testResult={testResult} />
    </div>
  );
};
