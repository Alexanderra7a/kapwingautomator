"use client";

import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ProcessingStep {
  id: string;
  name: string;
  status: "pending" | "processing" | "completed" | "error";
  progress: number;
  message?: string;
}

interface ProcessingDashboardProps {
  email?: string;
  videoUrl?: string;
  subtitleLanguage?: string;
  dubbingLanguage?: string;
  onComplete?: () => void;
  onError?: (error: string) => void;
  estimatedTimeMinutes?: number;
}

const ProcessingDashboard = ({
  email = "user@example.com",
  videoUrl = "https://example.com/sample-video.mp4",
  subtitleLanguage = "English",
  dubbingLanguage = "Spanish",
  onComplete = () => {},
  onError = () => {},
  estimatedTimeMinutes = 5,
}: ProcessingDashboardProps) => {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: "account", name: "Account Setup", status: "pending", progress: 0 },
    { id: "video", name: "Video Processing", status: "pending", progress: 0 },
    {
      id: "subtitles",
      name: "Subtitle Generation",
      status: "pending",
      progress: 0,
    },
    { id: "dubbing", name: "Audio Dubbing", status: "pending", progress: 0 },
  ]);

  const [overallProgress, setOverallProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(estimatedTimeMinutes * 60);
  const [isComplete, setIsComplete] = useState(false);

  // Simulate processing progress
  useEffect(() => {
    if (isComplete) return;

    const interval = setInterval(() => {
      setSteps((prevSteps) => {
        const newSteps = [...prevSteps];
        let allComplete = true;

        // Update each step
        for (let i = 0; i < newSteps.length; i++) {
          // Only process this step if previous steps are complete
          const canProcess = i === 0 || newSteps[i - 1].status === "completed";

          if (
            canProcess &&
            newSteps[i].status !== "completed" &&
            newSteps[i].status !== "error"
          ) {
            if (newSteps[i].status === "pending") {
              newSteps[i].status = "processing";
            }

            if (newSteps[i].progress < 100) {
              // Random progress increment between 5-15%
              const increment = Math.floor(Math.random() * 10) + 5;
              newSteps[i].progress = Math.min(
                100,
                newSteps[i].progress + increment,
              );
              allComplete = false;
            } else {
              newSteps[i].status = "completed";
            }
          }

          if (newSteps[i].status !== "completed") {
            allComplete = false;
          }
        }

        // Randomly simulate an error (uncomment for testing)
        // if (Math.random() < 0.01) {
        //   const randomStep = Math.floor(Math.random() * newSteps.length);
        //   if (newSteps[randomStep].status === "processing") {
        //     newSteps[randomStep].status = "error";
        //     newSteps[randomStep].message = "Connection timeout. Retrying...";
        //     allComplete = false;
        //   }
        // }

        if (allComplete) {
          setIsComplete(true);
          onComplete();
          clearInterval(interval);
        }

        return newSteps;
      });

      // Update overall progress
      setOverallProgress((prev) => {
        const newProgress = Math.min(99, prev + 1);
        return isComplete ? 100 : newProgress;
      });

      // Update time remaining
      setTimeRemaining((prev) => {
        const newTime = Math.max(0, prev - 1);
        return isComplete ? 0 : newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isComplete, onComplete]);

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "processing":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
          >
            Completed
          </Badge>
        );
      case "error":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
          >
            Error
          </Badge>
        );
      case "processing":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
          >
            Processing
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
          >
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-950 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Processing Your Video</h2>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isComplete
              ? "Processing complete!"
              : `Estimated time remaining: ${formatTime(timeRemaining)}`}
          </p>
          <p className="text-sm font-medium">{Math.round(overallProgress)}%</p>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Processing Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(step.status)}
                      <span className="font-medium">{step.name}</span>
                    </div>
                    {getStatusBadge(step.status)}
                  </div>
                  <Progress value={step.progress} className="h-1.5" />
                  {step.message && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {step.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Video Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="text-sm truncate">{email}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Video URL
                </p>
                <p className="text-sm truncate">{videoUrl}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Subtitle Language
                  </p>
                  <p className="text-sm">{subtitleLanguage}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Dubbing Language
                  </p>
                  <p className="text-sm">{dubbingLanguage}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isComplete && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <p className="font-medium text-green-800 dark:text-green-200">
              Processing complete! Your video is ready for download.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingDashboard;
