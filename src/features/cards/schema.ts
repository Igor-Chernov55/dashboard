import { z } from 'zod';
export const cardSchema=z.object({title:z.string().trim().min(1,'Title is required').max(120,'Maximum 120 characters'),description:z.string().trim().min(1,'Description is required').max(5000,'Maximum 5000 characters'),priority:z.enum(['Low','Medium','High'],{error:'Please select a priority'}),status:z.enum(['','To Do','In Progress','Done']),assignee:z.string(),deadline:z.string().refine(v=>!v||!Number.isNaN(Date.parse(v)),'Select a valid date'),tags:z.array(z.string().max(30)).max(10)});
export type CardValues=z.infer<typeof cardSchema>;
export const emptyCard={title:'',description:'',priority:'' as CardValues['priority'],status:'' as const,assignee:'',deadline:'',tags:[]};
