export interface DistrictData {
  id: number;
  name: string;
  score: number;
  lat: number;
  lng: number;
  status: 'good' | 'mid' | 'bad';
  radar: { subject: string; A: number; fullMark: number }[];
  details: {
    disaster: number;
    potential: number;
    resource: number;
    social: number;
  };
  descriptions?: {
    disaster?: string;
    potential?: string;
    resource?: string;
    social?: string;
  };
}