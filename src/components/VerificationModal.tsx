"use client";

import React, { useState } from "react";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface VerificationModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onVerify?: (code: string) => Promise<boolean>;
  email?: string;
}

const VerificationModal = ({
  isOpen = true,
  onClose = () => {},
  onVerify = async () => true,
  email = "user@example.com",
}: VerificationModalProps) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // This will call the verifyKapwingAccount function in the parent component
      const result = await onVerify(verificationCode);

      if (result) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("An error occurred during verification. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Auto-focus the input field when modal opens
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const input = document.getElementById("verification-code-input");
        if (input) {
          input.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background sm:max-w-[450px]">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            Kapwing Email Verification
          </DialogTitle>
          <DialogDescription className="text-center">
            We've sent a verification code to{" "}
            <span className="font-medium">{email}</span>. Please enter the code
            below to activate your Kapwing account.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <Input
            id="verification-code-input"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="text-center text-lg tracking-wider"
            maxLength={6}
            disabled={isVerifying || success}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !isVerifying &&
                !success &&
                verificationCode.trim()
              ) {
                handleVerify();
              }
            }}
          />

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-green-500 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Verification successful! Your account is now active.</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleVerify}
            disabled={isVerifying || success || !verificationCode.trim()}
            className="w-full"
          >
            {isVerifying
              ? "Verifying..."
              : success
                ? "Verified!"
                : "Verify Code"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationModal;
