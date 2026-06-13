import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/client-utils";

interface LoginButtonProps {
  className?: string;
}

export function LoginButton({ className }: LoginButtonProps) {
  return (
    <Link
      href="/auth"
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        className
      )}
    >
      Open app
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
