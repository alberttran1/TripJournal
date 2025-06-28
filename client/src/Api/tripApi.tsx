import type { TripData } from '../types';
import http from './http';

export const createTrip = async (tripData: Partial<TripData>) =>
  (await http.post("/trips", tripData)).data

export const getTrips = async () =>
  (await http.get("/trips")).data;

export const getTrip = async (uid: string) => 
  (await http.get(`/trips/${uid}`)).data

export const editTrip = async (uid: string, tripData: Partial<TripData>) =>
  (await http.put(`/trips/${uid}`, tripData)).data

export const deleteTrip = async (uid: string) => 
  (await http.delete(`/trips/${uid}`)).data