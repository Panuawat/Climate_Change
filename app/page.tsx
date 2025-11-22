'use client';

import dynamic from 'next/dynamic';
import Sidebar from '@/app/components/Sidebar'; 
import { ShieldAlert, Activity, Sprout, Users, Menu } from 'lucide-react';
import { DISTRICTS_DATA, DistrictData } from '@/app/data/districts';
import { useState } from 'react';

// Interface สำหรับ Props ของ Map
interface MapProps {
  districts: DistrictData[];
}

// Dynamic Import
const MapWithNoSSR = dynamic<MapProps>(() => import('@/app/components/Map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 animate-pulse">กำลังโหลดแผนที่...</div>
});

const PROVINCE_DATA = {
  name: "จังหวัดขอนแก่น",
  avgScore: 61.9,
  districtCount: DISTRICTS_DATA.length,
  categories: [
    { id: 1, name: "ภัยพิบัติและอันตรายจากธรรมชาติ", score: 65, icon: <ShieldAlert size={24} /> },
    { id: 2, name: "ศักยภาพการรับมือการเปลี่ยนแปลง", score: 72, icon: <Activity size={24} /> },
    { id: 3, name: "ทรัพยากรธรรมชาติ", score: 58, icon: <Sprout size={24} /> },
    { id: 4, name: "ความพร้อมทางด้านสังคมและเศรษฐกิจ", score: 68, icon: <Users size={24} /> },
  ]
};

const MapLegend = () => {
  return (
    <div className="absolute bottom-20 right-4 lg:bottom-6 lg:right-6 bg-white p-4 rounded-lg shadow-lg z-[900] min-w-[160px] lg:min-w-[200px] border border-gray-200 font-sans text-xs lg:text-sm">
      <h4 className="font-bold mb-2 text-gray-800 uppercase tracking-wider text-[10px] lg:text-xs">Climate Resilience Index</h4>
      <div className="w-full h-3 lg:h-4 rounded-full bg-gradient-to-r from-[#F44336] via-[#FFEB3B] to-[#1B5E20] mb-1 border border-gray-300"></div>
      <div className="flex justify-between text-[9px] lg:text-[10px] text-gray-500 font-medium mb-2">
        <span>Low</span>
        <span>Mid</span>
        <span>High</span>
      </div>
      <div className="space-y-1 hidden lg:block">
        <div className="flex items-center text-[10px] text-gray-600"><span className="w-2 h-2 rounded-full bg-[#1B5E20] mr-2"></span> 80-100: ดีเยี่ยม</div>
        <div className="flex items-center text-[10px] text-gray-600"><span className="w-2 h-2 rounded-full bg-[#4CAF50] mr-2"></span> 60-79: ดี</div>
        <div className="flex items-center text-[10px] text-gray-600"><span className="w-2 h-2 rounded-full bg-[#F44336] mr-2"></span> 0-39: ต้องปรับปรุง</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100 relative">
      
      {/* Sidebar */}
      <Sidebar 
        provinceData={PROVINCE_DATA} 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-grow relative h-full w-full">
        
        {/* Map อยู่ก่อน */}
        <MapWithNoSSR districts={DISTRICTS_DATA} />
        
        {/* ปุ่มเปิดเมนู: ย้ายมาไว้หลัง Map และเพิ่ม z-index สูงๆ (z-[2000]) */}
        <button 
          onClick={() => {
            console.log("Menu Clicked!"); // Debug ดูได้ใน Console
            setSidebarOpen(true);
          }}
          className="lg:hidden absolute bottom-6 left-4 z-[2000] bg-green-600 text-white p-3 rounded-full shadow-xl hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center border-2 border-white cursor-pointer"
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>
        
        <MapLegend />
      </div>
    </div>
  );
}