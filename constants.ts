import { ClassSession, Notice, EventItem, Resource } from './types';
import { BookOpen, Calendar, Clock, FileText, Home, User, Bell, MapPin, Search, Filter } from 'lucide-react';

export const CLASSES: ClassSession[] = [
  {
    id: '1',
    courseCode: 'CS301',
    courseName: 'Advanced Algorithms',
    type: 'Lecture',
    startTime: '09:00',
    endTime: '10:30',
    location: 'Hall A2',
    professor: 'Dr. A. Turing',
    isOngoing: false,
  },
  {
    id: '2',
    courseCode: 'CS305',
    courseName: 'Machine Learning',
    type: 'Lab',
    startTime: '10:45',
    endTime: '12:45',
    location: 'Lab 4B',
    professor: 'Prof. G. Hinton',
    isOngoing: true,
  },
  {
    id: '3',
    courseCode: 'MAT202',
    courseName: 'Linear Algebra',
    type: 'Tutorial',
    startTime: '14:00',
    endTime: '15:30',
    location: 'Room 304',
    professor: 'Dr. E. Noether',
    isOngoing: false,
  }
];

export const NOTICES: Notice[] = [
  {
    id: 'n1',
    title: 'Mid-Semester Exam Schedule Released',
    category: 'Academic',
    date: '2023-10-24',
    preview: 'The final schedule for the upcoming mid-semester examinations has been published. Please check the student portal for details.',
    isRead: false,
    priority: 'High',
  },
  {
    id: 'n2',
    title: 'Campus Wi-Fi Maintenance',
    category: 'Admin',
    date: '2023-10-23',
    preview: 'Scheduled maintenance will occur on Saturday night from 11 PM to 4 AM. Internet services will be intermittent.',
    isRead: true,
    priority: 'Normal',
  },
  {
    id: 'n3',
    title: 'Hackathon Registration Open',
    category: 'Event',
    date: '2023-10-22',
    preview: 'Sign up for the annual CodeFest 2023. Teams of 4 allowed. Great prizes to be won!',
    isRead: false,
    priority: 'Normal',
  }
];

export const EVENTS: EventItem[] = [
  {
    id: 'e1',
    title: 'Neon Nights: Cultural Fest',
    date: '2023-11-15',
    time: '18:00',
    location: 'Main Auditorium',
    category: 'Cultural',
    image: 'https://picsum.photos/seed/neon/800/400'
  },
  {
    id: 'e2',
    title: 'AI in Healthcare Seminar',
    date: '2023-11-20',
    time: '14:00',
    location: 'Seminar Hall 1',
    category: 'Tech',
    image: 'https://picsum.photos/seed/tech/800/400'
  },
  {
    id: 'e3',
    title: 'Inter-College Football Final',
    date: '2023-11-22',
    time: '16:00',
    location: 'Sports Ground',
    category: 'Sports',
    image: 'https://picsum.photos/seed/sports/800/400'
  }
];

export const RESOURCES: Resource[] = [
  { id: 'r1', name: 'Algorithm Complexity Cheatsheet', type: 'PDF', course: 'CS301', size: '2.4 MB', dateAdded: 'Oct 20' },
  { id: 'r2', name: 'Week 5 Lecture Notes', type: 'DOC', course: 'CS305', size: '540 KB', dateAdded: 'Oct 18' },
  { id: 'r3', name: 'Linear Regression Tutorial', type: 'VIDEO', course: 'CS305', size: '15 min', dateAdded: 'Oct 15' },
  { id: 'r4', name: 'Project Guidelines', type: 'PDF', course: 'MAT202', size: '1.1 MB', dateAdded: 'Oct 12' },
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'timetable', label: 'Schedule', icon: Calendar },
  { id: 'notices', label: 'Alerts', icon: Bell },
  { id: 'events', label: 'Events', icon: MapPin },
  { id: 'resources', label: 'Library', icon: BookOpen },
  { id: 'profile', label: 'Profile', icon: User },
];
