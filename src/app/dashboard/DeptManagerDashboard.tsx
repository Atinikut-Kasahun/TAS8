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
}

const INITIAL_FORM_DATA = {
    title: '',
    department: '',
    location: 'Addis Ababa (Bole)',
    headcount: 1,
    priority: 'medium',
    budget: 0,
    position_type: 'new',
    description: '',
};

export default function DeptManagerDashboard({ user, activeTab: initialTab, onLogout }: { user: any; activeTab: string; onLogout: () => void }) {
    const [requisitions, setRequisitions] = useState<Requisition[]>([]);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [wizardStep, setWizardStep] = useState(1);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [submitting, setSubmitting] = useState(false);
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

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await apiFetch('/v1/requisitions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            setDrawerOpen(false);
            setWizardStep(1);
            setFormData(INITIAL_FORM_DATA);
            fetchData();
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDuplicate = async (id: number) => {
        try {
            await apiFetch(`/v1/requisitions/${id}/duplicate`, { method: 'POST' });
            fetchData();
        } catch (e) {
            console.error(e);
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
                                        layoutId="activeSubTabDM"
                                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1F7A6E]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {localTab === 'HIRING PLAN' && (
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="bg-[#1F7A6E] hover:bg-[#165C53] text-white px-6 py-3 rounded font-black text-[13px] tracking-wide shadow-xl shadow-[#1F7A6E]/20 transition-all flex items-center gap-2"
                    >
                        Create new requisition
                    </button>
                )}
            </div>

            {/* Content Body */}
            {loading ? (
                <div className="bg-white rounded border border-gray-100 p-20 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-[#1F7A6E] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                    {localTab === 'JOBS' && (
                        <div className="p-20 text-center text-gray-400 italic">Access your active jobs here (In Progress).</div>
                    )}

                    {localTab === 'HIRING PLAN' && (
                        <table className="w-full text-left">
                            <thead className="bg-[#F9FAFB] border-b border-gray-100">
                                <tr>
                                    {['REQUISITION', 'HIRING MANAGER', 'LOCATION', 'SALARY', 'PLAN DATE', 'STATUS'].map(h => (
                                        <th key={h} className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {requisitions.length === 0 ? (
                                    <tr><td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic text-sm">You haven't created any requisitions yet.</td></tr>
                                ) : requisitions.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                                        <td className="px-8 py-6">
                                            <p className="font-black text-[13px] text-[#0066CC] hover:underline group-hover:text-[#1F7A6E]">
                                                REQ{req.id} {req.title}
                                            </p>
                                            <p className="text-[11px] text-gray-400 mt-0.5 tracking-tight">
                                                {req.department} · {req.position_type === 'replacement' ? '↺ Replacement' : '✦ New'}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-[13px] text-gray-600">
                                            {user.name} (You)
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
                                            <div className="flex items-center justify-between gap-4">
                                                <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest ${req.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                                                    req.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDuplicate(req.id); }}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-[#1F7A6E] transition-all"
                                                    title="Duplicate"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Creation Wizard Side Drawer */}
            <AnimatePresence>
                {drawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setDrawerOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
                        />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-[120] flex flex-col"
                        >
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-black text-[#1A2B3D]">New Requisition</h2>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#1F7A6E] transition-all duration-500" style={{ width: wizardStep === 1 ? '50%' : '100%' }} />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step {wizardStep} of 2</span>
                                    </div>
                                </div>
                                <button onClick={() => setDrawerOpen(false)} className="text-gray-300 hover:text-gray-500 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                {wizardStep === 1 ? (
                                    <div className="space-y-6">
                                        <section className="space-y-4">
                                            <h3 className="text-[11px] font-black text-[#1F7A6E] uppercase tracking-widest">Job Details</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 leading-none">Job Title</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-4 focus:ring-[#1F7A6E]/10 focus:border-[#1F7A6E] transition-all text-sm font-bold text-[#1A2B3D]"
                                                        placeholder="e.g. Senior Pharmacist"
                                                        value={formData.title}
                                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 leading-none">Department</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-4 focus:ring-[#1F7A6E]/10 focus:border-[#1F7A6E] transition-all text-sm font-bold text-[#1A2B3D]"
                                                        placeholder="e.g. Sales & Marketing"
                                                        value={formData.department}
                                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 leading-none">Location / Branch</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-4 focus:ring-[#1F7A6E]/10 focus:border-[#1F7A6E] transition-all text-sm font-bold text-[#1A2B3D]"
                                                        placeholder="e.g. Arat Kilo, Bole, or Regional"
                                                        value={formData.location}
                                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </section>

                                        <section className="space-y-4 pt-4 border-t border-gray-100 border-dashed">
                                            <h3 className="text-[11px] font-black text-[#1F7A6E] uppercase tracking-widest">Urgency & Capacity</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2">
                                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none">Priority Level</label>
                                                    <div className="flex gap-2">
                                                        {['low', 'medium', 'high', 'urgent'].map(p => (
                                                            <button
                                                                key={p}
                                                                onClick={() => setFormData({ ...formData, priority: p })}
                                                                className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase border transition-all ${formData.priority === p
                                                                    ? 'bg-[#1F7A6E] text-white border-[#1F7A6E] shadow-lg shadow-[#1F7A6E]/20'
                                                                    : 'bg-white text-gray-400 border-gray-200 hover:border-[#1F7A6E] hover:text-[#1F7A6E]'
                                                                    }`}
                                                            >
                                                                {p}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 leading-none">Headcount</label>
                                                    <input
                                                        type="number"
                                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-4 focus:ring-[#1F7A6E]/10 focus:border-[#1F7A6E] transition-all text-sm font-bold"
                                                        value={formData.headcount}
                                                        onChange={(e) => setFormData({ ...formData, headcount: parseInt(e.target.value) })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 leading-none">Type</label>
                                                    <select
                                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-4 focus:ring-[#1F7A6E]/10 focus:border-[#1F7A6E] transition-all text-sm font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_1.25rem_center] bg-no-repeat"
                                                        value={formData.position_type}
                                                        onChange={(e) => setFormData({ ...formData, position_type: e.target.value as any })}
                                                    >
                                                        <option value="new">✦ New Position</option>
                                                        <option value="replacement">↺ Replacement</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <section className="space-y-4">
                                            <h3 className="text-[11px] font-black text-[#1F7A6E] uppercase tracking-widest">Financials & Context</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 leading-none">Annual Salary Budget ($)</label>
                                                    <div className="relative">
                                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-300">$</span>
                                                        <input
                                                            type="number"
                                                            className="w-full pl-10 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-4 focus:ring-[#1F7A6E]/10 focus:border-[#1F7A6E] transition-all font-black text-[#1A2B3D]"
                                                            value={formData.budget}
                                                            onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 leading-none">Internal Notes / Justification</label>
                                                    <textarea
                                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-4 focus:ring-[#1F7A6E]/10 focus:border-[#1F7A6E] transition-all text-sm font-medium h-48 leading-relaxed placeholder:text-gray-300"
                                                        placeholder="Provide context for HR regarding why this role is needed now..."
                                                        value={formData.description}
                                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 border-t border-gray-100 flex gap-4 bg-gray-50/50">
                                {wizardStep === 2 && (
                                    <button
                                        onClick={() => setWizardStep(1)}
                                        className="flex-1 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest border border-gray-200 hover:bg-white rounded-lg transition-all"
                                    >
                                        Back to Details
                                    </button>
                                )}
                                <button
                                    onClick={() => wizardStep === 1 ? setWizardStep(2) : handleSubmit()}
                                    disabled={submitting || (wizardStep === 1 && (!formData.title || !formData.department))}
                                    className="flex-[2] py-4 bg-[#1F7A6E] text-white rounded-lg text-[11px] font-black tracking-widest uppercase shadow-xl shadow-[#1F7A6E]/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {wizardStep === 1 ? 'Continue to Financials' : 'Submit for Approval'}
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
