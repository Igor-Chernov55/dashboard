import { LoginSkeleton,Skeleton } from '@/shared/ui/skeleton';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate,useLocation,useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/auth';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
export default function Login(){const auth=useAuth();const navigate=useNavigate();const location=useLocation();const [error,setError]=useState('');const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm<{email:string;password:string}>();
 if(auth.loading)return <LoginSkeleton/>;
 if(auth.session)return <Navigate to="/rates" replace/>;
 return <main className="login-page"><form className="login-panel" noValidate onSubmit={handleSubmit(async data=>{setError('');try{await auth.login(data.email.trim(),data.password);navigate(location.state?.from || '/rates',{replace:true});}catch(e){setError((e as Error).message);}})}><h1>Log in</h1><p className="welcome">Welcome Back</p><div><label className="sr-only" htmlFor="email">Email Address</label><Input id="email" type="email" placeholder="✉️  Email Address" autoComplete="username" aria-invalid={!!errors.email} aria-describedby="email-error" {...register('email',{required:'Please enter a valid email address',pattern:{value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,message:'Please enter a valid email address'}})}/><p id="email-error" className="field-error">{errors.email?.message}</p></div><div><label className="sr-only" htmlFor="password">Password</label><Input id="password" type="password" placeholder="🔒  Password" autoComplete="current-password" aria-invalid={!!errors.password} aria-describedby="password-error" {...register('password',{required:'Password must be at least 6 characters',minLength:{value:6,message:'Password must be at least 6 characters'}})}/><p id="password-error" className="field-error">{errors.password?.message}</p></div>{error&&<p role="alert" className="field-error">{error}</p>}<Button disabled={isSubmitting}>{isSubmitting?<span role="status" aria-label="Logging in"><Skeleton className="h-4 w-20"/></span>:'Login'}</Button></form></main>;
}
