'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface User {
    name: string;
    roles?: any[];
}

export default function Navbar({ user, onLogout }: { user: User; onLogout: () => void }) {
    const pathname = usePathname();

    const roleSlug = (() => {
        const roles = user.roles;
        if (!roles || roles.length === 0) return 'ta_manager';
        const first = roles[0];
        return (typeof first === 'string' ? first : first?.slug || first?.name || 'ta_manager').toLowerCase();
    })();

    const navItems = (() => {
        switch (roleSlug) {
            case 'hiring_manager':
                return [
                    { label: 'JOBS', href: '/dashboard?tab=Jobs' },
                    { label: 'HIRING PLAN', href: '/dashboard?tab=HiringPlan' },
                ];
            case 'hr_manager':
                return [
                    { label: 'JOBS', href: '/dashboard?tab=Jobs' },
                    { label: 'HIRING PLAN', href: '/dashboard?tab=HiringPlan' },
                    { label: 'REPORTS', href: '/dashboard?tab=Reports' },
                ];
            default: // TA Team / Admin
                return [
                    { label: 'JOBS', href: '/dashboard?tab=Jobs' },
                    { label: 'CANDIDATES', href: '/dashboard?tab=Candidates' },
                    { label: 'EMPLOYEES', href: '/dashboard?tab=Employees' },
                    { label: 'HIRING PLAN', href: '/dashboard?tab=HiringPlan' },
                    { label: 'REPORTS', href: '/dashboard?tab=Reports' },
                ];
        }
    })();

    return (
        <nav className="bg-[#1A2B3D] h-16 px-8 flex items-center justify-between shadow-lg sticky top-0 z-[100]">
            <div className="flex items-center gap-12">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <div className="bg-white text-[#1A2B3D] w-8 h-8 rounded flex items-center justify-center font-black text-xl">D</div>
                    <span className="text-white font-black text-xl tracking-tighter group-hover:text-teal-400 transition-colors">DROGA</span>
                </Link>

                {/* Nav Links */}
                <div className="flex gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`text-[11px] font-black tracking-widest transition-colors ${pathname === item.href ? 'text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Search icon */}
                <button className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>

                {/* Inbox icon */}
                <button className="relative text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="absolute -top-1.5 -right-1.5 bg-[#1F7A6E] text-[9px] font-black text-white w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#1A2B3D]">3</span>
                </button>

                <div className="h-6 w-px bg-white/10 mx-1" />

                {/* User Info */}
                <div className="flex items-center gap-3 group relative cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-[#2D455A] flex items-center justify-center text-[11px] font-black text-white border border-white/10 group-hover:border-teal-400 transition-all">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <p className="text-[10px] font-black text-white leading-none mb-1">{user.name}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Droga Pharma</p>
                    </div>

                    {/* Logout Tooltip/Dropdown Placeholder */}
                    <button
                        onClick={onLogout}
                        className="opacity-0 group-hover:opacity-100 absolute -bottom-10 right-0 bg-[#2D455A] text-white px-4 py-2 rounded shadow-xl text-[10px] font-black tracking-widest border border-white/10 hover:bg-red-500 transition-all z-[110]"
                    >
                        LOGOUT
                    </button>
                </div>
            </div>
        </nav>
    );
}
