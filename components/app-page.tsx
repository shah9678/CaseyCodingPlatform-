"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPersonalityTheme } from "@/lib/personalityThemes";
import {
  Code2,
  BookOpen,
  Target,
  Sparkles,
  Play,
  Sword,
  Shield,
  Trophy,
  Zap,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
} from "lucide-react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackTests,
} from "@codesandbox/sandpack-react";

export function Page() {
  const [topic, setTopic] = useState("");
  const [goal, setGoal] = useState("");
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [topicInfo, setTopicInfo] = useState("");
  const [personality, setPersonality] = useState("openness");
  const [theme, setTheme] = useState(getPersonalityTheme("openness"));
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [challenges, setChallenges] = useState<{description: string, test: string}[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [testFile, setTestFile] = useState("");
  const [genericFunction, setGenericFunction] = useState("");
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [health, setHealth] = useState(100);
  const [streak, setStreak] = useState(0);
  const [hint, setHint] = useState("");
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [hintRating, setHintRating] = useState<"liked" | "disliked" | null>(null);
  const previousCodeRef = useRef(code);

  useEffect(() => {
    setTheme(getPersonalityTheme(personality));
  }, [personality]);

  useEffect(() => {
    if (currentChallenge < challenges.length) {
      generateTestForChallenge(challenges[currentChallenge].description);
      setHint(""); // Clear hint when challenge changes
      setHintRating(null); // Reset rating
    }
  }, [currentChallenge, challenges]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && code !== previousCodeRef.current) {
      timer = setTimeout(() => {
        getFeedback();
        previousCodeRef.current = code;
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isStarted, code]);

  const startSession = async () => {
    if (!topic.trim() || !goal.trim()) return;
    
    try {
      const [info, challengesData] = await Promise.all([
        getTopicInfo(),
        getChallenges()
      ]);
      
      setTopicInfo(info);
      setChallenges(challengesData);
      setIsStarted(true);
      setXp(10);
      getFeedback();
    } catch (error) {
      console.error("Failed to start session:", error);
      setFeedback("Failed to start session. Please try again.");
    }
  };

  const getTopicInfo = async (): Promise<string> => {
    const response = await fetch("/api/topic-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, goal, personality }),
    });
    const data = await response.json();
    return data.info;
  };

  const getChallenges = async (): Promise<{description: string, test: string}[]> => {
    const response = await fetch("/api/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, goal, personality }),
    });
    const data = await response.json();
    return data.challenges.map((challenge: string) => ({
      description: challenge,
      test: "",
    }));
  };

  const getFeedback = async () => {
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, goal, code, personality }),
      });
      const data = await response.json();
      setFeedback(data.feedback);
      setIsHighlighted(true);
      setTimeout(() => setIsHighlighted(false), 1000);
      
      setXp(prev => {
        const newXp = prev + 5;
        if (newXp >= level * 100) {
          setLevel(prevLevel => prevLevel + 1);
          return 0;
        }
        return newXp;
      });
    } catch (error) {
      console.error("Failed to get feedback:", error);
      setFeedback("Failed to get feedback. Please try again.");
    }
  };

  const generateTestForChallenge = async (challenge: string) => {
    try {
      const response = await fetch("/api/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challenge, topic, goal, genericFunction }),
      });
      const data = await response.json();
      setTestFile(data.test);
    } catch (error) {
      console.error("Failed to generate test:", error);
      setFeedback("Failed to generate test for challenge.");
    }
  };

  const getHint = async () => {
    if (!challenges[currentChallenge]?.description) return;
    
    setIsHintLoading(true);
    try {
      const response = await fetch("/api/get-hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          challenge: challenges[currentChallenge].description,
          currentCode: code,
          topic,
          goal
        }),
      });
      const data = await response.json();
      setHint(data.hint);
      setHintRating(null); // Reset rating when new hint is fetched
      setXp(prev => prev - 5); // Deduct some XP for using a hint
    } catch (error) {
      console.error("Failed to get hint:", error);
      setHint("Failed to get hint. Please try again.");
    } finally {
      setIsHintLoading(false);
    }
  };

  const rateHint = (rating: "liked" | "disliked") => {
    setHintRating(rating);
    if (rating === "liked") {
      setXp(prev => prev + 3); // Small XP reward for rating
    }
    // You could send this feedback to your backend here
  };

  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setXp(prev => prev + 15);
      setStreak(prev => prev + 1);
    }
  };

  const prevChallenge = () => {
    if (currentChallenge > 0) {
      setCurrentChallenge(currentChallenge - 1);
      setHealth(prev => Math.max(0, prev - 10));
    }
  };

  const completeChallenge = () => {
    setXp(prev => prev + 50);
    setHealth(prev => Math.min(100, prev + 20));
    nextChallenge();
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Game Status Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-gray-800/80 rounded-lg border border-gray-700 backdrop-blur-sm gap-4 sm:gap-0">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Trophy className="text-yellow-400" size={20} />
            <span className="font-medium">Level {level}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative w-32 sm:w-40">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${(xp / (level * 100)) * 100}%` }}
                />
              </div>
              <span className="text-xs absolute -bottom-5 left-0">
                {xp}/{level * 100} XP
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Zap className="text-blue-400" size={20} />
            <span className="font-medium">Streak: {streak}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative w-32 sm:w-40">
              <div className="w-full bg-red-900/50 rounded-full h-2.5">
                <div 
                  className="bg-red-500 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${health}%` }}
                />
              </div>
              <span className="text-xs absolute -bottom-5 left-0">
                {health} HP
              </span>
            </div>
          </div>
        </div>
      </div>

      {!isStarted ? (
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-800/80 border-2 border-gray-700 shadow-xl backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center text-3xl font-bold text-white">
                <Sword className="mr-3 text-yellow-400" size={28} />
                Code Quest
                <Shield className="ml-3 text-blue-400" size={28} />
              </CardTitle>
              <CardDescription className="text-lg text-gray-300">
                Embark on a coding adventure! Choose your skills and conquer challenges.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="topic" className="text-gray-300 text-sm font-medium">
                    Your Quest Topic
                  </Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white h-12 focus-visible:ring-blue-500"
                    placeholder="What will you learn today?"
                  />
                </div>
                <div>
                  <Label htmlFor="goal" className="text-gray-300 text-sm font-medium">
                    Quest Objective
                  </Label>
                  <Input
                    id="goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white h-12 focus-visible:ring-blue-500"
                    placeholder="What do you want to achieve?"
                  />
                </div>
                <div>
                  <Label htmlFor="personality" className="text-gray-300 text-sm font-medium">
                    Adventurer Class
                  </Label>
                  <Select
                    value={personality}
                    onValueChange={(value) => setPersonality(value)}
                  >
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white h-12 focus:ring-blue-500">
                      <SelectValue placeholder="Select your class" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="openness" className="hover:bg-gray-700 focus:bg-gray-700">
                        <span className="text-purple-400">Explorer</span> (Openness)
                      </SelectItem>
                      <SelectItem value="conscientiousness" className="hover:bg-gray-700 focus:bg-gray-700">
                        <span className="text-blue-400">Strategist</span> (Conscientiousness)
                      </SelectItem>
                      <SelectItem value="extraversion" className="hover:bg-gray-700 focus:bg-gray-700">
                        <span className="text-yellow-400">Bard</span> (Extraversion)
                      </SelectItem>
                      <SelectItem value="agreeableness" className="hover:bg-gray-700 focus:bg-gray-700">
                        <span className="text-green-400">Healer</span> (Agreeableness)
                      </SelectItem>
                      <SelectItem value="neuroticism" className="hover:bg-gray-700 focus:bg-gray-700">
                        <span className="text-red-400">Survivor</span> (Neuroticism)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={startSession}
                  disabled={!topic.trim() || !goal.trim()}
                  className="w-full py-6 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="mr-2" size={20} />
                  Begin Adventure
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Challenges and Info */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="bg-gray-800/80 border-2 border-gray-700 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Target className="mr-2 text-red-400" size={20} />
                  Current Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 mb-4 min-h-40 text-gray-100">
                  {challenges[currentChallenge]?.description || "Loading challenge..."}
                </div>
                <div className="flex justify-between items-center">
                  <Button
                    onClick={prevChallenge}
                    disabled={currentChallenge === 0}
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-700/50"
                  >
                    <ChevronLeft className="mr-1" size={18} />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-400">
                    Challenge {currentChallenge + 1} of {challenges.length}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      onClick={nextChallenge}
                      disabled={currentChallenge === challenges.length - 1}
                      variant="outline"
                      className="border-gray-600 hover:bg-gray-700/50"
                    >
                      Skip
                      <ChevronRight className="ml-1" size={18} />
                    </Button>
                    <Button 
                      onClick={completeChallenge}
                      className="bg-green-600 hover:bg-green-700 shadow-md"
                    >
                      Complete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/80 border-2 border-gray-700 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <BookOpen className="mr-2 text-blue-400" size={20} />
                  Quest Journal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={topicInfo}
                  readOnly
                  className="h-96 bg-gray-700/50 border-gray-600 text-gray-100 font-mono text-sm"
                />
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Code Editor and Tests */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gray-800/80 border-2 border-gray-700 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Code2 className="mr-2 text-yellow-400" size={20} />
                  Code Forge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SandpackProvider
                  template="vanilla"
                  files={{
                    "/index.js": `// Generic function\n${genericFunction}\n\n// Your code\n${code}`,
                    "/index.test.js": testFile,
                  }}
                  customSetup={{
                    dependencies: {
                      jest: "^27.0.0",
                      "jest-extended": "^3.0.2",
                    },
                  }}
                >
                  <SandpackLayout className="h-full">
                    <SandpackCodeEditor
                      showTabs
                      showLineNumbers
                      showInlineErrors
                      wrapContent
                      onChange={(newCode) => {
                        const [newGenericFunction, newUserCode] =
                          newCode.split("// Your code");
                        setGenericFunction(newGenericFunction?.trim() || "");
                        setCode(newUserCode?.trim() || "");
                      }}
                      style={{ height: "400px" }}
                      options={{
                        showLineNumbers: true,
                        showInlineErrors: true,
                        wrapContent: true,
                      }}
                    />
                  </SandpackLayout>
                </SandpackProvider>
              </CardContent>
            </Card>

            {/* Challenge Tests */}
            <Card className="bg-gray-800/80 border-2 border-gray-700 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Shield className="mr-2 text-green-400" size={20} />
                  Challenge Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SandpackProvider
                  template="vanilla"
                  files={{
                    "/index.test.js": testFile,
                  }}
                  customSetup={{
                    dependencies: {
                      jest: "^27.0.0",
                      "jest-extended": "^3.0.2",
                    },
                  }}
                >
                  <SandpackLayout className="h-full">
                    <SandpackTests style={{ height: "200px" }} />
                  </SandpackLayout>
                </SandpackProvider>
              </CardContent>
            </Card>

            {/* New Hints Section */}
            <Card className="bg-gray-800/80 border-2 border-gray-700 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Lightbulb className="mr-2 text-yellow-400" size={20} />
                  Wizard's Hints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 min-h-32">
                  {hint ? (
                    <>
                      <div className="text-gray-100 mb-4">{hint}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">
                          Was this hint helpful?
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            variant={hintRating === "liked" ? "default" : "outline"}
                            className={`${hintRating === "liked" ? "bg-green-600 hover:bg-green-700" : ""}`}
                            onClick={() => rateHint("liked")}
                            size="sm"
                          >
                            <ThumbsUp className="mr-1" size={16} />
                            Yes
                          </Button>
                          <Button
                            variant={hintRating === "disliked" ? "default" : "outline"}
                            className={`${hintRating === "disliked" ? "bg-red-600 hover:bg-red-700" : ""}`}
                            onClick={() => rateHint("disliked")}
                            size="sm"
                          >
                            <ThumbsDown className="mr-1" size={16} />
                            No
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400 italic">
                      {isHintLoading ? "Summoning a hint from the wizard..." : "No hint requested yet. Click below to get a hint (costs 5 XP)."}
                    </div>
                  )}
                </div>
                <Button 
                  onClick={getHint}
                  disabled={isHintLoading || xp < 5}
                  className="mt-4 w-full bg-purple-600 hover:bg-purple-700 shadow-md"
                >
                  <Lightbulb className="mr-2" size={18} />
                  {isHintLoading ? "Loading Hint..." : "Get Hint (5 XP)"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Feedback */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/80 border-2 border-gray-700 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Sparkles className="mr-2 text-purple-400" size={20} />
                  Wizard's Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`h-96 bg-gray-700/50 p-4 rounded-lg border ${isHighlighted ? "border-yellow-400" : "border-gray-600"} overflow-y-auto font-mono text-sm text-gray-100 transition-all duration-300`}>
                  {feedback || "Your feedback will appear here as you code..."}
                </div>
                <Button 
                  onClick={getFeedback} 
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 shadow-md"
                >
                  Request Feedback
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}