import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import { enUS } from 'react-day-picker/locale';
import 'react-day-picker/style.css';
export function DatePicker({id,value,onChange}:{id:string;value:string;onChange:(value:string)=>void}){
 const [open,setOpen]=useState(false);
 const selected=value?new Date(`${value}T12:00:00`):undefined;
 function select(date:Date|undefined){onChange(date?`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`:'');setOpen(false);}
 return <Popover.Root open={open} onOpenChange={setOpen}><Popover.Trigger asChild><button id={id} type="button" className={`control date-trigger ${value?'':'muted'}`}><span>{selected?selected.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}):'Select date'}</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg></button></Popover.Trigger><Popover.Portal><Popover.Content className="calendar-popover" align="start" sideOffset={8} collisionPadding={12} lang="en"><DayPicker mode="single" locale={enUS} weekStartsOn={0} selected={selected} defaultMonth={selected} onSelect={select} autoFocus/><div className="calendar-actions"><button type="button" onClick={()=>select(undefined)}>Clear</button><button type="button" onClick={()=>select(new Date())}>Today</button></div></Popover.Content></Popover.Portal></Popover.Root>;
}
