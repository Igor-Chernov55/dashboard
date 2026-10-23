import { useSidebar } from './use-sidebar';
import logoIcon from '@/shared/assets/logo.svg';
import ratesIcon from '@/shared/assets/Rates.svg';
import cardsIcon from '@/shared/assets/Cards.svg';
import logoutIcon from '@/shared/assets/Logout.svg';
import { NavLink,Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/auth';
export default function Layout(){const {logout}=useAuth();const {expanded,toggle}=useSidebar();return <div className={`app-shell ${expanded?'sidebar-expanded':'sidebar-collapsed'}`}><aside className="sidebar"><button type="button" className="brand" aria-label={expanded?'Collapse sidebar':'Expand sidebar'} aria-expanded={expanded} aria-controls="dashboard-navigation" onClick={toggle}><img className="nav-icon" src={logoIcon} alt=""/><strong>Dashboard</strong></button><div className="menu-label">MENU</div><nav id="dashboard-navigation" aria-label="Main navigation"><NavLink to="/rates"><img className="nav-icon" src={ratesIcon} alt=""/><span className="full-label">Exchange Rates</span><span className="short-label">Rates</span></NavLink><NavLink to="/cards"><img className="nav-icon" src={cardsIcon} alt=""/><span className="full-label">Kanban Cards</span><span className="short-label">Cards</span></NavLink></nav><button className="logout" onClick={()=>void logout()}><img className="nav-icon" src={logoutIcon} alt=""/><span>Logout</span></button></aside><main className="workspace"><Outlet/></main></div>;}
