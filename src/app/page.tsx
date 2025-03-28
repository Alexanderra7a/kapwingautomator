"use client";

import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import InputForm from "@/components/InputForm";
import ProcessingDashboard from "@/components/ProcessingDashboard";
import VerificationModal from "@/components/VerificationModal";
import DownloadOptions from "@/components/DownloadOptions";
import SignupForm, { SignupData } from "@/components/SignupForm";
import AccountInfo, { AccountDetails } from "@/components/AccountInfo";

type ProcessingStage = "input" | "signup" | "processing" | "download";

interface FormData {
  email: string;
  videoUrl: string;
  subtitleLanguage: string;
  dubbingLanguage: string;
}

export default function Home() {
  const { toast } = useToast();
  const [stage, setStage] = useState<ProcessingStage>("input");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    videoUrl: "",
    subtitleLanguage: "en",
    dubbingLanguage: "es",
  });
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(
    null,
  );
  const [kapwingProjectUrl, setKapwingProjectUrl] = useState("");

  const handleFormSubmit = (data: FormData) => {
    setIsLoading(true);
    setFormData(data);

    // Simulate API call to check if user exists
    setTimeout(() => {
      // Go directly to signup first
      setStage("signup");
      setIsLoading(false);
    }, 1000);
  };

  const handleSignupSubmit = async (data: SignupData) => {
    setIsLoading(true);

    try {
      // Import the Kapwing API functions dynamically to avoid server-side issues
      const { createKapwingAccount } = await import("@/lib/kapwing-api");

      // Make a real API call to create a Kapwing account
      const result = await createKapwingAccount(
        data.fullName,
        data.email,
        data.password,
      );

      if (result.success) {
        // Show verification modal after signup
        setIsVerificationModalOpen(true);

        // Store the form data for later use after verification
        setFormData((prev) => ({
          ...prev,
          email: data.email,
        }));

        toast({
          title: "Verification Required",
          description:
            "Please check your email for a verification code from Kapwing.",
        });
      } else {
        // Handle error from Kapwing API
        toast({
          title: "Account Creation Failed",
          description:
            result.error ||
            "Failed to create Kapwing account. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating Kapwing account:", error);
      toast({
        title: "Account Creation Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationComplete = async (code: string) => {
    try {
      // Import the Kapwing API functions dynamically
      const { verifyKapwingAccount } = await import("@/lib/kapwing-api");

      // Make a real API call to verify the Kapwing account
      const result = await verifyKapwingAccount(formData.email, code);

      if (result.success && result.data?.verified) {
        setIsVerificationModalOpen(false);

        // Create account details from verification response
        setAccountDetails({
          fullName: "Kapwing User", // We'd have this from the signup form
          email: formData.email,
          accountType: result.data.accountType as "free" | "pro" | "enterprise",
          creditsRemaining: result.data.credits,
          creditsTotal: result.data.maxCredits,
          memberSince: result.data.memberSince,
        });

        // Move to processing stage
        setStage("processing");

        toast({
          title: "Account Verified",
          description:
            "Your Kapwing account is now active. Processing has started.",
        });

        // Start processing the video
        startVideoProcessing();

        return true;
      } else {
        toast({
          title: "Verification Failed",
          description:
            result.error || "Invalid verification code. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error verifying Kapwing account:", error);
      toast({
        title: "Verification Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Function to start video processing with Kapwing
  const startVideoProcessing = async () => {
    try {
      // Import the Kapwing API functions dynamically
      const { processVideo } = await import("@/lib/kapwing-api");

      // Make a real API call to process the video
      const result = await processVideo(
        "user-id", // In a real implementation, this would come from the account creation response
        formData.videoUrl,
        formData.subtitleLanguage,
        formData.dubbingLanguage,
      );

      if (result.success) {
        // Store the Kapwing project URL for later use
        const projectId =
          result.data?.projectId || Math.random().toString(36).substring(2, 10);
        const newKapwingUrl = `https://www.kapwing.com/studio/editor/${projectId}`;
        setKapwingProjectUrl(newKapwingUrl);
      } else {
        toast({
          title: "Processing Error",
          description:
            result.error ||
            "Failed to start video processing. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error processing video:", error);
      toast({
        title: "Processing Error",
        description:
          "An unexpected error occurred while processing your video.",
        variant: "destructive",
      });
    }
  };

  const handleProcessingComplete = () => {
    // In a real implementation, this would be called when we receive a webhook from Kapwing
    // that the processing is complete
    setStage("download");
    toast({
      title: "Processing Complete",
      description: "Your video is ready for download!",
      variant: "default",
    });
  };

  const handleProcessingError = (error: string) => {
    toast({
      title: "Processing Error",
      description: error,
      variant: "destructive",
    });
  };

  const handleReset = () => {
    setStage("input");
  };

  const handleRenewCredits = () => {
    setIsVerificationModalOpen(true);
  };

  // Map language codes to full names for display
  const getLanguageName = (code: string): string => {
    const languageMap: Record<string, string> = {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      zh: "Chinese",
      ja: "Japanese",
      ko: "Korean",
      hi: "Hindi",
    };
    return languageMap[code] || code;
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto py-8 px-4 flex flex-col items-center justify-center">
        {stage === "input" && (
          <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        )}

        {stage === "signup" && (
          <SignupForm
            onSubmit={handleSignupSubmit}
            isLoading={isLoading}
            onCancel={handleReset}
          />
        )}

        {stage === "processing" && (
          <div className="w-full max-w-4xl">
            {accountDetails && (
              <div className="mb-6">
                <AccountInfo
                  accountDetails={accountDetails}
                  onRenewCredits={handleRenewCredits}
                />
              </div>
            )}
            <ProcessingDashboard
              email={formData.email}
              videoUrl={formData.videoUrl}
              subtitleLanguage={getLanguageName(formData.subtitleLanguage)}
              dubbingLanguage={getLanguageName(formData.dubbingLanguage)}
              onComplete={handleProcessingComplete}
              onError={handleProcessingError}
              estimatedTimeMinutes={5}
            />
          </div>
        )}

        {stage === "download" && (
          <DownloadOptions
            videoUrl={formData.videoUrl}
            subtitleLanguage={getLanguageName(formData.subtitleLanguage)}
            dubbingLanguage={getLanguageName(formData.dubbingLanguage)}
            isProcessingComplete={true}
            kapwingProjectUrl={kapwingProjectUrl}
          />
        )}

        {/* Back button when not on input stage */}
        {stage !== "input" && (
          <button
            onClick={handleReset}
            className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Start a new video processing task
          </button>
        )}
      </div>

      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onVerify={handleVerificationComplete}
        email={accountDetails?.email || formData.email}
      />

      <Toaster />
    </main>
  );
}
