export type Theme = 'light' | 'dark';

export interface ClassSession {
  id: string;
  courseCode: string;
  courseName: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: string;
  professor: string;
  isOngoing?: boolean;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Academic' | 'Event' | 'Admin';
  date: string;
  preview: string;
  isRead: boolean;
  priority?: 'High' | 'Normal';
}

export interface EventItem {
  id: string;
  title: string;
  date: string; // ISO date
  time: string;
  location: string;
  image?: string;
  category: 'Sports' | 'Cultural' | 'Tech' | 'Workshop';
}

export interface Resource {
  id: string;
  name: string;
  type: 'PDF' | 'DOC' | 'LINK' | 'VIDEO';
  course: string;
  size?: string;
  dateAdded: string;
}

export type TabView = 'dashboard' | 'timetable' | 'notices' | 'events' | 'resources' | 'profile' | 'admin';
