'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api';

interface Requisition {
    id: number;
    title: string;
    department: string;
    headcount: number;
    budget: number | null;
    position_type: 'new' | 'replacement';
    priority: string;
    location: string;
    status: string;
    description: string | null;
    created_at: string;
    requester?: { id: number; name: string; email: string };
    tenant?: { name: string };
}

export default function HRManagerDashboard({ user, activeTab: initialTab, onLogout }: { user: any; activeTab: string; onLogout: () => void }) {
    const [requisitions, setRequisitions] = useState<Requisition[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [drawerReq, setDrawerReq] = useState<Requisition | null>(null);
    const [rejectTarget, setRejectTarget] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [localTab, setLocalTab] = useState(initialTab === 'HiringPlan' ? 'HIRING PLAN' : 'JOBS');

    const fetchData = async () => {
        try {
            const json = await apiFetch('/v1/requisitions');
            setRequisitions(json.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleApprove = async (id: number) => {
        setActionLoading(true);
        try {
            await apiFetch(`/v1/requisitions/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'approved' }),
            });
            setDrawerReq(null);
            fetchData();
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectTarget || !rejectReason.trim()) return;
        setActionLoading(true);
        try {
            await apiFetch(`/v1/requisitions/${rejectTarget}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'rejected', rejection_reason: rejectReason }),
            });
            setRejectTarget(null);
            setRejectReason('');
            setDrawerReq(null);
            fetchData();
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(false);
        }
    };

    const handleBulkApprove = async () => {
        if (selectedIds.length === 0) return;
        setActionLoading(true);
        try {
            await apiFetch('/v1/requisitions/bulk-approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds }),
            });
            setSelectedIds([]);
            fetchData();
        } catch (e) {
            console.error(e);
        } finally {
            setActionLoading(false);
        }
    };

    const pendingReqs = requisitions.filter(r => r.status === 'pending');

    return (
        <div className="space-y-6 pb-20">
            {/* Page Header */}
            <div className="flex justify-between items-end mb-4">
                <div className="space-y-4">
                    <h1 className="text-[32px] font-bold text-[#1A2B3D] tracking-tight">Droga Pharma</h1>

                    {/* Sub Tabs */}
                    <div className="flex gap-8 border-b border-gray-100">
                        {['JOBS', 'HIRING PLAN'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setLocalTab(t)}
                                className={`pb-3 text-[13px] font-black tracking-widest transition-all relative ${localTab === t ? 'text-[#1A2B3D]' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {t}
                                {localTab === t && (
                                    <motion.div
                                        layoutId="activeSubTabHR"
                                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1F7A6E]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {localTab === 'HIRING PLAN' && selectedIds.length > 0 && (
                    <button
                        onClick={handleBulkApprove}
                        disabled={actionLoading}
                        className="bg-[#1F7A6E] hover:bg-[#165C53] text-white px-6 py-3 rounded font-black text-[13px] tracking-wide shadow-xl shadow-[#1F7A6E]/20 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        Approve Selected ({selectedIds.length})
                    </button>
                )}
            </div>

            {/* Content Body */}
            {loading ? (
                <div className="bg-white rounded border border-gray-100 p-20 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-[#1F7A6E] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
                    {localTab === 'JOBS' && (
                        <div className="p-20 text-center text-gray-400 italic">Job management coming soon for HR view.</div>
                    )}

                    {localTab === 'HIRING PLAN' && (
                        <table className="w-full text-left">
                            <thead className="bg-[#F9FAFB] border-b border-gray-100">
                                <tr>
                                    <th className="pl-6 py-4 w-10">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => setSelectedIds(e.target.checked ? pendingReqs.map(r => r.id) : [])}
                                            checked={pendingReqs.length > 0 && selectedIds.length === pendingReqs.length}
                                            className="accent-[#1F7A6E] rounded"
                                        />
                                    </th>
                                    {['REQUISITION', 'HIRING MANAGER', 'REQUISITION OWNER', 'SALARY', 'PLAN DATE', 'STATUS'].map(h => (
                                        <th key={h} className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {requisitions.length === 0 ? (
                                    <tr><td colSpan={7} className="px-8 py-20 text-center text-gray-400 italic text-sm">No requisitions in the plan.</td></tr>
                                ) : requisitions.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                                        <td className="pl-6 py-6" onClick={(e) => e.stopPropagation()}>
                                            {req.status === 'pending' && (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(req.id)}
                                                    onChange={(e) => setSelectedIds(prev => e.target.checked ? [...prev, req.id] : prev.filter(id => id !== req.id))}
                                                    className="accent-[#1F7A6E] rounded"
                                                />
                                            )}
                                        </td>
                                        <td className="px-6 py-6" onClick={() => setDrawerReq(req)}>
                                            <p className="font-black text-[13px] text-[#0066CC] hover:underline group-hover:text-[#1F7A6E]">
                                                REQ{req.id} {req.title}
                                            </p>
                                            <p className="text-[11px] text-gray-400 mt-0.5 tracking-tight">
                                                {req.department} · {req.tenant?.name || 'Droga Pharma'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-6 text-[13px] text-gray-600">
                                            {req.requester?.name || 'Hiring Manager'}
                                        </td>
                                        <td className="px-6 py-6 text-[13px] text-gray-600">
                                            {req.location || 'Addis Ababa'}
                                        </td>
                                        <td className="px-6 py-6 text-[13px] text-[#1A2B3D] font-black">
                                            ${req.budget ? (req.budget / 1000).toFixed(0) + 'k' : '45k'} /yr
                                        </td>
                                        <td className="px-6 py-6 text-[13px] text-gray-600">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-6">
                                            {req.status === 'pending' ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleApprove(req.id); }}
                                                        className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 uppercase"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setRejectTarget(req.id); setRejectReason(''); setDrawerReq(req); }}
                                                        className="text-[10px] font-black text-red-500 bg-red-50 px-3 py-1.5 rounded hover:bg-red-500 hover:text-white transition-all border border-red-100 uppercase"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest ${req.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Side Drawer Integration */}
            <AnimatePresence>
                {drawerReq && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => { setDrawerReq(null); setRejectTarget(null); }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
                        />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-[120] overflow-y-auto"
                        >
                            <div className="p-8 border-b border-gray-100 flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-[#1F7A6E] tracking-widest uppercase mb-1">REQ{drawerReq.id}</p>
                                    <h2 className="text-2xl font-black text-[#1A2B3D]">{drawerReq.title}</h2>
                                    <p className="text-gray-400 text-sm mt-1">{drawerReq.department} · {drawerReq.tenant?.name || 'Droga Pharma'}</p>
                                </div>
                                <button onClick={() => { setDrawerReq(null); setRejectTarget(null); }} className="text-gray-300 hover:text-gray-500 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-2 gap-6 pb-8 border-b border-gray-100">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Location / Branch</p>
                                        <p className="text-sm font-bold text-[#1A2B3D]">{drawerReq.location || 'Addis Ababa'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Salary Range</p>
                                        <p className="text-sm font-black text-[#1A2B3D]">${drawerReq.budget ? (drawerReq.budget / 1000).toFixed(0) + 'k' : '45k'} /yr</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Justification / Description</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded border border-gray-100 border-dashed">
                                        {drawerReq.description || 'No detailed description provided for this requisition.'}
                                    </p>
                                </div>

                                {drawerReq.status === 'pending' && (
                                    <div className="pt-8 space-y-4 border-t border-gray-100">
                                        {rejectTarget === drawerReq.id ? (
                                            <div className="space-y-3">
                                                <textarea
                                                    value={rejectReason}
                                                    onChange={(e) => setRejectReason(e.target.value)}
                                                    placeholder="Enter rejection reason..."
                                                    className="w-full px-4 py-3 bg-red-50/50 border border-red-100 rounded focus:ring-2 focus:ring-red-200 outline-none text-sm h-32"
                                                />
                                                <div className="flex gap-2">
                                                    <button onClick={() => setRejectTarget(null)} className="flex-1 px-6 py-3 bg-gray-50 text-gray-400 rounded text-[11px] font-black tracking-widest uppercase mb-4">Cancel</button>
                                                    <button
                                                        onClick={handleReject}
                                                        disabled={!rejectReason.trim() || actionLoading}
                                                        className="flex-[2] px-6 py-3 bg-red-500 text-white rounded text-[11px] font-black tracking-widest uppercase mb-4 disabled:opacity-50"
                                                    >
                                                        Confirm Rejection
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleApprove(drawerReq.id)}
                                                    disabled={actionLoading}
                                                    className="flex-1 px-6 py-4 bg-[#1F7A6E] text-white rounded text-[11px] font-black tracking-widest uppercase shadow-xl shadow-[#1F7A6E]/20"
                                                >
                                                    Approve Requisition
                                                </button>
                                                <button
                                                    onClick={() => setRejectTarget(drawerReq.id)}
                                                    className="px-6 py-4 bg-red-50 text-red-500 rounded text-[11px] font-black tracking-widest uppercase border border-red-100 hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
