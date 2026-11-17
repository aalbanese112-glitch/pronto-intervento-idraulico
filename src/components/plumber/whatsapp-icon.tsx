import type { SVGProps } from "react";

export function WhatsappIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 11.6a9 9 0 0 1-13.5 7.8L3 21l1.6-4.5A9 9 0 1 1 21 11.6Z" />
      <path d="m8.2 7.2 1.6 2.7-1 1.2c.9 1.7 2.2 3 4 3.8l1.1-1 2.8 1.4c.2.1.3.4.2.6-.4 1.2-1.2 1.8-2.4 1.6-4-.7-7.2-3.7-8-7.7-.3-1.3.1-2 1.1-2.6.2-.1.5-.1.6 0Z" />
    </svg>
  );
}
