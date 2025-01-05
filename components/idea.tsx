'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function StartupIdeaValidator() {
  const [idea, setIdea] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const validateIdea = async () => {
    setError(null)
    setResult(null)
    setIsLoading(true)

    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Something went wrong. Please try again.")
      } else {
        setResult(data.message)
      }
    } catch (err) {
      setError("Network error. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-white p-4"
    >
      <Card className="w-full max-w-2xl mx-auto bg-white text-black border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">Startup Idea Validator</CardTitle>
          <CardDescription className="text-center text-gray-600">Enter your startup idea and get instant feedback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea
            placeholder="Describe your startup idea here..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={5}
            className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 transition-colors"
          />
          <Button 
            onClick={validateIdea} 
            disabled={isLoading || idea.trim().length === 0}
            className="w-full bg-black text-white hover:bg-black"
          >
            {isLoading ? "Validating..." : "Validate Idea"}
          </Button>
          <AnimatedAlert show={result !== null} variant="success">
            <AlertTitle className="text-green-800">Validation Result</AlertTitle>
            <AlertDescription>
              <ReactMarkdown 
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-2 text-gray-800" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mb-2 text-gray-800" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-lg font-medium mb-2 text-gray-800" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-2 text-gray-700" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2 text-gray-700" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2 text-gray-700" {...props} />,
                  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                  a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                }}
              >
                {result || ''}
              </ReactMarkdown>
            </AlertDescription>
          </AnimatedAlert>
          <AnimatedAlert show={error !== null} variant="error">
            <AlertTitle className="text-red-800">Error</AlertTitle>
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </AnimatedAlert>
        </CardContent>
        <CardFooter className="text-sm text-gray-500 text-center">
          Remember, this is a simple validator. Thorough market research is essential for any startup idea.
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function AnimatedAlert({ children, show, variant }: { children: React.ReactNode, show: boolean, variant: 'success' | 'error' }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: show ? 1 : 0, height: show ? 'auto' : 0 }}
      transition={{ duration: 0.3 }}
    >
      <Alert className={`${variant === 'success' ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'} text-gray-800`}>
        {children}
      </Alert>
    </motion.div>
  )
}

