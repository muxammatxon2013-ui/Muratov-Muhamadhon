/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Gender = 'male' | 'female';

export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  birthYear?: number;
  deathYear?: number;
  gender: Gender;
  parents: string[]; // List of IDs (Father, Mother)
  children: string[]; // List of IDs
  spouses: string[]; // List of IDs
  bio?: string;
  photoUrl?: string;
  occupation?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  year?: number;
  description?: string;
}

export interface HistoryEntry {
  id: string;
  year: number;
  title: string;
  content: string;
}

export interface TreeData {
  members: Record<string, FamilyMember>;
  roots: string[];
  gallery: GalleryItem[];
  history: HistoryEntry[];
}
