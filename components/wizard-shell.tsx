"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardStep {
  title: string;
  description?: string;
  content: React.ReactNode;
}

interface WizardShellProps {
  steps: WizardStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onNext?: () => void;
  onBack?: () => void;
  onFinish?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function WizardShell({
  steps,
  currentStep,
  onStepChange,
  onNext,
  onBack,
  onFinish,
  isLoading = false,
  className,
}: WizardShellProps) {
  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (isLastStep) {
      onFinish?.();
    } else {
      onNext?.();
      onStepChange(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      onBack?.();
      onStepChange(currentStep - 1);
    }
  };

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      <Card>
        <CardHeader>
          <div className="space-y-2">
            <CardTitle>{currentStepData.title}</CardTitle>
            {currentStepData.description && (
              <p className="text-sm text-muted-foreground">
                {currentStepData.description}
              </p>
            )}
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {currentStepData.content}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isFirstStep || isLoading}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={isLoading}>
                {isLastStep ? "Finish" : "Next"}
                {!isLastStep && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

