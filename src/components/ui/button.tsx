import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        call: "bg-primary text-primary-foreground hover:bg-primary/85 font-bold",
        whatsapp: "bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 font-bold",
        heroOutline:
          "border border-on-ink/50 text-on-ink bg-transparent hover:bg-on-ink/10 font-bold",
        town: "border border-border bg-card text-foreground hover:border-primary hover:bg-accent justify-between font-semibold",
        service: "bg-amber-soft text-ink hover:bg-primary rounded-full",
        photo:
          "w-full flex-col items-stretch justify-start whitespace-normal text-left bg-transparent hover:opacity-90",
        lightbox: "bg-card text-foreground hover:bg-accent shadow-sm",
        footer:
          "text-on-ink-muted hover:text-on-ink h-auto p-0 justify-start text-xs underline underline-offset-4",
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        contact: "h-13 px-6 py-3 text-base rounded-md [&_svg]:size-5",
        town: "h-12 px-3.5 py-2 text-sm rounded-md",
        smallIcon: "size-8 p-0 [&_svg]:size-4",
        photo: "h-auto p-0",
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
