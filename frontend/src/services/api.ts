import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export interface SafetyAnalysisPayload {
  location: string;
  time: string; // 'day' | 'night' | 'late night'
  crowd_level: string; // 'high' | 'medium' | 'low'
  emergency?: boolean;
}

export interface SafetyAnalysisResponse {
  project: string;
  location: string;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation: string;
}

export interface EmergencyAlertPayload {
  name: string;
  location: string;
  emergency_type: string;
  message: string;
}

export interface EmergencyAlertResponse {
  project: string;
  alert_status: string;
  message: string;
  name: string;
  location: string;
  emergency_type: string;
  details: string;
}

export interface SafetyPoint {
  name: string;
  type: 'police' | 'hospital' | 'fire_station' | 'pharmacy' | string;
  latitude: number;
  longitude: number;
}

export interface NearbySafetyResponse {
  project: string;
  count: number;
  places: SafetyPoint[];
  error?: string;
}

export interface ZoneCheckResponse {
  project: string;
  inside_zone: boolean;
  zone_name: string | null;
  distance_km: number | null;
  risk_level: 'LOW' | 'CAUTION' | 'HIGH';
  message: string;
}

// API Service Methods
export const checkHealth = async () => {
  const res = await apiClient.get('/health');
  return res.data;
};

export const analyzeSafety = async (payload: SafetyAnalysisPayload): Promise<SafetyAnalysisResponse> => {
  const res = await apiClient.post<SafetyAnalysisResponse>('/analyze-safety', payload);
  return res.data;
};

export const sendEmergencyAlert = async (payload: EmergencyAlertPayload): Promise<EmergencyAlertResponse> => {
  const res = await apiClient.post<EmergencyAlertResponse>('/emergency-alert', payload);
  return res.data;
};

export const getNearbySafety = async (latitude: number, longitude: number): Promise<NearbySafetyResponse> => {
  const res = await apiClient.get<NearbySafetyResponse>(`/nearby-safety?latitude=${latitude}&longitude=${longitude}`);
  return res.data;
};

export const checkZoneSafety = async (latitude: number, longitude: number): Promise<ZoneCheckResponse> => {
  const res = await apiClient.get<ZoneCheckResponse>(`/zone-check?latitude=${latitude}&longitude=${longitude}`);
  return res.data;
};
