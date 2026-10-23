import * as React from 'react';
import { cn } from '@/shared/lib/utils';
export function Input({className,type,...props}:React.ComponentProps<'input'>) {return <input type={type} className={cn('control',className)} {...props}/>;}
