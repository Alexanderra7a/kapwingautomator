"use client";

import React from "react";
import {
  Download,
  Film,
  Subtitles,
  Languages,
  ExternalLink,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";

interface DownloadOptionsProps {
  videoUrl?: string;
  subtitleLanguage?: string;
  dubbingLanguage?: string;
  isProcessingComplete?: boolean;
  kapwingProjectUrl?: string;
}

const DownloadOptions = ({
  videoUrl = "https://example.com/video.mp4",
  subtitleLanguage = "English",
  dubbingLanguage = "Spanish",
  isProcessingComplete = true,
  kapwingProjectUrl = "https://www.kapwing.com/studio/editor",
}: DownloadOptionsProps) => {
  // In a real implementation, these would be actual download URLs from Kapwing
  const getDownloadUrl = (type: string) => {
    // This would normally come from the Kapwing API response
    const projectId = kapwingProjectUrl.split("/").pop() || "";
    return `https://api.kapwing.com/v1/videos/download/${projectId}?type=${type}&url=${encodeURIComponent(videoUrl)}`;
  };

  const openKapwingProject = () => {
    window.open(kapwingProjectUrl, "_blank");
  };

  return (
    <div className="w-full max-w-[600px] mx-auto bg-background p-6 rounded-lg">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Download Options</CardTitle>
          <CardDescription>
            Your video has been processed successfully. Choose your preferred
            download option below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isProcessingComplete ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground text-center">
                Processing is still in progress. Download options will be
                available once complete.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/30">
                <div className="flex items-center gap-3 mb-2">
                  <Film className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Original Video</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3 pl-8">
                  Download the original video without any modifications.
                </p>
                <div className="pl-8">
                  <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download Original
                    </Button>
                  </a>
                </div>
              </div>

              <div className="p-4 border rounded-md bg-muted/30">
                <div className="flex items-center gap-3 mb-2">
                  <Subtitles className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Video with Subtitles</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3 pl-8">
                  Download the video with {subtitleLanguage} subtitles.
                </p>
                <div className="pl-8">
                  <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download with Subtitles
                    </Button>
                  </a>
                </div>
              </div>

              <div className="p-4 border rounded-md bg-muted/30">
                <div className="flex items-center gap-3 mb-2">
                  <Languages className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Dubbed Video</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3 pl-8">
                  Download the video dubbed in {dubbingLanguage}.
                </p>
                <div className="pl-8">
                  <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download Dubbed Version
                    </Button>
                  </a>
                </div>
              </div>

              <div className="p-4 border rounded-md bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-2">
                  <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-medium">Edit in Kapwing</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3 pl-8">
                  Open this project directly in Kapwing for additional editing
                  options.
                </p>
                <div className="pl-8">
                  <a
                    href={kapwingProjectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open in Kapwing
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
          >
            Back to Dashboard
          </Button>
          <a href={videoUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              disabled={!isProcessingComplete}
            >
              <Download className="h-4 w-4" />
              Download All Versions
            </Button>
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DownloadOptions;
