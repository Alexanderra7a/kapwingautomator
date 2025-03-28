"use client";

import React from "react";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";
import { Video } from "lucide-react";

interface HeaderProps {
  title?: string;
}

const Header = ({ title = "TempoLabs AI Video Editor" }: HeaderProps) => {
  return (
    <header className="w-full h-20 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground">
          <Video size={24} />
        </div>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm">
          Documentation
        </Button>
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;
