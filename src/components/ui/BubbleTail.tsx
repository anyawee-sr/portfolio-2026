import type { SVGProps } from "react";

import { cn } from "@/lib/cn";

export function BubbleTail({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 90"
      className={cn("h-6 w-8", className)}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M 12,5 L 100,5 L 111,50 Q 115,65 102,57 Z"
        transform="translate(120,0) scale(-1,1)"
      />
    </svg>
  );
}
