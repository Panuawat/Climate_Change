'use client';

import dynamic from 'next/dynamic';
import Sidebar from '@/app/components/Sidebar';
import { ShieldAlert, Activity, Sprout, Users, Menu } from 'lucide-react';
import { DistrictData } from '@/app/data/districts';
import { loadDistricts } from '@/app/utils/districts';
import { useState, useMemo, useEffect } from 'react';

// Map component now fetches its own data, so we don't need to pass props
const MapWithNoSSR = dynamic(() => import('@/app/components/Map'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 animate-pulse">กำลังโหลดแผนที่...</div>
});

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
  const [districts, setDistricts] = useState<DistrictData[]>([]);

  // Load real data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadDistricts();
        setDistricts(data);
      } catch (error) {
        console.error("Failed to load districts for sidebar:", error);
      }
    };
    fetchData();
  }, []);

  // --- คำนวณข้อมูลจังหวัดอัตโนมัติจาก districts state ---
  const provinceData = useMemo(() => {
    if (districts.length === 0) {
      return {
        name: "จังหวัดขอนแก่น",
        avgScore: 0,
        districtCount: 0,
        categories: []
      };
    }

    const count = districts.length;

    // 1. หาผลรวมคะแนนทั้งหมด
    const total = districts.reduce((acc, curr) => {
      return {
        score: acc.score + curr.score,
        disaster: acc.disaster + curr.details.disaster,
        potential: acc.potential + curr.details.potential,
        resource: acc.resource + curr.details.resource,
        social: acc.social + curr.details.social,
      };
    }, { score: 0, disaster: 0, potential: 0, resource: 0, social: 0 });

    // 2. หารด้วยจำนวนอำเภอเพื่อหาค่าเฉลี่ย (ทศนิยม 1 ตำแหน่ง)
    return {
      name: "จังหวัดขอนแก่น",
      avgScore: parseFloat((total.score / count).toFixed(1)), // คะแนนรวมเฉลี่ย
      districtCount: count,
      categories: [
        {
          id: 1,
          name: "ภัยพิบัติและอันตรายจากธรรมชาติ",
          score: parseFloat((total.disaster / count).toFixed(0)), // ปัดเศษคะแนนรายด้าน
          icon: <ShieldAlert size={24} />
        },
        {
          id: 2,
          name: "ศักยภาพการรับมือการเปลี่ยนแปลง",
          score: parseFloat((total.potential / count).toFixed(0)),
          icon: <Activity size={24} />
        },
        {
          id: 3,
          name: "ทรัพยากรธรรมชาติ",
          score: parseFloat((total.resource / count).toFixed(0)),
          icon: <Sprout size={24} />
        },
        {
          id: 4,
          name: "ความพร้อมทางด้านสังคมและเศรษฐกิจ",
          score: parseFloat((total.social / count).toFixed(0)),
          icon: <Users size={24} />
        },
      ]
    };
  }, [districts]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100 relative">

      <Sidebar
        provinceData={provinceData}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-grow relative h-full w-full">

        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden absolute bottom-6 left-4 z-[2000] bg-green-600 text-white p-3 rounded-full shadow-xl hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center border-2 border-white cursor-pointer"
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>

        <MapWithNoSSR />

        <MapLegend />
      </div>
    </div>
  );
}