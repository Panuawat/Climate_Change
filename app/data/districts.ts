// app/data/districts.ts

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
}

export const DISTRICTS_DATA: DistrictData[] = [
  { 
    id: 1, 
    name: "เมืองขอนแก่น", 
    score: 75.8, 
    lat: 16.4419, 
    lng: 102.8360, 
    status: 'good',
    radar: [
      { subject: 'ภัยธรรมชาติ', A: 80, fullMark: 100 },
      { subject: 'ศักยภาพการปรับตัว', A: 90, fullMark: 100 },
      { subject: 'ทรัพยากรธรรมชาติ', A: 70, fullMark: 100 },
      { subject: 'สังคม-เศรษฐกิจ', A: 85, fullMark: 100 },
      { subject: 'มุมมองประชาชน', A: 60, fullMark: 100 },
    ],
    details: {
      disaster: 68,
      potential: 82,
      resource: 65,
      social: 85
    }
  },
  { 
    id: 2, 
    name: "บ้านไผ่", 
    score: 75.4, 
    lat: 16.0583, 
    lng: 102.7333, 
    status: 'good',
    radar: [
      { subject: 'ภัยธรรมชาติ', A: 65, fullMark: 100 },
      { subject: 'ศักยภาพการปรับตัว', A: 75, fullMark: 100 },
      { subject: 'ทรัพยากรธรรมชาติ', A: 85, fullMark: 100 },
      { subject: 'สังคม-เศรษฐกิจ', A: 80, fullMark: 100 },
      { subject: 'มุมมองประชาชน', A: 70, fullMark: 100 },
    ],
    details: {
      disaster: 65,
      potential: 75,
      resource: 85,
      social: 80
    }
  },
  { 
    id: 3, 
    name: "พล", 
    score: 65.0, 
    lat: 15.8167, 
    lng: 102.6000, 
    status: 'mid',
    radar: [
      { subject: 'ภัยธรรมชาติ', A: 50, fullMark: 100 },
      { subject: 'ศักยภาพการปรับตัว', A: 60, fullMark: 100 },
      { subject: 'ทรัพยากรธรรมชาติ', A: 70, fullMark: 100 },
      { subject: 'สังคม-เศรษฐกิจ', A: 65, fullMark: 100 },
      { subject: 'มุมมองประชาชน', A: 80, fullMark: 100 },
    ],
    details: {
      disaster: 55,
      potential: 60,
      resource: 70,
      social: 65
    }
  },
  { 
    id: 4, 
    name: "ชุมแพ", 
    score: 75.8, 
    lat: 16.5417, 
    lng: 102.1000, 
    status: 'good',
    radar: [
      { subject: 'ภัยธรรมชาติ', A: 75, fullMark: 100 },
      { subject: 'ศักยภาพการปรับตัว', A: 80, fullMark: 100 },
      { subject: 'ทรัพยากรธรรมชาติ', A: 70, fullMark: 100 },
      { subject: 'สังคม-เศรษฐกิจ', A: 78, fullMark: 100 },
      { subject: 'มุมมองประชาชน', A: 76, fullMark: 100 },
    ],
    details: {
      disaster: 72,
      potential: 78,
      resource: 75,
      social: 78
    }
  },
  { 
    id: 5, 
    name: "น้ำพอง", 
    score: 55.2, 
    lat: 16.7000, 
    lng: 102.8500, 
    status: 'bad',
    radar: [
      { subject: 'ภัยธรรมชาติ', A: 40, fullMark: 100 },
      { subject: 'ศักยภาพการปรับตัว', A: 50, fullMark: 100 },
      { subject: 'ทรัพยากรธรรมชาติ', A: 60, fullMark: 100 },
      { subject: 'สังคม-เศรษฐกิจ', A: 55, fullMark: 100 },
      { subject: 'มุมมองประชาชน', A: 70, fullMark: 100 },
    ],
    details: {
      disaster: 45,
      potential: 52,
      resource: 60,
      social: 55
    }
  },
  { 
    id: 6, 
    name: "อุบลรัตน์", 
    score: 70.1, 
    lat: 16.7500, 
    lng: 102.6167, 
    status: 'good',
    radar: [
      { subject: 'ภัยธรรมชาติ', A: 70, fullMark: 100 },
      { subject: 'ศักยภาพการปรับตัว', A: 70, fullMark: 100 },
      { subject: 'ทรัพยากรธรรมชาติ', A: 75, fullMark: 100 },
      { subject: 'สังคม-เศรษฐกิจ', A: 68, fullMark: 100 },
      { subject: 'มุมมองประชาชน', A: 65, fullMark: 100 },
    ],
    details: {
      disaster: 68,
      potential: 70,
      resource: 72,
      social: 68
    }
  }
];