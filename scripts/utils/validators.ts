import { z } from 'zod';

// Restaurant Schema
export const restaurantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  howToGo: z.string().min(1, 'How to go is required'),
  bestItem: z.string().min(1, 'Best item is required'),
  reviews: z.string().min(1, 'Reviews are required'),
  status: z.enum(['pending', 'approved', 'rejected']).default('approved'),
  submittedBy: z.string().default('admin'),
  submittedByName: z.string().default('Admin'),
  lastUpdated: z.string(),
});

// Hotel Schema
export const hotelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  howToGo: z.string().min(1, 'How to go is required'),
  coupleFriendly: z.boolean().default(false),
  documentsNeeded: z.array(z.string()).default([]),
  facebookPage: z.string().default(''),
  reviews: z.string().min(1, 'Reviews are required'),
  category: z.enum(['hotel', 'resort']),
  status: z.enum(['pending', 'approved', 'rejected']).default('approved'),
  submittedBy: z.string().default('admin'),
  submittedByName: z.string().default('Admin'),
  lastUpdated: z.string(),
});

// Market Schema
export const marketSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  howToGo: z.string().min(1, 'How to go is required'),
  specialty: z.array(z.string()).min(1, 'At least one specialty is required'),
  reviews: z.string().min(1, 'Reviews are required'),
  category: z.enum(['brands', 'local', 'budget', 'others']),
  status: z.enum(['pending', 'approved', 'rejected']).default('approved'),
  submittedBy: z.string().default('admin'),
  submittedByName: z.string().default('Admin'),
  lastUpdated: z.string(),
});

// Metro Station Schema
export const metroStationSchema = z.object({
  nameBangla: z.string().min(1, 'Bangla name is required'),
  nameEnglish: z.string().min(1, 'English name is required'),
  gates: z.array(
    z.object({
      name: z.string(),
      exitTo: z.string(),
      landmarks: z.array(z.string()),
    })
  ).default([]),
  nearbyPlaces: z.array(
    z.object({
      name: z.string(),
      howToGo: z.string(),
    })
  ).default([]),
  fare: z.string().default(''),
  lastUpdated: z.string(),
});

// Local Bus Schema
export const localBusSchema = z.object({
  name: z.string().min(1, 'Bus name is required'),
  fromStation: z.string().min(1, 'From station is required'),
  toStation: z.string().min(1, 'To station is required'),
  route: z.array(z.string()).min(1, 'At least one route stop is required'),
  hours: z.string().default('6:00 AM–10:00 PM'),
  type: z.enum(['Semi-Seating', 'Seating']).default('Semi-Seating'),
});

// Long Distance Bus Schema
export const longDistanceBusSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  route: z.object({
    from: z.string().min(1, 'From location is required'),
    to: z.string().min(1, 'To location is required'),
  }),
  fare: z.string().default(''),
  contactNumber: z.string().default(''),
  schedule: z.string().default(''),
  counterLocation: z.string().default(''),
});

// Train Schedule Schema
export const trainScheduleSchema = z.object({
  trainName: z.string().min(1, 'Train name is required'),
  trainNumber: z.string().min(1, 'Train number is required'),
  route: z.object({
    from: z.string().min(1, 'From station is required'),
    to: z.string().min(1, 'To station is required'),
  }),
  departureTime: z.string().default(''),
  arrivalTime: z.string().default(''),
  fare: z.string().default(''),
  trainType: z.string().default(''),
  daysOfOperation: z.array(z.string()).default([]),
});

export type RestaurantData = z.infer<typeof restaurantSchema>;
export type HotelData = z.infer<typeof hotelSchema>;
export type MarketData = z.infer<typeof marketSchema>;
export type MetroStationData = z.infer<typeof metroStationSchema>;
export type LocalBusData = z.infer<typeof localBusSchema>;
export type LongDistanceBusData = z.infer<typeof longDistanceBusSchema>;
export type TrainScheduleData = z.infer<typeof trainScheduleSchema>;

export const schemas = {
  restaurant: restaurantSchema,
  hotel: hotelSchema,
  resort: hotelSchema,
  market: marketSchema,
  metroStation: metroStationSchema,
  localBus: localBusSchema,
  longDistanceBus: longDistanceBusSchema,
  trainSchedule: trainScheduleSchema,
};

export type SchemaType = keyof typeof schemas;

export function validateData<T>(
  data: unknown,
  schemaType: SchemaType
): { success: boolean; data?: T; errors?: z.ZodError } {
  const schema = schemas[schemaType];
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data as T };
  } else {
    return { success: false, errors: result.error };
  }
}
