import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Navigation';
import { Card, Button, Input, Badge } from '../components/UI';
import {
    Plus, Trash2, Bell, Calendar, BookOpen, Loader2, AlertCircle,
    CheckCircle, X
} from 'lucide-react';
import {
    announcementsApi, timetableApi, resourcesApi,
    Announcement, TimetableEntry, Resource,
    BRANCHES, YEARS, SECTIONS
} from '../services/api';

type AdminTab = 'notices' | 'timetable' | 'resources';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TAGS = ['Exam', 'Fee', 'Holiday', 'Placement', 'General'];
const RESOURCE_TYPES = ['pdf', 'link', 'video'];

export const Admin: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('notices');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Data states
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);

    // Form states
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<any>({});

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [announcementData, timetableData, resourceData] = await Promise.all([
                announcementsApi.getAll().catch(() => []),
                timetableApi.getAll().catch(() => []),
                resourcesApi.getAll().catch(() => []),
            ]);
            setAnnouncements(announcementData);
            setTimetable(timetableData);
            setResources(resourceData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleDelete = async (type: AdminTab, id: string) => {
        try {
            if (type === 'notices') {
                await announcementsApi.delete(id);
                setAnnouncements(prev => prev.filter(a => a.id !== id));
            } else if (type === 'timetable') {
                await timetableApi.delete(id);
                setTimetable(prev => prev.filter(t => t.id !== id));
            } else if (type === 'resources') {
                await resourcesApi.delete(id);
                setResources(prev => prev.filter(r => r.id !== id));
            }
            showMessage('success', 'Deleted successfully');
        } catch (error) {
            showMessage('error', 'Failed to delete');
        }
    };

    const handleCreate = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'notices') {
                if (!formData.title || !formData.body) {
                    showMessage('error', 'Title and body are required');
                    setIsLoading(false);
                    return;
                }
                const announcement = await announcementsApi.create({
                    title: formData.title,
                    body: formData.body,
                    tag: formData.tag || 'General',
                    isImportant: formData.isImportant || false,
                });
                setAnnouncements(prev => [announcement, ...prev]);
            } else if (activeTab === 'timetable') {
                if (!formData.subject || !formData.branch || !formData.year || !formData.section || !formData.startTime || !formData.endTime) {
                    showMessage('error', 'Subject, Branch, Year, Section, Start Time and End Time are required');
                    setIsLoading(false);
                    return;
                }
                const entry = await timetableApi.create({
                    branch: formData.branch,
                    year: parseInt(formData.year) as 1 | 2 | 3 | 4,
                    section: formData.section,
                    dayOfWeek: parseInt(formData.dayOfWeek) || 0,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    subject: formData.subject,
                    room: formData.room || undefined,
                    faculty: formData.faculty || undefined,
                });
                setTimetable(prev => [entry, ...prev]);
            } else if (activeTab === 'resources') {
                if (!formData.title || !formData.subject || !formData.url) {
                    showMessage('error', 'Title, Subject and URL are required');
                    setIsLoading(false);
                    return;
                }
                const resource = await resourcesApi.create({
                    title: formData.title,
                    subject: formData.subject,
                    semester: formData.semester || undefined,
                    branch: formData.branch || undefined,
                    year: formData.year ? parseInt(formData.year) as 1 | 2 | 3 | 4 : undefined,
                    type: formData.type || 'pdf',
                    url: formData.url,
                });
                setResources(prev => [resource, ...prev]);
            }
            setShowForm(false);
            setFormData({});
            showMessage('success', 'Created successfully');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create';
            showMessage('error', errorMessage);
            console.error('Create error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'notices' as AdminTab, label: 'Notices', icon: Bell, count: announcements.length },
        { id: 'timetable' as AdminTab, label: 'Timetable', icon: Calendar, count: timetable.length },
        { id: 'resources' as AdminTab, label: 'Resources', icon: BookOpen, count: resources.length },
    ];

    return (
        <div className="space-y-4">
            <Header title="Admin Panel" />

            {/* Message Toast */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-4 left-4 right-4 z-50 p-3 rounded-xl flex items-center gap-2 ${message.type === 'success'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                            }`}
                    >
                        {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setShowForm(false); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                            : 'bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                        <span className="text-xs opacity-60">({tab.count})</span>
                    </button>
                ))}
            </div>

            {/* Add Button */}
            <Button
                onClick={() => { setShowForm(!showForm); setFormData({}); }}
                className="w-full"
            >
                {showForm ? <X size={18} /> : <Plus size={18} />}
                {showForm ? 'Cancel' : `Add ${activeTab === 'notices' ? 'Notice' : activeTab === 'timetable' ? 'Class' : 'Resource'}`}
            </Button>

            {/* Create Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <Card className="space-y-3">
                            {activeTab === 'notices' && (
                                <>
                                    <Input
                                        placeholder="Title"
                                        value={formData.title || ''}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="Body"
                                        value={formData.body || ''}
                                        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                        className="w-full p-3 rounded-xl bg-gray-100 dark:bg-dark-bg border border-gray-200 dark:border-dark-border min-h-[100px] resize-none"
                                    />
                                    <div className="flex gap-2">
                                        <select
                                            value={formData.tag || 'General'}
                                            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                            className="flex-1 p-3 rounded-xl bg-gray-100 dark:bg-dark-bg border border-gray-200 dark:border-dark-border"
                                        >
                                            {TAGS.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                                        </select>
                                        <label className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-dark-bg rounded-xl">
                                            <input
                                                type="checkbox"
                                                checked={formData.isImportant || false}
                                                onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                                            />
                                            Important
                                        </label>
                                    </div>
                                </>
                            )}

                            {activeTab === 'timetable' && (
                                <>
                                    <Input
                                        placeholder="Subject"
                                        value={formData.subject || ''}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                    <div className="grid grid-cols-3 gap-2">
                                        <select
                                            value={formData.branch || ''}
                                            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                            className="p-3 rounded-xl bg-gray-100 dark:bg-dark-bg border border-gray-200 dark:border-dark-border"
                                        >
                                            <option value="">Branch *</option>
                                            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                        <select
                                            value={formData.year || ''}
                                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                            className="p-3 rounded-xl bg-gray-100 dark:bg-dark-bg border border-gray-200 dark:border-dark-border"
                                        >
                                            <option value="">Year *</option>
                                            {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
                                        </select>
                                        <select
                                            value={formData.section || ''}
                                            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                            className="p-3 rounded-xl bg-gray-100 dark:bg-dark-bg border border-gray-200 dark:border-dark-border"
                                        >
                                            <option value="">Section *</option>
                                            {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
                                        </select>
                                    </div>
                                    <select
                                        value={formData.dayOfWeek || '0'}
                                        onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                                        className="w-full p-3 rounded-xl bg-gray-100 dark:bg-dark-bg border border-gray-200 dark:border-dark-border"
                                    >
                                        {DAYS.map((day, i) => <option key={day} value={i}>{day}</option>)}
                                    </select>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            type="time"
                                            placeholder="Start Time"
                                            value={formData.startTime || ''}
                                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        />
                                        <Input
                                            type="time"
                                            placeholder="End Time"
                                            value={formData.endTime || ''}
                                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            placeholder="Room"
                                            value={formData.room || ''}
                                            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                        />
                                        <Input
                                            placeholder="Faculty"
                                            value={formData.faculty || ''}
                                            onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            {activeTab === 'resources' && (
                                <>
                                    <Input
                                        placeholder="Title *"
                                        value={formData.title || ''}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            placeholder="Subject *"
                                            value={formData.subject || ''}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                        <Input
                                            placeholder="Semester"
                                            value={formData.semester || ''}
                                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <select
                                            value={formData.branch || ''}
                                            onChange={(e) => setFormData({ ...formData, branch: e.target.value || undefined })}
                                            className="p-3 rounded-xl bg-gray-100 dark:bg-dark-bg border border-gray-200 dark:border-dark-border"
                                        >
                                            <option value="">All Branches</option>
                                            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                        <select
                                            value={formData.year || ''}
                                            onChange={(e) => setFormData({ ...formData, year: e.target.value || undefined })}
                                            className="p-3 rounded-xl bg-gray-100 dark:bg-dark-bg border border-gray-200 dark:border-dark-border"
                                        >
                                            <option value="">All Years</option>
                                            {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
                                        </select>
                                    </div>
                                    <select
                                        value={formData.type || 'pdf'}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full p-3 rounded-xl bg-gray-100 dark:bg-dark-bg border border-gray-200 dark:border-dark-border"
                                    >
                                        {RESOURCE_TYPES.map(type => <option key={type} value={type}>{type.toUpperCase()}</option>)}
                                    </select>
                                    <Input
                                        placeholder="URL *"
                                        value={formData.url || ''}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    />
                                </>
                            )}

                            <Button onClick={handleCreate} disabled={isLoading} className="w-full">
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Create'}
                            </Button>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content List */}
            <div className="space-y-3 pb-8">
                {isLoading && !announcements.length && !timetable.length && !resources.length ? (
                    <div className="text-center py-12 text-gray-400">Loading...</div>
                ) : (
                    <>
                        {activeTab === 'notices' && announcements.map(item => (
                            <Card key={item.id} className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant={item.isImportant ? 'error' : 'default'}>{item.tag}</Badge>
                                        {item.isImportant && <span className="text-xs text-red-500">Important</span>}
                                    </div>
                                    <h4 className="font-bold dark:text-white truncate">{item.title}</h4>
                                    <p className="text-sm text-gray-500 line-clamp-2">{item.body}</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete('notices', item.id)} className="text-red-500 shrink-0">
                                    <Trash2 size={16} />
                                </Button>
                            </Card>
                        ))}

                        {activeTab === 'timetable' && timetable.map(item => (
                            <Card key={item.id} className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <Badge variant="outline" className="mb-1">{DAYS[item.dayOfWeek]}</Badge>
                                    <h4 className="font-bold dark:text-white">{item.subject}</h4>
                                    <p className="text-sm text-gray-500">
                                        {item.startTime} - {item.endTime} • {item.room || 'TBA'} • {item.faculty || 'TBA'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {item.branch} Year {item.year} Sec {item.section}
                                    </p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete('timetable', item.id)} className="text-red-500 shrink-0">
                                    <Trash2 size={16} />
                                </Button>
                            </Card>
                        ))}

                        {activeTab === 'resources' && resources.map(item => (
                            <Card key={item.id} className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <Badge variant="outline" className="mb-1">{item.type.toUpperCase()}</Badge>
                                    <h4 className="font-bold dark:text-white truncate">{item.title}</h4>
                                    <p className="text-sm text-gray-500">{item.subject} {item.semester && `• ${item.semester}`}</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete('resources', item.id)} className="text-red-500 shrink-0">
                                    <Trash2 size={16} />
                                </Button>
                            </Card>
                        ))}

                        {((activeTab === 'notices' && !announcements.length) ||
                            (activeTab === 'timetable' && !timetable.length) ||
                            (activeTab === 'resources' && !resources.length)) && (
                                <div className="text-center py-12 text-gray-400">
                                    No {activeTab} yet. Click the button above to add one.
                                </div>
                            )}
                    </>
                )}
            </div>
        </div>
    );
};
