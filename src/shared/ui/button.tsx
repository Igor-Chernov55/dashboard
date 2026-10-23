import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
const buttonVariants = cva('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50', {variants:{variant:{default:'bg-primary text-primary-foreground hover:opacity-90 shadow-sm',outline:'border border-border bg-transparent text-muted-foreground hover:bg-muted',ghost:'hover:bg-muted'},size:{default:'h-12 px-7',sm:'h-9 px-4'}},defaultVariants:{variant:'default',size:'default'}});
function Button({className,variant,size,asChild=false,...props}:React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & {asChild?:boolean}) { const Comp=asChild?Slot:'button';return <Comp className={cn(buttonVariants({variant,size,className}))} {...props}/>; }
export { Button, buttonVariants };
