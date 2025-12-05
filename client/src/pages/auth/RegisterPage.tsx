import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { BRANCHES, YEARS, SECTIONS, Branch, Year, Section } from '@/services/api';

interface RegisterProps {
    onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        branch: '' as Branch | '',
        year: '' as Year | '',
        section: '' as Section | '',
        registrationNumber: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                branch: formData.branch || undefined,
                year: formData.year || undefined,
                section: formData.section || undefined,
                registrationNumber: formData.registrationNumber || undefined,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-sm"
            >
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-brand-400 rounded-2xl rotate-45 flex items-center justify-center shadow-2xl shadow-brand-400/50 mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black rotate-[-45deg]">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Create Account</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Join Nova Campus</p>
                </div>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm"
                            >
                                <AlertCircle size={16} />
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-3">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="pl-10"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="pl-10"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="pl-10"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <select
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 bg-gray-50 dark:bg-dark-surface2 border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-white"
                                >
                                    <option value="">Branch</option>
                                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 bg-gray-50 dark:bg-dark-surface2 border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-white"
                                >
                                    <option value="">Year</option>
                                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <select
                                    name="section"
                                    value={formData.section}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 bg-gray-50 dark:bg-dark-surface2 border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-white"
                                >
                                    <option value="">Sec</option>
                                    {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    type="text"
                                    name="registrationNumber"
                                    placeholder="Registration Number (Optional)"
                                    value={formData.registrationNumber}
                                    onChange={handleChange}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </form>
                </Card>

                <button
                    onClick={onSwitchToLogin}
                    className="flex items-center justify-center gap-2 w-full mt-6 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Sign In
                </button>
            </motion.div>
        </div>
    );
};
