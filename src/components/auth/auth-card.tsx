import type { ReactNode } from "react";
import Link from "next/link";
import { Hexagon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: {
    prompt: string;
    linkLabel: string;
    href: string;
  };
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="flex flex-col items-center">
      <Link
        href="/"
        className="mb-6 flex items-center gap-2 transition-opacity hover:opacity-80"
      >
        <Hexagon className="size-7 fill-primary/20 text-primary" />
        <span className="text-lg font-bold tracking-tight">OVERCLOCK_</span>
      </Link>

      <Card className="w-full">
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-xl">{title}</CardTitle>
          {subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>

      {footer ? (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {footer.prompt}{" "}
          <Link
            href={footer.href}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {footer.linkLabel}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
