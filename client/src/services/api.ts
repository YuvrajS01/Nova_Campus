const API_BASE = '/api';

// College structure constants
export const BRANCHES = ['CSE', 'EEE', 'ME', 'CE'] as const;
export const YEARS = [1, 2, 3, 4] as const;
export const SECTIONS = ['A', 'B'] as const;
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export type Branch = typeof BRANCHES[number];
export type Year = typeof YEARS[number];
export type Section = typeof SECTIONS[number];
export type Semester = typeof SEMESTERS[number];

// Token management
export const getToken = (): string | null => localStorage.getItem('token');
export const setToken = (token: string): void => localStorage.setItem('token', token);
export const removeToken = (): void => localStorage.removeItem('token');

// Generic fetch wrapper with auth
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const text = await response.text();
        console.error(`API Error ${response.status}: ${text}`);
        let errorMessage = `Request failed (${response.status})`;
        try {
            const errorJson = JSON.parse(text);
            errorMessage = errorJson.message || errorMessage;
        } catch {
            // Response wasn't JSON
            if (text.includes('<!DOCTYPE') || text.includes('<html')) {
                errorMessage = `Server error (${response.status})`;
            }
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

// CGPA types
export interface StudentCGPA {
    id: string;
    semester: number;
    cgpa: number;
}

// Auth types
export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    branch?: Branch;
    year?: Year;
    section?: Section;
    cgpaRecords?: StudentCGPA[];
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: string;
    branch?: Branch;
    year?: Year;
    section?: Section;
}

// Auth API
export const authApi = {
    login: (data: LoginData) => apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    register: (data: RegisterData) => apiFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};

// Announcement types
export interface Announcement {
    id: string;
    title: string;
    body: string;
    tag: string;
    isImportant: boolean;
    createdAt: string;
}

// Announcements API
export const announcementsApi = {
    getAll: () => apiFetch<Announcement[]>('/announcements'),
    create: (data: Omit<Announcement, 'id' | 'createdAt'>) =>
        apiFetch<Announcement>('/announcements', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    delete: (id: string) => apiFetch<{ message: string }>(`/announcements/${id}`, {
        method: 'DELETE',
    }),
};

// Timetable types
export interface TimetableEntry {
    id: string;
    branch: Branch;
    year: Year;
    section: Section;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    subject: string;
    room?: string;
    faculty?: string;
}

// Timetable API
export const timetableApi = {
    getAll: () => apiFetch<TimetableEntry[]>('/timetable'),
    getForUser: () => apiFetch<TimetableEntry[]>('/timetable'),
    create: (data: Omit<TimetableEntry, 'id'>) =>
        apiFetch<TimetableEntry>('/timetable', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    delete: (id: string) => apiFetch<{ message: string }>(`/timetable/${id}`, {
        method: 'DELETE',
    }),
};

// Event types
export interface Event {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    registrationDeadline?: string;
    createdAt: string;
    isRegistered?: boolean;
}

// Events API
export const eventsApi = {
    getAll: () => apiFetch<Event[]>('/events'),
    register: (eventId: string) => apiFetch<{ message: string }>(`/events/${eventId}/register`, {
        method: 'POST',
    }),
};

// Resource types
export interface Resource {
    id: string;
    title: string;
    subject: string;
    semester?: string;
    branch?: Branch;
    year?: Year;
    type: string;
    url: string;
    createdAt: string;
}

// Resources API
export const resourcesApi = {
    getAll: () => apiFetch<Resource[]>('/resources'),
    create: (data: Omit<Resource, 'id' | 'createdAt'>) =>
        apiFetch<Resource>('/resources', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    delete: (id: string) => apiFetch<{ message: string }>(`/resources/${id}`, {
        method: 'DELETE',
    }),
};

// Profile API
export const profileApi = {
    get: () => apiFetch<User>('/profile'),
};

// CGPA API
export const cgpaApi = {
    getMyRecords: () => apiFetch<StudentCGPA[]>('/cgpa'),
    getUserRecords: (userId: string) => apiFetch<StudentCGPA[]>(`/cgpa/${userId}`),
    create: (data: { userId: string; semester: number; cgpa: number }) =>
        apiFetch<StudentCGPA>('/cgpa', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    delete: (id: string) => apiFetch<{ message: string }>(`/cgpa/${id}`, {
        method: 'DELETE',
    }),
};

