import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "full" | "emblem" | "text";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Logo({ variant = "full", size = "md", className }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const Emblem = () => (
    <svg
      viewBox="0 0 100 100"
      className={cn(sizeClasses[size], "flex-shrink-0")}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circular outline - thick white circle */}
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="6" />
      
      {/* Stylized "d" letter - lowercase d with filled circular counter */}
      {/* Vertical stem */}
      <line x1="35" y1="20" x2="35" y2="80" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      {/* Circular counter (filled) */}
      <circle cx="50" cy="50" r="12" fill="currentColor" />
      {/* Curved part of d */}
      <path
        d="M 35 30 Q 35 20 45 20 Q 50 20 50 30"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 35 70 Q 35 80 45 80 Q 50 80 50 70"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Stylized "k" letter - uppercase K with thick strokes */}
      {/* Vertical stem */}
      <line x1="65" y1="20" x2="65" y2="80" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      {/* Upper diagonal */}
      <line x1="65" y1="35" x2="80" y2="20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      {/* Lower diagonal - parallel to upper */}
      <line x1="65" y1="50" x2="80" y2="65" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );

  const Text = () => (
    <span className={cn("font-bold tracking-tight", textSizeClasses[size])}>
      digikraal
    </span>
  );

  if (variant === "emblem") {
    return <Emblem />;
  }

  if (variant === "text") {
    return <Text />;
  }

  // Full logo: emblem + text
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Emblem />
      <Text />
    </div>
  );
}

