"use client"; // Ensure this is a client component

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function StartupIdeaValidator() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateIdea = async () => {
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong. Please try again.");
      } else {
        setResult(data.message);
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Startup Idea Validator</CardTitle>
        <CardDescription>Enter your startup idea and get instant feedback</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe your startup idea here..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={5}
        />
        <Button onClick={validateIdea}>Validate Idea</Button>
        {result && (
          <Alert>
            <AlertTitle>Validation Result</AlertTitle>
            <AlertDescription>{result}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Remember, this is a simple validator. Thorough market research is essential for any startup idea.
      </CardFooter>
    </Card>
  );
}
