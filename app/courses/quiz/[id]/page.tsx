"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Clock,
  Flag,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  AlertCircle,
  CheckCircle,
  XCircle,
  Volume2,
  Maximize,
  Eye,
  ArrowLeft,
  Brain,
  BarChart,
  Book,
  Star,
  Save,
  AlertTriangle,
  FileText,
  Settings,
  MessageSquare
} from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock quiz data
const quiz = {
  id: 1,
  title: "Digital Marketing Fundamentals",
  course: "Digital Marketing Mastery",
  module: "Introduction to Digital Marketing",
  duration: 30, // minutes
  totalQuestions: 20,
  passingScore: 70,
  instructions: [
    "You have 30 minutes to complete this quiz",
    "You can flag questions to review later",
    "You can use the scratch pad for calculations",
    "Submit before time expires to save your answers"
  ],
  questions: [
    {
      id: 1,
      type: "multiple-choice",
      question: "What is the primary advantage of digital marketing over traditional marketing in African markets?",
      options: [
        "Lower cost per reach",
        "Better targeting capabilities",
        "Easier to measure ROI",
        "All of the above"
      ],
      correctAnswer: 3,
      explanation: "Digital marketing offers all these advantages, making it particularly effective in African markets where mobile penetration is high and traditional media might be costly or limited in reach.",
      difficulty: "medium",
      points: 5
    },
    {
      id: 2,
      type: "multiple-select",
      question: "Which of the following are key metrics for social media marketing? (Select all that apply)",
      options: [
        "Engagement rate",
        "Reach and impressions",
        "Click-through rate",
        "Server uptime"
      ],
      correctAnswers: [0, 1, 2],
      explanation: "Engagement rate, reach and impressions, and click-through rate are all important metrics for measuring social media marketing success.",
      difficulty: "hard",
      points: 10
    }
    // More questions would be added here
  ]
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{[key: number]: number | number[]}>({})
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60) // Convert to seconds
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [scratchPad, setScratchPad] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [confidenceLevel, setConfidenceLevel] = useState<{[key: number]: number}>({})
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    if (!isSubmitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit()
    }
  }, [timeLeft, isSubmitted])

  // Auto-save answers every 30 seconds
  useEffect(() => {
    if (!isSubmitted) {
      const autoSaveInterval = setInterval(() => {
        setIsAutoSaving(true)
        // Simulate saving to backend
        setTimeout(() => {
          setIsAutoSaving(false)
          setLastSaved(new Date())
        }, 1000)
      }, 30000)

      return () => clearInterval(autoSaveInterval)
    }
  }, [isSubmitted])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleAnswer = (questionId: number, answer: number | number[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const toggleFlaggedQuestion = (questionId: number) => {
    setFlaggedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    )
  }

  const handleConfidenceLevel = (questionId: number, level: number) => {
    setConfidenceLevel(prev => ({
      ...prev,
      [questionId]: level
    }))
  }

  const calculateScore = () => {
    let totalPoints = 0
    let earnedPoints = 0
    
    quiz.questions.forEach(question => {
      totalPoints += question.points
      const answer = answers[question.id]
      
      if (question.type === "multiple-choice") {
        if (answer === question.correctAnswer) {
          earnedPoints += question.points
        }
      } else if (question.type === "multiple-select") {
        const selectedAnswers = answer as number[]
        if (
          selectedAnswers &&
          selectedAnswers.length === question.correctAnswers.length &&
          selectedAnswers.every(a => question.correctAnswers.includes(a))
        ) {
          earnedPoints += question.points
        }
      }
    })
    
    return (earnedPoints / totalPoints) * 100
  }

  const handleSubmit = () => {
    setShowConfirmDialog(true)
  }

  const confirmSubmit = () => {
    setIsSubmitted(true)
    setShowResults(true)
    setShowConfirmDialog(false)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const readQuestionAloud = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {!showResults ? (
            <>
              {/* Quiz Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Link href="/courses" className="hover:text-foreground">Courses</Link>
                  <ChevronRight className="h-4 w-4" />
                  <Link href={`/courses/${quiz.course}`} className="hover:text-foreground">
                    {quiz.course}
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                  <span>{quiz.module}</span>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
                    <p className="text-muted-foreground">
                      Question {currentQuestion + 1} of {quiz.totalQuestions}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        timeLeft < 300 ? 'text-red-500' : 'text-orange-500'
                      }`}>
                        {formatTime(timeLeft)}
                      </div>
                      <div className="text-sm text-muted-foreground">Time Left</div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleFullscreen}
                    >
                      <Maximize className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <Progress
                  value={((currentQuestion + 1) / quiz.totalQuestions) * 100}
                  className="mb-4"
                />

                {/* Auto-save Status */}
                <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                  {isAutoSaving ? (
                    <span className="flex items-center gap-1">
                      <Save className="h-4 w-4 animate-spin" />
                      Saving...
                    </span>
                  ) : lastSaved && (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Last saved {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Question Area */}
                <div className="md:col-span-2 space-y-8">
                  <Card className="p-6">
                    <div className="flex justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFlaggedQuestion(quiz.questions[currentQuestion].id)}
                        >
                          <Flag
                            className={`h-5 w-5 ${
                              flaggedQuestions.includes(quiz.questions[currentQuestion].id)
                                ? "text-orange-500 fill-current"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {flaggedQuestions.includes(quiz.questions[currentQuestion].id)
                            ? "Flagged for review"
                            : "Flag this question"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => readQuestionAloud(quiz.questions[currentQuestion].question)}
                        >
                          <Volume2 className="h-4 w-4 mr-2" />
                          Read Question
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                          {quiz.questions[currentQuestion].question}
                        </h2>
                        <span className="text-sm text-muted-foreground">
                          {quiz.questions[currentQuestion].points} points
                        </span>
                      </div>

                      {quiz.questions[currentQuestion].type === "multiple-choice" ? (
                        <div className="space-y-4">
                          {quiz.questions[currentQuestion].options.map((option, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                                answers[quiz.questions[currentQuestion].id] === index
                                  ? "border-primary bg-primary/5"
                                  : "hover:border-primary/50"
                              }`}
                              onClick={() => handleAnswer(quiz.questions[currentQuestion].id, index)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  answers[quiz.questions[currentQuestion].id] === index
                                    ? "border-primary"
                                    : "border-muted-foreground"
                                }`}>
                                  {answers[quiz.questions[currentQuestion].id] === index && (
                                    <div className="w-3 h-3 rounded-full bg-primary" />
                                  )}
                                </div>
                                <span>{option}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {quiz.questions[currentQuestion].options.map((option, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                                (answers[quiz.questions[currentQuestion].id] as number[] || []).includes(index)
                                  ? "border-primary bg-primary/5"
                                  : "hover:border-primary/50"
                              }`}
                              onClick={() => {
                                const currentAnswers = (answers[quiz.questions[currentQuestion].id] as number[] || [])
                                handleAnswer(
                                  quiz.questions[currentQuestion].id,
                                  currentAnswers.includes(index)
                                    ? currentAnswers.filter(a => a !== index)
                                    : [...currentAnswers, index]
                                )
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={(answers[quiz.questions[currentQuestion].id] as number[] || []).includes(index)}
                                />
                                <span>{option}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Confidence Level */}
                      <div className="mt-8">
                        <Label className="mb-2">How confident are you about your answer?</Label>
                        <div className="flex gap-2">
                          {[1, 2, 3].map((level) => (
                            <Button
                              key={level}
                              variant={confidenceLevel[quiz.questions[currentQuestion].id] === level ? "default" : "outline"}
                              onClick={() => handleConfidenceLevel(quiz.questions[currentQuestion].id, level)}
                            >
                              {level === 1 ? "Not Sure" : level === 2 ? "Somewhat Sure" : "Very Sure"}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestion(prev => prev - 1)}
                      disabled={currentQuestion === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    {currentQuestion === quiz.questions.length - 1 ? (
                      <Button
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length < quiz.questions.length}
                      >
                        Submit Quiz
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentQuestion(prev => prev + 1)}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Question Navigator */}
                  <Card className="p-6">
                    <h2 className="font-semibold mb-4">Question Navigator</h2>
                    <div className="grid grid-cols-5 gap-2">
                      {quiz.questions.map((_, index) => (
                        <Button
                          key={index}
                          variant={currentQuestion === index ? "default" : "outline"}
                          className={`relative ${
                            answers[quiz.questions[index].id] !== undefined
                              ? "bg-accent"
                              : ""
                          }`}
                          onClick={() => setCurrentQuestion(index)}
                        >
                          {index + 1}
                          {flaggedQuestions.includes(quiz.questions[index].id) && (
                            <Flag className="absolute -top-2 -right-2 h-4 w-4 text-orange-500" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </Card>

                  {/* Quiz Progress */}
                  <Card className="p-6">
                    <h2 className="font-semibold mb-4">Quiz Progress</h2>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Questions Answered</span>
                          <span className="text-sm font-medium">
                            {Object.keys(answers).length}/{quiz.questions.length}
                          </span>
                        </div>
                        <Progress
                          value={(Object.keys(answers).length / quiz.questions.length) * 100}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Questions Flagged</span>
                          <span className="text-sm font-medium">
                            {flaggedQuestions.length}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Time Remaining</span>
                          <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
                        </div>
                        <Progress
                          value={(timeLeft / (quiz.duration * 60)) * 100}
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Scratch Pad */}
                  <Card className="p-6">
                    <h2 className="font-semibold mb-4">Scratch Pad</h2>
                    <textarea
                      className="w-full h-32 p-2 border rounded-md"
                      placeholder="Use this space for notes and calculations..."
                      value={scratchPad}
                      onChange={(e) => setScratchPad(e.target.value)}
                    />
                  </Card>

                  {/* Help & Accessibility */}
                  <Card className="p-6">
                    <h2 className="font-semibold mb-4">Help & Accessibility</h2>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Eye className="h-4 w-4 mr-2" />
                        Increase Font Size
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Volume2 className="h-4 w-4 mr-2" />
                        Enable Screen Reader
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Get Help
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            // Results View
            <div className="max-w-3xl mx-auto">
              <Card className="p-8">
                <div className="text-center mb-8">
                  {calculateScore() >= quiz.passingScore ? (
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-green-500 mb-2">
                        Congratulations!
                      </h2>
                      <p className="text-muted-foreground">
                        You've passed the quiz with a score of {calculateScore().toFixed(1)}%
                      </p>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-8 w-8 text-orange-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-orange-500 mb-2">
                        Keep Learning
                      </h2>
                      <p className="text-muted-foreground">
                        You scored {calculateScore().toFixed(1)}%. The passing score is {quiz.passingScore}%
                      </p>
                    </div>
                  )}

                  {/* Performance Breakdown */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-accent rounded-lg">
                      <Brain className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">
                        {Object.keys(answers).length}/{quiz.questions.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Questions Answered
                      </div>
                    </div>
                    <div className="p-4 bg-accent rounded-lg">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">
                        {formatTime((quiz.duration * 60) - timeLeft)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Time Taken
                      </div>
                    </div>
                    <div className="p-4 bg-accent rounded-lg">
                      <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">
                        {Object.values(confidenceLevel).reduce((a, b) => a + b, 0) / Object.keys(confidenceLevel).length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Avg. Confidence
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 justify-center">
                    <Button variant="outline" asChild>
                      <Link href={`/courses/${quiz.course}`}>
                        Return to Course
                      </Link>
                    </Button>
                    <Button onClick={() => setShowExplanation(!showExplanation)}>
                      {showExplanation ? "Hide" : "Show"} Explanations
                    </Button>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="mt-12">
                  <h3 className="text-xl font-semibold mb-6">Performance Analysis</h3>
                  <div className="space-y-6">
                    {quiz.questions.map((question, index) => (
                      <Card key={index} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-medium mb-2">Question {index + 1}</h4>
                            <p className="text-muted-foreground">{question.question}</p>
                          </div>
                          {answers[question.id] === question.correctAnswer ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-500" />
                          )}
                        </div>
                        {showExplanation && (
                          <div className="mt-4 p-4 bg-accent rounded-lg">
                            <p className="text-sm">{question.explanation}</p>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-12">
                  <h3 className="text-xl font-semibold mb-6">Recommended Next Steps</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6">
                      <Book className="h-6 w-6 text-primary mb-4" />
                      <h4 className="font-medium mb-2">Review Materials</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Focus on the topics where you scored lower to improve your understanding.
                      </p>
                      <Button variant="outline" className="w-full">
                        Access Study Materials
                      </Button>
                    </Card>
                    <Card className="p-6">
                      <BarChart className="h-6 w-6 text-primary mb-4" />
                      <h4 className="font-medium mb-2">Practice Exercises</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Complete additional exercises to reinforce your learning.
                      </p>
                      <Button variant="outline" className="w-full">
                        Start Practice
                      </Button>
                    </Card>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Quiz?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground mb-4">
              Are you sure you want to submit your quiz? This action cannot be undone.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Questions Answered</span>
                <span>{Object.keys(answers).length}/{quiz.questions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Questions Flagged</span>
                <span>{flaggedQuestions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Time Remaining</span>
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Continue Quiz
            </Button>
            <Button onClick={confirmSubmit}>
              Submit Quiz
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}