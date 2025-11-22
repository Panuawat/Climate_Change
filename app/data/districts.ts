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

// --- แก้ไขตรงนี้ ---
// ใช้ Pseudo-random แทน Math.random() เพื่อให้ Server และ Client ได้ค่าเดียวกันเสมอ
// โดยใช้ id ของอำเภอเป็นตัวกำหนดค่า (Seed)
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// ฟังก์ชันสุ่มคะแนนแบบคงที่ (Deterministic)
const getScore = (id: number, min: number, max: number, salt: number = 0) => {
  // ใช้ id + salt เพื่อให้แต่ละค่าของอำเภอเดียวกันไม่ซ้ำกัน
  const random = seededRandom(id * 13 + salt * 7); 
  return Math.floor(random * (max - min + 1)) + min;
};

// ฟังก์ชันช่วยสร้างข้อมูลอำเภอ
const createDistrict = (id: number, name: string, lat: number, lng: number): DistrictData => {
  // ใช้ getScore แทน randomScore เดิม
  const score = getScore(id, 40, 100, 0);
  
  let status: 'good' | 'mid' | 'bad' = 'mid';
  if (score >= 75) status = 'good';
  if (score < 60) status = 'bad';

  // สร้างคะแนนย่อยโดยใช้ salt ต่างกัน (1, 2, 3, 4, 5) เพื่อให้ตัวเลขไม่เหมือนกันเป๊ะ
  const disaster = getScore(id, score - 10, score + 10, 1);
  const potential = getScore(id, score - 5, score + 15, 2);
  const resource = getScore(id, score - 15, score + 5, 3);
  const social = getScore(id, score - 5, score + 10, 4);
  const people_view = getScore(id, score - 10, score + 10, 5);

  return {
    id,
    name,
    score,
    lat,
    lng,
    status,
    radar: [
      { subject: 'ภัยธรรมชาติ', A: Math.min(100, disaster), fullMark: 100 },
      { subject: 'ศักยภาพการปรับตัว', A: Math.min(100, potential), fullMark: 100 },
      { subject: 'ทรัพยากรธรรมชาติ', A: Math.min(100, resource), fullMark: 100 },
      { subject: 'สังคม-เศรษฐกิจ', A: Math.min(100, social), fullMark: 100 },
      { subject: 'มุมมองประชาชน', A: Math.min(100, people_view), fullMark: 100 },
    ],
    details: {
      disaster: Math.min(100, disaster),
      potential: Math.min(100, potential),
      resource: Math.min(100, resource),
      social: Math.min(100, social)
    }
  };
};

export const DISTRICTS_DATA: DistrictData[] = [
  createDistrict(1, "เมืองขอนแก่น", 16.4419, 102.8360),
  createDistrict(2, "บ้านฝาง", 16.4540, 102.6430),
  createDistrict(3, "พระยืน", 16.3250, 102.6480),
  createDistrict(4, "หนองเรือ", 16.5300, 102.4300),
  createDistrict(5, "ชุมแพ", 16.5417, 102.1000),
  createDistrict(6, "สีชมพู", 16.6700, 102.0200),
  createDistrict(7, "น้ำพอง", 16.7000, 102.8500),
  createDistrict(8, "อุบลรัตน์", 16.7500, 102.6167),
  createDistrict(9, "กระนวน", 16.7050, 103.0800),
  createDistrict(10, "บ้านไผ่", 16.0583, 102.7333),
  createDistrict(11, "เปือยน้อย", 15.8700, 102.9000),
  createDistrict(12, "พล", 15.8167, 102.6000),
  createDistrict(13, "แวงใหญ่", 15.9600, 102.5300),
  createDistrict(14, "แวงน้อย", 15.8000, 102.4200),
  createDistrict(15, "หนองสองห้อง", 15.7200, 102.7800),
  createDistrict(16, "ภูเวียง", 16.6500, 102.3700),
  createDistrict(17, "มัญจาคีรี", 16.1600, 102.5400),
  createDistrict(18, "ชนบท", 16.0900, 102.6200),
  createDistrict(19, "เขาสวนกวาง", 16.8500, 102.8700),
  createDistrict(20, "ภูผาม่าน", 16.6800, 101.8900),
  createDistrict(21, "ซำสูง", 16.5300, 103.0800),
  createDistrict(22, "โคกโพธิ์ไชย", 16.0900, 102.4200),
  createDistrict(23, "หนองนาคำ", 16.7800, 102.3300),
  createDistrict(24, "บ้านแฮด", 16.2100, 102.7500),
  createDistrict(25, "โนนศิลา", 15.9700, 102.6800),
  createDistrict(26, "เวียงเก่า", 16.6900, 102.3300),
];