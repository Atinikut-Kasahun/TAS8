'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api';

export default function TADashboard({ user, activeTab: initialTab, onLogout }: { user: any; activeTab: string; onLogout: () => void }) {
    const [jobs, setJobs] = useState<any[]>([]);
    const [requisitions, setRequisitions] = useState<any[]>([]);
    const [applicants, setApplicants] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [localTab, setLocalTab] = useState(initialTab === 'HiringPlan' ? 'HIRING PLAN' : initialTab === 'Applicants' ? 'APPLICANTS' : 'JOBS');
    const [drawerReq, setDrawerReq] = useState<any>(null);
    const [drawerApp, setDrawerApp] = useState<any>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [jobsData, reqsResponse, appsResponse] = await Promise.all([
                apiFetch('/v1/jobs'),
                apiFetch('/v1/requisitions'),
                apiFetch('/v1/applicants'), // Assuming this exists or I'll add it
            ]);
            setJobs(jobsData || []);
            setRequisitions(reqsResponse?.data || []);
            setApplicants(appsResponse?.data || appsResponse || []);
        } catch (err) {
            console.error('Failed to fetch dashboard data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (initialTab === 'HiringPlan') setLocalTab('HIRING PLAN');
        else if (initialTab === 'Jobs') setLocalTab('JOBS');
    }, [initialTab]);

    const handlePostJob = async (req: any) => {
        setActionLoading(true);
        try {
            await apiFetch('/v1/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    job_requisition_id: req.id,
                    title: req.title,
                    description: req.description || `New opening for ${req.title} in ${req.department} department.`,
                    location: 'Addis Ababa',
                    type: 'full-time',
                }),
            });
            setDrawerReq(null);
            fetchData();
            // Optional: toast notification here
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Page Header */}
            <div className="flex justify-between items-end mb-4">
                <div className="space-y-4">
                    <h1 className="text-[32px] font-bold text-[#1A2B3D] tracking-tight">Droga Pharma</h1>

                    {/* Sub Tabs */}
                    <div className="flex gap-8 border-b border-gray-100">
                        {['JOBS', 'APPLICANTS', 'HIRING PLAN'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setLocalTab(t)}
                                className={`pb-3 text-[13px] font-black tracking-widest transition-all relative ${localTab === t ? 'text-[#1A2B3D]' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {t}
                                {localTab === t && (
                                    <motion.div
                                        layoutId="activeSubTabTA"
                                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1F7A6E]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {localTab === 'HIRING PLAN' && (
                    <button className="bg-[#1F7A6E] hover:bg-[#165C53] text-white px-6 py-3 rounded font-black text-[13px] tracking-wide shadow-xl shadow-[#1F7A6E]/20 transition-all flex items-center gap-2">
                        Create new requisition
                    </button>
                )}
            </div>

            {/* Content Table */}
            {loading ? (
                <div className="bg-white rounded border border-gray-100 p-20 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-[#1F7A6E] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                    {localTab === 'JOBS' && (
                        <table className="w-full text-left">
                            <thead className="bg-[#F9FAFB] border-b border-gray-100">
                                <tr>
                                    {['POSITION', 'LOCATION', 'DEPARTMENT', 'STATUS'].map(h => (
                                        <th key={h} className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {jobs.length === 0 ? (
                                    <tr><td colSpan={4} className="px-8 py-20 text-center text-gray-400 italic text-sm">No jobs posted.</td></tr>
                                ) : jobs.map((job: any) => (
                                    <tr key={job.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-[#1A2B3D] group-hover:text-[#1F7A6E] transition-colors">{job.title}</p>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-gray-500">{job.location || 'Addis Ababa'}</td>
                                        <td className="px-8 py-6 text-sm text-gray-500">{job.department || 'General'}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest ${job.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {localTab === 'APPLICANTS' && (
                        <table className="w-full text-left">
                            <thead className="bg-[#F9FAFB] border-b border-gray-100">
                                <tr>
                                    {['CANDIDATE', 'APPLIED FOR', 'EXPERIENCE', 'MATCHING', 'STATUS'].map(h => (
                                        <th key={h} className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {applicants.length === 0 ? (
                                    <tr><td colSpan={5} className="px-8 py-20 text-center text-gray-400 italic text-sm">No applications received yet.</td></tr>
                                ) : applicants.map((app: any) => (
                                    <tr
                                        key={app.id}
                                        className="hover:bg-gray-50 transition-colors group cursor-pointer"
                                        onClick={() => setDrawerApp(app)}
                                    >
                                        <td className="px-8 py-6">
                                            <p className="font-black text-[13px] text-[#1A2B3D]">{app.name}</p>
                                            <p className="text-[11px] text-gray-400 mt-0.5">{app.email}</p>
                                        </td>
                                        <td className="px-8 py-6 text-[13px] text-gray-600 font-medium">
                                            {app.job_posting?.title || 'Open Role'}
                                        </td>
                                        <td className="px-8 py-6 text-[13px] text-gray-600">
                                            {app.years_of_experience || '0'} Years
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#1F7A6E]" style={{ width: `${app.match_score || 75}%` }} />
                                            </div>
                                            <p className="text-[10px] font-black text-[#1F7A6E] mt-1 uppercase">{app.match_score || 75}% Match</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600">
                                                {app.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {localTab === 'HIRING PLAN' && (
                        <table className="w-full text-left">
                            <thead className="bg-[#F9FAFB] border-b border-gray-100">
                                <tr>
                                    {['REQUISITION', 'HIRING MANAGER', 'REQUISITION OWNER', 'SALARY', 'PLAN DATE', 'STATUS'].map(h => (
                                        <th key={h} className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {requisitions.length === 0 ? (
                                    <tr><td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic text-sm">No hiring plan items yet.</td></tr>
                                ) : requisitions.map((req: any) => (
                                    <tr
                                        key={req.id}
                                        className="hover:bg-gray-50 transition-colors group cursor-pointer"
                                        onClick={() => setDrawerReq(req)}
                                    >
                                        <td className="px-8 py-6">
                                            <p className="font-black text-[13px] text-[#0066CC] hover:underline group-hover:text-[#1F7A6E]">
                                                REQ{req.id} {req.title}
                                            </p>
                                            <p className="text-[11px] text-gray-400 mt-0.5 tracking-tight">
                                                {req.department} · {req.tenant?.name || 'Droga Pharma'}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-[13px] text-gray-600">
                                            {req.requester?.name || 'Hiring Manager'}
                                        </td>
                                        <td className="px-8 py-6 text-[13px] text-gray-600">
                                            {req.location || 'Addis Ababa'}
                                        </td>
                                        <td className="px-8 py-6 text-[13px] text-[#1A2B3D] font-black">
                                            ${req.budget ? (req.budget / 1000).toFixed(0) + 'k' : '45k'} /yr
                                        </td>
                                        <td className="px-8 py-6 text-[13px] text-gray-600">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest ${req.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                                                req.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-red-50 text-red-500'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Requisition Detail Side Drawer */}
            <AnimatePresence>
                {drawerReq && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setDrawerReq(null)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
                        />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-[120] flex flex-col"
                        >
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black text-[#1F7A6E] tracking-widest uppercase mb-1">REQ{drawerReq.id} Details</p>
                                    <h2 className="text-2xl font-black text-[#1A2B3D]">{drawerReq.title}</h2>
                                    <p className="text-gray-400 text-sm mt-1">{drawerReq.department} · {drawerReq.tenant?.name || 'Droga Pharma'}</p>
                                </div>
                                <button onClick={() => setDrawerReq(null)} className="text-gray-300 hover:text-gray-500 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                <section className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Status</p>
                                        <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest ${drawerReq.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                                            drawerReq.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500'
                                            }`}>
                                            {drawerReq.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Requested By</p>
                                        <p className="text-sm font-bold text-[#1A2B3D]">{drawerReq.requester?.name || 'Hiring Manager'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Location / Branch</p>
                                        <p className="text-sm font-bold text-[#1A2B3D]">{drawerReq.location || 'Addis Ababa (Bole)'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Priority</p>
                                        <p className="text-sm font-bold uppercase text-orange-500">{drawerReq.priority}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Budget Salary</p>
                                        <p className="text-sm font-black text-[#1A2B3D]">${drawerReq.budget ? (drawerReq.budget / 1000).toFixed(0) + 'k' : '45k'} /yr</p>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Description & Justification</h3>
                                    <div className="text-sm text-gray-600 leading-relaxed bg-white p-6 rounded border border-gray-100 italic">
                                        "{drawerReq.description || 'No detailed description provided.'}"
                                    </div>
                                </section>

                                {drawerReq.status === 'approved' && (
                                    <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-4">
                                        <div className="bg-emerald-500 text-white p-2 rounded-lg">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0114 0z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="text-[13px] font-black text-emerald-800 uppercase tracking-wide">Approved & Ready</h4>
                                            <p className="text-xs text-emerald-600 mt-1 leading-relaxed">This requisition has been signed off by HR. You can now publish it to the external careers portal.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 border-t border-gray-100 bg-gray-50/30">
                                {drawerReq.status === 'approved' ? (
                                    <button
                                        onClick={() => handlePostJob(drawerReq)}
                                        disabled={actionLoading}
                                        className="w-full py-5 bg-[#1F7A6E] text-white rounded-lg text-[13px] font-black tracking-widest uppercase shadow-xl shadow-[#1F7A6E]/20 hover:bg-[#165C53] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {actionLoading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Post Job to Public Portal
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full py-5 bg-gray-100 text-gray-300 rounded-lg text-[13px] font-black tracking-widest uppercase cursor-not-allowed"
                                    >
                                        Awaiting HR Approval
                                    </button>
                                )}
                                {/* Applicant Detail Side Drawer */}
                                <AnimatePresence>
                                    {drawerApp && (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                onClick={() => setDrawerApp(null)}
                                                className="fixed inset-0 bg-[#1A2B3D]/40 backdrop-blur-sm z-[150]"
                                            />
                                            <motion.div
                                                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                                className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-[160] flex flex-col"
                                            >
                                                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-[#F9FAFB]">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 bg-[#1F7A6E] rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                                                            {drawerApp.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h2 className="text-2xl font-black text-[#1A2B3D]">{drawerApp.name}</h2>
                                                            <p className="text-gray-400 text-sm font-medium">{drawerApp.email} • {drawerApp.phone || 'No Phone'}</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => setDrawerApp(null)} className="text-gray-300 hover:text-gray-500 transition-colors bg-white p-2 rounded-lg border border-gray-100">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </div>

                                                <div className="flex-1 overflow-y-auto p-10 space-y-10">
                                                    <section className="grid grid-cols-3 gap-8">
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experience</p>
                                                            <p className="text-lg font-black text-[#1A2B3D]">{drawerApp.years_of_experience || '0'} Years</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Age</p>
                                                            <p className="text-lg font-black text-[#1A2B3D]">{drawerApp.age || 'N/A'}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gender</p>
                                                            <p className="text-lg font-black text-[#1A2B3D]">{drawerApp.gender || 'N/A'}</p>
                                                        </div>
                                                    </section>

                                                    <section className="space-y-4">
                                                        <h3 className="text-[11px] font-black text-[#1F7A6E] uppercase tracking-[0.2em] border-b border-[#1F7A6E]/10 pb-2">Professional Background</h3>
                                                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                                            {drawerApp.professional_background || 'No background information provided.'}
                                                        </p>
                                                    </section>

                                                    <section className="space-y-4">
                                                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Enclosed Documents</h3>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <a
                                                                href={`/storage/${drawerApp.resume_path}`} target="_blank"
                                                                className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4 hover:border-[#1F7A6E] transition-all group"
                                                            >
                                                                <div className="bg-red-50 text-red-500 p-2 rounded-lg group-hover:bg-[#1F7A6E] group-hover:text-white transition-colors">
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-[11px] font-black text-[#1A2B3D] truncate uppercase tracking-tight">Main Resume.pdf</p>
                                                                    <p className="text-[10px] text-gray-400">Primary CV</p>
                                                                </div>
                                                            </a>
                                                            {drawerApp.attachments?.map((file: any, i: number) => (
                                                                <a
                                                                    key={i} href={`/storage/${file.file_path}`} target="_blank"
                                                                    className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4 hover:border-[#1F7A6E] transition-all group"
                                                                >
                                                                    <div className="bg-blue-50 text-blue-500 p-2 rounded-lg group-hover:bg-[#1F7A6E] group-hover:text-white transition-colors">
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-[11px] font-black text-[#1A2B3D] truncate uppercase tracking-tight">{file.label || 'Attachment'}</p>
                                                                        <p className="text-[10px] text-gray-400">Supporting Doc</p>
                                                                    </div>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </section>
                                                </div>

                                                <div className="p-8 border-t border-gray-100 flex gap-4">
                                                    <button className="flex-1 py-4 bg-[#1F7A6E] text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#165C53] transition-all shadow-lg shadow-[#1F7A6E]/20">
                                                        Move to Interview
                                                    </button>
                                                    <button className="flex-1 py-4 bg-white text-red-500 border border-red-100 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-red-50 transition-all">
                                                        Reject Candidate
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
