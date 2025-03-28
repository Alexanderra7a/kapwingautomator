"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Globe, Video, Mail, ArrowRight } from "lucide-react";

interface InputFormProps {
  onSubmit?: (data: FormData) => void;
  isLoading?: boolean;
}

interface FormData {
  email: string;
  videoUrl: string;
  subtitleLanguage: string;
  dubbingLanguage: string;
}

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "hi", label: "Hindi" },
];

const InputForm = ({ onSubmit, isLoading = false }: InputFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    videoUrl: "",
    subtitleLanguage: "en",
    dubbingLanguage: "es",
  });

  const [errors, setErrors] = useState({
    email: "",
    videoUrl: "",
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user types
    if (errors[field as "email" | "videoUrl"]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", videoUrl: "" };

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    // Video URL validation
    if (!formData.videoUrl) {
      newErrors.videoUrl = "Video URL is required";
      valid = false;
    } else if (!formData.videoUrl.startsWith("http")) {
      newErrors.videoUrl = "Please enter a valid URL";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm() && onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="w-full max-w-[600px] bg-card shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          TempoLabs AI Video Editor
        </CardTitle>
        <CardDescription>
          Enter your details below to automatically generate subtitles and dub
          your video
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={cn(errors.email && "border-destructive")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Video URL
            </Label>
            <Input
              id="videoUrl"
              type="url"
              placeholder="https://example.com/your-video"
              value={formData.videoUrl}
              onChange={(e) => handleChange("videoUrl", e.target.value)}
              className={cn(errors.videoUrl && "border-destructive")}
            />
            {errors.videoUrl && (
              <p className="text-sm text-destructive">{errors.videoUrl}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="subtitleLanguage"
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                Subtitle Language
              </Label>
              <Select
                value={formData.subtitleLanguage}
                onValueChange={(value) =>
                  handleChange("subtitleLanguage", value)
                }
              >
                <SelectTrigger id="subtitleLanguage">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="dubbingLanguage"
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                Dubbing Language
              </Label>
              <Select
                value={formData.dubbingLanguage}
                onValueChange={(value) =>
                  handleChange("dubbingLanguage", value)
                }
              >
                <SelectTrigger id="dubbingLanguage">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <span className="mr-2">Processing</span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            </>
          ) : (
            <>
              Process Video <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InputForm;
