import * as React from 'react';
import { cn } from '@/shared/lib/utils';
export function Textarea({className,...props}:React.ComponentProps<'textarea'>) {return <textarea className={cn('control min-h-32 resize-y',className)} {...props}/>;}
