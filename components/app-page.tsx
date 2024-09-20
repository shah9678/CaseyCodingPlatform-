"use client";

import { useState, useEffect } from "react";
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
import { Code2, BookOpen, Target, Sparkles } from "lucide-react";

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
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, goal, code, personality }),
    });
    const data = await response.json();
    setFeedback(data.feedback);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Personality-Based Coding Assistant
          </CardTitle>
          <CardDescription>
            Tailor your coding experience to your personality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="personality" className="text-lg font-semibold">
                  Choose Your Personality
                </Label>
                <Select
                  onValueChange={setPersonality}
                  defaultValue={personality}
                >
                  <SelectTrigger className="w-full mt-2">
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
                <Label htmlFor="topic" className="text-lg font-semibold">
                  What's Your Topic?
                </Label>
                <div className="flex items-center mt-2">
                  <BookOpen className="mr-2" />
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isStarted}
                    placeholder="e.g., React Hooks"
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="goal" className="text-lg font-semibold">
                What's Your Goal?
              </Label>
              <div className="flex items-center mt-2">
                <Target className="mr-2" />
                <Input
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  disabled={isStarted}
                  placeholder="e.g., Create a custom hook for form validation"
                />
              </div>
            </div>
            <Button
              onClick={startSession}
              disabled={isStarted || !topic || !goal}
              className="w-full py-6 text-lg font-semibold"
            >
              <Sparkles className="mr-2" />
              Start Your Personalized Coding Journey
            </Button>
          </div>
        </CardContent>
      </Card>
      {isStarted && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code2 className="mr-2" />
                Code Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MonacoEditor
                code={code}
                onChange={setCode}
                theme={theme.monacoTheme}
              />
            </CardContent>
          </Card>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2" />
                  Topic Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea value={topicInfo} readOnly className="h-40" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="mr-2" />
                  AI Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea value={feedback} readOnly className="h-40" />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
