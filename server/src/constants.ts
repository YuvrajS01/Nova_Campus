// College structure constants
export const BRANCHES = ['CSE', 'EEE', 'ME', 'CE'] as const;
export const YEARS = [1, 2, 3, 4] as const;
export const SECTIONS = ['A', 'B'] as const;

export type Branch = typeof BRANCHES[number];
export type Year = typeof YEARS[number];
export type Section = typeof SECTIONS[number];

// Validation helpers
export const isValidBranch = (value: string): value is Branch =>
    BRANCHES.includes(value as Branch);

export const isValidYear = (value: number): value is Year =>
    YEARS.includes(value as Year);

export const isValidSection = (value: string): value is Section =>
    SECTIONS.includes(value as Section);

// Semester range for CGPA
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export type Semester = typeof SEMESTERS[number];

export const isValidSemester = (value: number): value is Semester =>
    SEMESTERS.includes(value as Semester);

export const isValidCGPA = (value: number): boolean =>
    value >= 0.0 && value <= 10.0;
