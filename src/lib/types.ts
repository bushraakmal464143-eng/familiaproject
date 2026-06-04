import type { OfferCategory } from "@/lib/offers";

export type OfferStatus = "active" | "draft" | "inactive";
export type CampingStatus = "pending" | "active" | "suspended";
export type BookingStatus = "pending" | "paid" | "cancelled";

export type Camping = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  location: string;
  region: string;
  description: string;
  photos: string[];
  status: CampingStatus;
  createdAt: string;
};

export type Customer = {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  googleId?: string;
  createdAt: string;
};

export type OfferRecord = {
  id: string;
  campingId: string;
  title: string;
  subtitle: string;
  rating: number;
  reviews: number;
  location: string;
  region: string;
  mealPlan?: string;
  highlights: string[];
  description: string;
  freeCancellation?: string;
  travelDates: string;
  priceFrom: number;
  image: string;
  gallery?: string[];
  badge?: string;
  saves?: number;
  countdown?: string;
  category: Exclude<OfferCategory, "all">;
  status: OfferStatus;
  featured?: boolean;
};

export type Booking = {
  id: string;
  offerId: string;
  campingId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
  paidAt?: string;
};
