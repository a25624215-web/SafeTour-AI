import axios from 'axios';

// Use relative URL so Vite dev proxy handles routing to backend port 8000
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// =========================================================
// TYPES & INTERFACES
// =========================================================

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  profile_image?: string;
  is_active: boolean;
  created_at?: string;
}

export interface EmergencyContact {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  relationship?: string;
  is_primary: boolean;
  created_at?: string;
}

export interface SafetyAnalysisPayload {
  location: string;
  time: string; // 'day' | 'night' | 'late night'
  crowd_level: string; // 'high' | 'medium' | 'low'
  emergency?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface SafetyAnalysisResponse {
  project: string;
  location: string;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation: string;
  factors?: string[];
  inside_geofence?: boolean;
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

export interface GeofenceZone {
  id: number;
  name: string;
  description?: string;
  zone_type: string;
  risk_level: string;
  latitude: number;
  longitude: number;
  radius_km: number;
  advisory_message: string;
  is_active: boolean;
}

export interface SafetyReportPayload {
  user_id?: number;
  location_id?: number;
  report_type: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  latitude: number;
  longitude: number;
}

export interface Trip {
  id: number;
  user_id: number;
  destination: string;
  start_location?: string;
  start_date?: string;
  end_date?: string;
  safety_rating: string;
  status: string;
}

// =========================================================
// API SERVICE METHODS
// =========================================================

export const checkHealth = async () => {
  const res = await apiClient.get('/health');
  return res.data;
};

// --- AUTH & USER APIS ---
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}) => {
  const res = await apiClient.post('/auth/register', data);
  return res.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await apiClient.post('/auth/login', data);
  return res.data;
};

export const getUserProfile = async (userId: number) => {
  const res = await apiClient.get(`/auth/user/${userId}`);
  return res.data;
};

// --- SAFETY & AI RISK ---
export const analyzeSafety = async (payload: SafetyAnalysisPayload): Promise<SafetyAnalysisResponse> => {
  const res = await apiClient.post<SafetyAnalysisResponse>('/analyze-safety', payload);
  return res.data;
};

export const submitIncidentReport = async (payload: SafetyReportPayload) => {
  const res = await apiClient.post('/risk/report', payload);
  return res.data;
};

export const getSafetyReports = async (limit = 50) => {
  const res = await apiClient.get(`/risk/reports?limit=${limit}`);
  return res.data;
};

// --- SOS EMERGENCY ---
export const triggerSOS = async (payload: {
  latitude: number;
  longitude: number;
  user_id?: number;
  caller_name?: string;
  emergency_type?: string;
  message?: string;
}) => {
  const res = await apiClient.post('/sos/trigger', payload);
  return res.data;
};

export const sendEmergencyAlert = async (payload: EmergencyAlertPayload): Promise<EmergencyAlertResponse> => {
  const res = await apiClient.post<EmergencyAlertResponse>('/emergency-alert', payload);
  return res.data;
};

// --- GEOFENCING & NEARBY RADAR ---
export const getNearbySafety = async (latitude: number, longitude: number): Promise<NearbySafetyResponse> => {
  const res = await apiClient.get<NearbySafetyResponse>(`/nearby-safety?latitude=${latitude}&longitude=${longitude}`);
  return res.data;
};

export const checkZoneSafety = async (latitude: number, longitude: number): Promise<ZoneCheckResponse> => {
  const res = await apiClient.get<ZoneCheckResponse>(`/zone-check?latitude=${latitude}&longitude=${longitude}`);
  return res.data;
};

export const getGeofenceZones = async (): Promise<{ count: number; zones: GeofenceZone[] }> => {
  const res = await apiClient.get('/geofence/zones');
  return res.data;
};

// --- TOURIST TRIPS & TELEMETRY ---
export const getTouristTrips = async (userId: number) => {
  const res = await apiClient.get(`/tourist/${userId}/trips`);
  return res.data;
};

export const sendTelemetry = async (
  userId: number,
  telemetry: { latitude: number; longitude: number; speed_kmh?: number; battery_level?: number }
) => {
  const res = await apiClient.post(`/tourist/${userId}/telemetry`, telemetry);
  return res.data;
};
