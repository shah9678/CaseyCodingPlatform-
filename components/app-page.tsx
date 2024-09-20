"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
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
import { Code2, BookOpen, Target, Sparkles, Play } from "lucide-react";

const MonacoEditor = dynamic(() => import("@/components/MonacoEditor"), {
  ssr: false,
});

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
  const [output, setOutput] = useState("");
  const previousCodeRef = useRef(code);

  useEffect(() => {
    if (isStarted) {
      const timer = setInterval(() => {
        getFeedback();
      }, 5000); // Get feedback every 5 seconds

      return () => clearInterval(timer);
    }
  }, [isStarted, code]);

  useEffect(() => {
    setTheme(getPersonalityTheme(personality));
  }, [personality]);

  const startSession = async () => {
    if (topic && goal) {
      const info = await getTopicInfo();
      setTopicInfo(info);
      setIsStarted(true);
      getFeedback();
    }
  };

  const getTopicInfo = async () => {
    const response = await fetch("/api/topic-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, goal, personality }),
    });
    const data = await response.json();
    return data.info;
  };

  const getFeedback = async () => {
    if (code !== previousCodeRef.current) {
      setIsHighlighted(true);
      setTimeout(() => {
        setIsHighlighted(false);
      }, 2000);
      previousCodeRef.current = code;
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, goal, code, personality }),
      });
      const data = await response.json();
      setFeedback(data.feedback);
    }
  };

  const runCode = () => {
    try {
      // Create a new Function from the code string and execute it
      const result = new Function(code)();
      setOutput(String(result));
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div className={`min-h-screen p-8 ${theme.background}`}>
      <Card className={`max-w-6xl mx-auto ${theme.cardBackground} shadow-lg`}>
        <CardContent>
          <div className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label
                  htmlFor="personality"
                  className={`text-lg font-semibold ${theme.text}`}
                >
                  Choose Your Personality
                </Label>
                <Select
                  onValueChange={setPersonality}
                  defaultValue={personality}
                >
                  <SelectTrigger className={`w-full mt-2 ${theme.input}`}>
                    <SelectValue placeholder="Select a personality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openness">Openness</SelectItem>
                    <SelectItem value="conscientiousness">
                      Conscientiousness
                    </SelectItem>
                    <SelectItem value="extraversion">Extraversion</SelectItem>
                    <SelectItem value="agreeableness">Agreeableness</SelectItem>
                    <SelectItem value="neuroticism">Neuroticism</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="topic"
                  className={`text-lg font-semibold ${theme.text}`}
                >
                  What's Your Topic?
                </Label>
                <div className="flex items-center mt-2">
                  <BookOpen className={`mr-2 ${theme.accent}`} />
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isStarted}
                    placeholder="e.g., React Hooks"
                    className={theme.input}
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="goal"
                  className={`text-lg font-semibold ${theme.text}`}
                >
                  What's Your Goal?
                </Label>
                <div className="flex items-center mt-2">
                  <Target className={`mr-2 ${theme.accent}`} />
                  <Input
                    id="goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    disabled={isStarted}
                    placeholder="e.g., Create a custom hook"
                    className={theme.input}
                  />
                </div>
              </div>
            </div>
            <Button
              onClick={startSession}
              disabled={isStarted || !topic || !goal}
              className={`w-full py-6 text-lg font-medium ${theme.button}`}
            >
              <Sparkles className="mr-2" />
              Start
            </Button>
          </div>
        </CardContent>
      </Card>
      {isStarted && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-8">
            <Card className={`${theme.cardBackground} shadow-lg`}>
              <CardHeader>
                <CardTitle className={`flex items-center ${theme.text}`}>
                  <Code2 className={`mr-2 ${theme.accent}`} />
                  Code Editor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MonacoEditor
                  code={code}
                  onChange={setCode}
                  theme={theme.monacoTheme}
                />
                <Button onClick={runCode} className={`mt-4 ${theme.button}`}>
                  <Play className="mr-2" />
                  Run Code
                </Button>
              </CardContent>
            </Card>
            <Card className={`${theme.cardBackground} shadow-lg`}>
              <CardHeader>
                <CardTitle className={`flex items-center ${theme.text}`}>
                  <BookOpen className={`mr-2 ${theme.accent}`} />
                  Output
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre
                  className={`p-4 rounded-lg ${theme.textarea} min-h-[100px]`}
                >
                  {output}
                </pre>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card className={`${theme.cardBackground} shadow-lg`}>
              <CardHeader>
                <CardTitle className={`flex items-center ${theme.text}`}>
                  <BookOpen className={`mr-2 ${theme.accent}`} />
                  Topic Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={topicInfo}
                  readOnly
                  className={`h-40 ${theme.textarea}`}
                />
              </CardContent>
            </Card>
            <Card className={`${theme.cardBackground} shadow-lg`}>
              <CardHeader>
                <CardTitle className={`flex items-center ${theme.text}`}>
                  <Sparkles className={`mr-2 ${theme.accent}`} />
                  Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={feedback}
                  readOnly
                  className={`h-96 ${theme.textarea} ${
                    isHighlighted ? "animate-pulse" : ""
                  }`}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
