import { getJson } from '@/shared/api/http';
export type Rate={date:string;base:string;quote:string;rate:number};
const api='https://api.frankfurter.dev/v2/rates';
export const currencies:Record<string,string>={AUD:'🇦🇺',CAD:'🇨🇦',CHF:'🇨🇭',EUR:'🇪🇺',GBP:'🇬🇧',JPY:'🇯🇵'};
export const fetchRates=(signal:AbortSignal)=>getJson<Rate[]>(`${api}?base=USD&quotes=${Object.keys(currencies).join(',')}`,{signal});
export function fetchHistory(currency:string,days:number,end:string,signal:AbortSignal){const start=new Date(`${end}T12:00:00Z`);start.setUTCDate(start.getUTCDate()-days);return getJson<Rate[]>(`${api}?base=USD&quotes=${currency}&from=${start.toISOString().slice(0,10)}&to=${end}`,{signal});}
