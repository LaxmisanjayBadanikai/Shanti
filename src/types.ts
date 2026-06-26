export enum Role {
  CITIZEN = 'Citizen',
  POLICE = 'Police',
  DISTRICT_ADMIN = 'District Administration',
  NGO = 'NGO',
  HOSPITAL = 'Hospital',
  VOLUNTEER = 'Volunteer'
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  language: string;
  createdAt: string;
}

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
export type IncidentStatus = 'Reported' | 'Verified' | 'Dispatched' | 'Resolving' | 'Resolved';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorRole: Role;
  text: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'report' | 'verify' | 'dispatch' | 'update' | 'resolve' | 'comment';
  userRole?: Role;
  userName?: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: Severity;
  status: IncidentStatus;
  location: Location;
  reportedBy: string;
  reportedByName: string;
  assignedTeam?: string;
  aiSummary?: string;
  duplicateOf?: string; // ID of primary incident if duplicate
  priorityScore: number; // 0-100 score
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  timeline: TimelineEvent[];
  mediaUrls: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // Volunteer UID
  status: 'Pending' | 'Accepted' | 'Completed';
  location: Location;
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'emergency' | 'road' | 'weather' | 'announcement';
  timestamp: string;
  isRead: boolean;
}

export interface Shelter {
  id: string;
  name: string;
  location: Location;
  capacity: number;
  occupied: number;
  foodAvailable: boolean;
  medicalAvailable: boolean;
  waterAvailable: boolean;
}

export interface BedAvailability {
  total: number;
  available: number;
  icuTotal: number;
  icuAvailable: number;
  ambulancesActive: number;
  ambulancesTotal: number;
}
