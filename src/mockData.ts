import { Role, Incident, UserProfile, Shelter, AppNotification, BedAvailability, Task } from './types';

export const INITIAL_USER: UserProfile = {
  uid: 'user-admin-1',
  name: 'Shanti Coordination Center',
  email: 'admin@shanti.gov',
  phone: '+91 98765 43210',
  role: Role.DISTRICT_ADMIN,
  language: 'English',
  createdAt: '2026-06-20T10:00:00Z',
};

export const SAMPLE_USERS: UserProfile[] = [
  {
    uid: 'user-citizen-1',
    name: 'Ananya Sharma',
    email: 'ananya@gmail.com',
    phone: '+91 99999 88888',
    role: Role.CITIZEN,
    language: 'Hindi',
    createdAt: '2026-06-21T08:30:00Z',
  },
  {
    uid: 'user-police-1',
    name: 'Inspector Rajesh Kumar',
    email: 'rajesh.police@shanti.gov',
    phone: '+91 98765 11111',
    role: Role.POLICE,
    language: 'English',
    createdAt: '2026-06-15T09:00:00Z',
  },
  {
    uid: 'user-ngo-1',
    name: 'Siddharth Patel (Peace Foundation)',
    email: 'siddharth@peacefoundation.org',
    phone: '+91 98765 22222',
    role: Role.NGO,
    language: 'Gujarati',
    createdAt: '2026-06-18T14:20:00Z',
  },
  {
    uid: 'user-hospital-1',
    name: 'Dr. Meera Alvi (City General Hospital)',
    email: 'meera.alvi@cityhospital.org',
    phone: '+91 98765 33333',
    role: Role.HOSPITAL,
    language: 'English',
    createdAt: '2026-06-12T11:00:00Z',
  },
  {
    uid: 'user-volunteer-1',
    name: 'Kabir Das',
    email: 'kabir.v@shanti.org',
    phone: '+91 98765 44444',
    role: Role.VOLUNTEER,
    language: 'Hindi',
    createdAt: '2026-06-22T07:15:00Z',
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-1',
    title: 'Waterlogged Area near Shanti Ground Festival Area',
    description: 'Due to unexpected pre-monsoon heavy rains, the main entrance of Shanti Ground is heavily waterlogged. This is blocking the main pathway for the multi-faith community festival. Elderly citizens and children are finding it extremely difficult to enter safely.',
    category: 'Civic Infrastructure',
    severity: 'Medium',
    status: 'Verified',
    location: {
      lat: 18.5204,
      lng: 73.8567,
      address: 'Entrance Gate 2, Shanti Ground, Pune Central',
    },
    reportedBy: 'user-citizen-1',
    reportedByName: 'Ananya Sharma',
    assignedTeam: 'Municipal Water Drainage Team A',
    aiSummary: 'Waterlogging at Festival Entrance Gate 2 is hindering access for vulnerable citizens. It requires immediate drainage pumps and alternate walking boards.',
    priorityScore: 55,
    createdAt: '2026-06-25T18:30:00Z',
    updatedAt: '2026-06-25T19:00:00Z',
    mediaUrls: [
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=400'
    ],
    comments: [
      {
        id: 'c-1',
        authorName: 'Siddharth Patel',
        authorRole: Role.NGO,
        text: 'Our NGO volunteers have laid down wooden boards and sandbags temporarily so people can walk. We need additional assistance from the administration to drain the water completely.',
        createdAt: '2026-06-25T18:45:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl-1',
        title: 'Incident Reported',
        description: 'Ananya Sharma reported a waterlogged pathway blocking the festival entry gate.',
        timestamp: '2026-06-25T18:30:00Z',
        type: 'report',
        userName: 'Ananya Sharma',
        userRole: Role.CITIZEN
      },
      {
        id: 'tl-2',
        title: 'Incident Verified',
        description: 'Admin verified the report and marked severity as Medium.',
        timestamp: '2026-06-25T19:00:00Z',
        type: 'verify',
        userName: 'Admin'
      }
    ]
  },
  {
    id: 'inc-2',
    title: 'Traffic Gridlock & Congestion near Hospital Lane',
    description: 'There is a complete traffic gridlock on the main bypass connecting the Harmony Procession to the City Emergency Hospital. Ambulance pathways are blocked. Urgent traffic management and diversions are needed.',
    category: 'Traffic & Crowd Management',
    severity: 'High',
    status: 'Dispatched',
    location: {
      lat: 18.5304,
      lng: 73.8650,
      address: 'Hospital Junction, National Highway Bypass',
    },
    reportedBy: 'user-hospital-1',
    reportedByName: 'Dr. Meera Alvi',
    assignedTeam: 'Traffic Control Unit 4',
    aiSummary: 'Traffic blockage on critical ambulance route connecting processional area to City General Hospital. High impact on emergency ambulance transit.',
    priorityScore: 82,
    createdAt: '2026-06-25T20:15:00Z',
    updatedAt: '2026-06-25T20:45:00Z',
    mediaUrls: [
      'https://images.unsplash.com/photo-1510931149491-d2547b74e64f?auto=format&fit=crop&q=80&w=400'
    ],
    comments: [
      {
        id: 'c-2',
        authorName: 'Inspector Rajesh Kumar',
        authorRole: Role.POLICE,
        text: 'Dispatched two traffic officers to manually guide ambulances through the service lane. We are setting up physical barricades to block non-emergency private cars from entering the bypass.',
        createdAt: '2026-06-25T20:30:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl-3',
        title: 'Incident Reported',
        description: 'Dr. Meera Alvi flagged complete block of emergency path.',
        timestamp: '2026-06-25T20:15:00Z',
        type: 'report',
        userName: 'Dr. Meera Alvi',
        userRole: Role.HOSPITAL
      },
      {
        id: 'tl-4',
        title: 'Police Dispatched',
        description: 'Inspector Rajesh Kumar assigned Traffic Control Unit 4 to establish a green emergency corridor.',
        timestamp: '2026-06-25T20:25:00Z',
        type: 'dispatch',
        userName: 'Inspector Rajesh Kumar',
        userRole: Role.POLICE
      }
    ]
  },
  {
    id: 'inc-3',
    title: 'Heat Exhaustion Cases at Community Gathering Point',
    description: 'Due to very high afternoon temperatures and high humidity, multiple citizens at the Unity Peace Rally have fainted or are showing signs of severe heat stroke. We need extra drinking water stalls, hydration packs, and first aid kits immediately.',
    category: 'Medical Emergency',
    severity: 'High',
    status: 'Verified',
    location: {
      lat: 18.5112,
      lng: 73.8480,
      address: 'Central Park Ground, Ward 15',
    },
    reportedBy: 'user-ngo-1',
    reportedByName: 'Siddharth Patel',
    assignedTeam: 'Medical Response Volunteers B',
    aiSummary: 'Heatstroke emergency at Central Park. Immediate medical supplies, shaded resting canopies, cold water distribution, and volunteer paramedics required.',
    priorityScore: 78,
    createdAt: '2026-06-25T21:40:00Z',
    updatedAt: '2026-06-25T22:00:00Z',
    mediaUrls: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400'
    ],
    comments: [
      {
        id: 'c-3',
        authorName: 'Kabir Das',
        authorRole: Role.VOLUNTEER,
        text: 'I am on-site. We have moved 5 patients into the shade. We need more ORS packets. NGO is bringing some, but we need more volunteers to fan and assist them.',
        createdAt: '2026-06-25T21:55:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl-5',
        title: 'Emergency Reported',
        description: 'Siddharth Patel reported multiple fainted attendees at Central Park.',
        timestamp: '2026-06-25T21:40:00Z',
        type: 'report',
        userName: 'Siddharth Patel',
        userRole: Role.NGO
      },
      {
        id: 'tl-6',
        title: 'First Responders Deployed',
        description: 'Volunteer team dispatched with ice-packs and rehydration salts.',
        timestamp: '2026-06-25T21:50:00Z',
        type: 'dispatch',
        userName: 'Admin'
      }
    ]
  },
  {
    id: 'inc-4',
    title: 'Minor Overcrowding & Confusion at Railway Subway Gate',
    description: 'A minor bottleneck has formed at the railway station exit leading to the Shanti Mosque during evening prayer transition. People are moving extremely slowly, creating a risk of panic. No injuries. Need clear megaphone instructions, lighting, and queue dividers.',
    category: 'Traffic & Crowd Management',
    severity: 'Critical',
    status: 'Reported',
    location: {
      lat: 18.5255,
      lng: 73.8610,
      address: 'Subway Gate A, Junction Railway Station',
    },
    reportedBy: 'user-volunteer-1',
    reportedByName: 'Kabir Das',
    aiSummary: 'Potential crowd crush bottleneck forming at subway exit. Requires immediate police dispersion/queue control and audio announcement routing.',
    priorityScore: 90,
    createdAt: '2026-06-25T22:15:00Z',
    updatedAt: '2026-06-25T22:15:00Z',
    mediaUrls: [
      'https://images.unsplash.com/photo-1496180727794-817822f65950?auto=format&fit=crop&q=80&w=400'
    ],
    comments: [],
    timeline: [
      {
        id: 'tl-7',
        title: 'Bottleneck Identified',
        description: 'Kabir Das flagged high-density crowd accumulation at Subway Gate A.',
        timestamp: '2026-06-25T22:15:00Z',
        type: 'report',
        userName: 'Kabir Das',
        userRole: Role.VOLUNTEER
      }
    ]
  }
];

export const INITIAL_SHELTERS: Shelter[] = [
  {
    id: 'shelter-1',
    name: 'Harmony Relief Hall & Food Center',
    location: {
      lat: 18.5150,
      lng: 73.8500,
      address: 'Near Old Market, Zone 3'
    },
    capacity: 250,
    occupied: 110,
    foodAvailable: true,
    medicalAvailable: true,
    waterAvailable: true,
  },
  {
    id: 'shelter-2',
    name: 'Community Center Shelter - North Zone',
    location: {
      lat: 18.5350,
      lng: 73.8700,
      address: 'Block B, Sector 4'
    },
    capacity: 150,
    occupied: 35,
    foodAvailable: true,
    medicalAvailable: false,
    waterAvailable: true,
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '⚠️ EMERGENCY WATER ALERT',
    body: 'Heavy waterlogging near Gate 2, Shanti Ground. All visitors advised to use Entrance Gate 1 or Gate 4 which are dry and fully accessible. Police officers on site are guiding pedestrian queues.',
    type: 'emergency',
    timestamp: '2026-06-25T19:15:00Z',
    isRead: false,
  },
  {
    id: 'notif-2',
    title: '🚦 Road Closure: Harmony Parade Route',
    body: 'The main avenue between Plaza Circle and Shanti Chowk will be closed for vehicle traffic between 4 PM and 9 PM today for the Pluralism Cultural March. Please use the outer ring road bypass.',
    type: 'road',
    timestamp: '2026-06-25T15:00:00Z',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: '⛈️ Sudden Thunderstorm Warning',
    body: 'Meteorological department predicts heavy localized showers and lightning between 6 PM and 8 PM tonight. Please take shelter in designated multi-community relief halls.',
    type: 'weather',
    timestamp: '2026-06-25T17:00:00Z',
    isRead: true,
  }
];

export const INITIAL_BED_AVAILABILITY: BedAvailability = {
  total: 500,
  available: 84,
  icuTotal: 60,
  icuAvailable: 8,
  ambulancesActive: 12,
  ambulancesTotal: 15,
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Distribute ORS Hydration Packs at Central Park',
    description: 'Collect 100 ORS packs and 5 crates of drinking water from Harmony Relief Hall (Shelter 1) and distribute them to the NGO shelter booth inside Central Park where fainted attendees are resting.',
    assignedTo: 'user-volunteer-1',
    status: 'Accepted',
    location: {
      lat: 18.5112,
      lng: 73.8480,
      address: 'Central Park Ground, Ward 15',
    },
    createdAt: '2026-06-25T21:45:00Z',
    updatedAt: '2026-06-25T21:50:00Z'
  },
  {
    id: 'task-2',
    title: 'Coordinate Subway Gate Crowding Divider Setup',
    description: 'Deliver 15 portable plastic queue barriers from Station Police Outpost to Subway Gate A. Help police officers set up safe pedestrian queues.',
    assignedTo: 'user-volunteer-1',
    status: 'Pending',
    location: {
      lat: 18.5255,
      lng: 73.8610,
      address: 'Subway Gate A, Junction Railway Station',
    },
    createdAt: '2026-06-25T22:18:00Z',
    updatedAt: '2026-06-25T22:18:00Z'
  }
];
