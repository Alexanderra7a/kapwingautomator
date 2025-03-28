"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { User, CreditCard, Clock, RefreshCw } from "lucide-react";

export interface AccountDetails {
  fullName: string;
  email: string;
  accountType: "free" | "pro" | "enterprise";
  creditsRemaining: number;
  creditsTotal: number;
  memberSince: string;
}

interface AccountInfoProps {
  accountDetails: AccountDetails;
  onRenewCredits?: () => void;
}

const AccountInfo = ({
  accountDetails = {
    fullName: "John Doe",
    email: "john.doe@example.com",
    accountType: "free" as const,
    creditsRemaining: 3,
    creditsTotal: 10,
    memberSince: "June 2023",
  },
  onRenewCredits,
}: AccountInfoProps) => {
  const getAccountTypeBadge = (type: string) => {
    switch (type) {
      case "pro":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            Pro
          </Badge>
        );
      case "enterprise":
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
            Enterprise
          </Badge>
        );
      default:
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Free
          </Badge>
        );
    }
  };

  const creditPercentage = Math.round(
    (accountDetails.creditsRemaining / accountDetails.creditsTotal) * 100,
  );

  return (
    <Card className="w-full bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Kapwing Account</CardTitle>
          {getAccountTypeBadge(accountDetails.accountType)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{accountDetails.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {accountDetails.email}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Processing Credits</span>
              </div>
              <span className="text-sm">
                {accountDetails.creditsRemaining} /{" "}
                {accountDetails.creditsTotal}
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${creditPercentage}%` }}
              ></div>
            </div>
            {accountDetails.creditsRemaining < 3 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 gap-2"
                onClick={onRenewCredits}
              >
                <RefreshCw className="h-3 w-3" /> Renew Credits
              </Button>
            )}
          </div>

          <Separator />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Member Since</span>
            </div>
            <span>{accountDetails.memberSince}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountInfo;
