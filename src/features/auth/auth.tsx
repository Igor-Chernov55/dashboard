import { LoginSkeleton } from '@/shared/ui/skeleton';
import { createContext,useContext,useState,useEffect,type ReactNode } from 'react';
import { Navigate,Outlet,useLocation } from 'react-router-dom';
import { getJson } from '@/shared/api/http';
type User={id:number;name:string;email:string};
type Session={token:string;user:User};
const base=import.meta.env.VITE_AUTH_API || '/api';
const Context=createContext<{session:Session|null;loading:boolean;error:string;retry:()=>void;login:(email:string,password:string)=>Promise<void>;logout:()=>Promise<void>}>(null!);
export function AuthProvider({children}:{children:ReactNode}) {
 const [session,setSession]=useState<Session|null>(null);
 const [loading,setLoading]=useState(true);const [error,setError]=useState('');const [attempt,setAttempt]=useState(0);
 useEffect(()=>{let active=true; const token=localStorage.getItem('dashboard.token.v1');setLoading(true);setError('');
  if(!token){setLoading(false);return;}
  getJson<User>(`${base}/me`,{headers:{Authorization:`Bearer ${token}`}}).then(user=>{if(active)setSession({token,user});}).catch(e=>{if(active){setError(e.message);}}).finally(()=>{if(active)setLoading(false);});
  return()=>{active=false;};
 },[attempt]);
 async function login(email:string,password:string){const result=await getJson<Session>(`${base}/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});localStorage.setItem('dashboard.token.v1',result.token);setSession(result);setError('');}
 async function logout(){try{if(session)await fetch(`${base}/logout`,{method:'POST',headers:{Authorization:`Bearer ${session.token}`},signal:AbortSignal.timeout(5000)});}finally{localStorage.removeItem('dashboard.token.v1');setSession(null);setError('');}}
 return <Context.Provider value={{session,loading,error,retry:()=>setAttempt(x=>x+1),login,logout}}>{children}</Context.Provider>;
}
export const useAuth=()=>useContext(Context);
export function ProtectedRoute(){const auth=useAuth();const location=useLocation();if(auth.loading)return <LoginSkeleton/>;if(auth.error)return <div className="center" role="alert"><p>{auth.error}</p><button onClick={auth.retry}>Retry</button><button onClick={()=>void auth.logout()}>Back to login</button></div>;return auth.session?<Outlet/>:<Navigate to="/login" state={{from:location.pathname}} replace/>;}
