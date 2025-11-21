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
    <div className="absolute bottom-6 right-6 bg-white p-4 rounded-lg shadow-lg z-[1000] min-w-[200px] border border-gray-200 font-sans">
      <h4 className="font-bold mb-2 text-gray-800 text-xs uppercase tracking-wider">Climate Resilience Index</h4>
      
      {/* Color Scale Bar */}
      <div className="w-full h-4 rounded-full bg-gradient-to-r from-[#F44336] via-[#FFEB3B] to-[#1B5E20] mb-1 border border-gray-300"></div>
      
      <div className="flex justify-between text-[10px] text-gray-500 font-medium">
        <span>0 (ต่ำ)</span>
        <span>50</span>
        <span>100 (สูง)</span>
      </div>
      
      <div className="mt-3 space-y-1">
        <div className="flex items-center text-[10px] text-gray-600">
           <span className="w-2 h-2 rounded-full bg-[#1B5E20] mr-2"></span> 80-100: ดีเยี่ยม
        </div>
        <div className="flex items-center text-[10px] text-gray-600">
           <span className="w-2 h-2 rounded-full bg-[#4CAF50] mr-2"></span> 60-79: ดี
        </div>
        <div className="flex items-center text-[10px] text-gray-600">
           <span className="w-2 h-2 rounded-full bg-[#F44336] mr-2"></span> 0-39: ต้องปรับปรุง
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