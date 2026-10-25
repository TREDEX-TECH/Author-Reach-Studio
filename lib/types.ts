export type RoleKey = 'author' | 'team' | 'admin';

export interface Service {
  slug: string; name: string; category: string; shortPromise: string;
  description: string; scope: string[]; deliverables: string[];
  eligibility: string; duration: string; pricing: string; icon: string;
}
export interface Project {
  id: string; name: string; book: string; status: string; tone: string;
  progress: number; manager: string; due: string; milestones: { label: string; done: boolean }[];
}
export interface Invoice {
  id: string; number: string; date: string; due: string; amount: number;
  status: string; tone: string; description: string;
}
export interface Task {
  id: string; title: string; project: string; due: string; status: string; tone: string; priority: string;
}
export interface Book {
  id: string; title: string; subtitle: string; genre: string; isbn: string; status: string;
}
