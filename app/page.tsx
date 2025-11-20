'use client';

import dynamic from 'next/dynamic';
import Sidebar from '@/app/components/Sidebar'; 
import { ShieldAlert, Activity, Sprout, Users } from 'lucide-react';
import { DISTRICTS_DATA } from '@/app/data/districts'; // เรียกข้อมูลกลาง

const MapWithNoSSR = dynamic(() => import('@/app/components/Map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white animate-pulse">กำลังโหลดแผนที่...</div>
});

// ข้อมูลภาพรวมจังหวัด (ยังคงไว้หน้าแรกได้ หรือจะแยกไฟล์ก็ได้)
const PROVINCE_DATA = {
  name: "จังหวัดขอนแก่น",
  avgScore: 61.9,
  districtCount: DISTRICTS_DATA.length, // นับจากข้อมูลจริงได้เลย
  categories: [
    { id: 1, name: "ภัยพิบัติและอันตรายจากธรรมชาติ", score: 65, icon: <ShieldAlert size={24} /> },
    { id: 2, name: "ศักยภาพการรับมือการเปลี่ยนแปลง", score: 72, icon: <Activity size={24} /> },
    { id: 3, name: "ทรัพยากรธรรมชาติ", score: 58, icon: <Sprout size={24} /> },
    { id: 4, name: "ความพร้อมทางด้านสังคมและเศรษฐกิจ", score: 68, icon: <Users size={24} /> },
  ]
};

const MapLegend = () => {
  return (
    <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl z-[1000] min-w-[180px] border border-gray-100 font-sans">
      <h4 className="font-bold mb-3 text-gray-800 text-sm border-b pb-2">ระดับคะแนน</h4>
      <div className="space-y-2 text-xs">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#4CAF50] mr-3 shadow-sm ring-1 ring-gray-200"></span>
          <span className="text-gray-600 font-medium">70+ (ดีมาก)</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#FBC02D] mr-3 shadow-sm ring-1 ring-gray-200"></span>
          <span className="text-gray-600 font-medium">60-69 (ปานกลาง)</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#D32F2F] mr-3 shadow-sm ring-1 ring-gray-200"></span>
          <span className="text-gray-600 font-medium">&lt; 60 (ต้องปรับปรุง)</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      <Sidebar provinceData={PROVINCE_DATA} />
      <div className="flex-grow relative h-full w-full">
        {/* ส่งข้อมูลกลางไปให้ Map */}
        <MapWithNoSSR districts={DISTRICTS_DATA} />
        <MapLegend />
      </div>
    </div>
  );
}