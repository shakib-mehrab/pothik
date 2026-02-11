// ==================== User Types ====================
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  contributionPoints: number;
  stats: {
    restaurantsSubmitted: number;
    hotelsSubmitted: number;
    marketsSubmitted: number;
    travelGuidesCreated: number;
    approvedSubmissions: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Restaurant Types ====================
export interface Restaurant {
  id: string;
  name: string;
  location: string;
  howToGo: string;
  bestItem: string;
  reviews: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
  lastUpdated: string;
}

// ==================== Hotel Types ====================
export interface Hotel {
  id: string;
  name: string;
  location: string;
  howToGo: string;
  coupleFriendly: boolean;
  documentsNeeded: string[];
  facebookPage: string;
  reviews: string;
  category: 'hotel' | 'resort';
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
  lastUpdated: string;
}

// ==================== Market Types ====================
export interface Market {
  id: string;
  name: string;
  location: string;
  howToGo: string;
  specialty: string[];
  reviews: string;
  category: 'brands' | 'local' | 'budget' | 'others';
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
  lastUpdated: string;
}

// ==================== Travel Guide Types ====================
export interface TravelGuide {
  id: string;
  place: string;
  description: string;
  budget: string;
  mustVisitPlaces: string[];
  recommendedHotels: string[];
  howToGo: string;
  sourceType: 'manual' | 'tour_conversion';
  sourceTourId?: string;
  createdBy: string;
  creatorName?: string;
  createdAt: Date;
  status: 'published';
}

// ==================== Tour Types ====================
export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
}

export interface Tour {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  members: string[];
  places: string[];
  expenses: Expense[];
  todos: TodoItem[];
  isActive: boolean;
  userId: string;
  convertedToGuide: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Submission Types ====================
export interface Submission {
  id: string;
  type: 'restaurant' | 'hotel' | 'market';
  itemId: string;
  submittedBy: string;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  data: Restaurant | Hotel | Market;
}

// ==================== Leaderboard Types ====================
export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL?: string;
  totalPoints: number;
  rank: number;
  breakdown: {
    restaurants: number;
    hotels: number;
    markets: number;
    travelGuides: number;
  };
  updatedAt: Date;
}

// ==================== Transport Types ====================
export interface LocalBus {
  id: string;
  name: string;
  fromStation: string;
  toStation: string;
  route: string[];
  hours: string;
  type: 'Semi-Seating' | 'Seating';
}

export interface LongDistanceBus {
  id: string;
  company: string;
  route: {
    from: string;
    to: string;
  };
  fare: string;
  contactNumber: string;
  schedule: string;
  counterLocation: string;
}

export interface TrainSchedule {
  id: string;
  trainName: string;
  trainNumber: string;
  route: {
    from: string;
    to: string;
  };
  departureTime: string;
  arrivalTime: string;
  fare: string;
  trainType: string;
  daysOfOperation: string[];
}

// ==================== Form Input Types ====================
export interface RestaurantFormData {
  name: string;
  location: string;
  howToGo: string;
  bestItem: string;
  reviews: string;
}

export interface HotelFormData {
  name: string;
  location: string;
  howToGo: string;
  coupleFriendly: boolean;
  facebookPage: string;
  reviews: string;
}

export interface MarketFormData {
  name: string;
  location: string;
  howToGo: string;
  reviews: string;
}

export interface TravelGuideFormData {
  place: string;
  description: string;
  budget: string;
  mustVisitPlaces: string[];
  recommendedHotels: string[];
  howToGo: string;
}
