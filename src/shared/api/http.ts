export async function getJson<T>(url:string,init?:RequestInit):Promise<T> {
 const response=await fetch(url,{...init,signal:init?.signal ?? AbortSignal.timeout(15000)});
 if(!response.ok) {const body=await response.json().catch(()=>null);throw new Error(body?.message || `Request failed (${response.status})`);}
 return response.json();
}
