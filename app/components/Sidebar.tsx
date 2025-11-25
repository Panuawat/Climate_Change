'use client';

import { Users, Info, CloudSun, X } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  score: number;
  icon: React.ReactNode;
}

interface ProvinceData {
  name: string;
  avgScore: number;
  districtCount: number;
  categories: Category[];
}

interface SidebarProps {
  provinceData: ProvinceData;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ provinceData, isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Overlay: เพิ่ม z-index เป็น 1900 */}
      <div
        className={`fixed inset-0 bg-black/50 z-[1900] transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar: เพิ่ม z-index เป็น 2000 (สูงกว่า Leaflet map controls ที่มักจะเป็น 1000) */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-2xl z-[2000] flex flex-col font-sans border-r border-gray-200 transition-transform duration-300 ease-in-out
        w-[85%] max-w-[380px]
        lg:relative lg:translate-x-0 lg:w-[420px] lg:z-20
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* --- 1. Logo & Close Button --- */}
        <div className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white shadow-sm mr-3">
              <CloudSun size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-800 leading-none">Climate Change</h1>
              <p className="text-[10px] text-gray-400 font-medium">Monitoring Dashboard</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full lg:hidden text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* --- 2. Header Section --- */}
        <div className="p-4 lg:p-6 bg-[#E8F5E9] text-green-900 relative shrink-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-sm font-semibold text-gray-500">ภาพรวมจังหวัดขอนแก่น</h2>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-[#2E7D32] tracking-tighter">{provinceData.avgScore}</h1>
              <p className="text-xs text-gray-500 mt-1">คะแนนเฉลี่ยจังหวัด</p>
            </div>

            <div className="bg-white p-3 rounded-xl shadow-sm border border-green-100 text-center min-w-[80px]">
              <div className="flex justify-center text-gray-400 mb-1"><Users size={16} /></div>
              <span className="block text-xl font-bold text-gray-800 leading-none">{provinceData.districtCount}</span>
              <span className="text-[10px] text-gray-400">อำเภอทั้งหมด</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-end mb-2">
              <h3 className="font-bold text-sm text-gray-800">ระดับดัชนีความพร้อมรับมือ</h3>
              <span className="bg-black text-white text-[10px] px-1.5 py-0.5 rounded">{provinceData.avgScore}</span>
            </div>

            <div className="relative h-3 w-full rounded-full bg-gray-200">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF5252] via-[#FFD740] to-[#4CAF50]"></div>
              <div
                className="absolute top-[-4px] h-5 w-[2px] bg-black border-white transform -translate-x-1/2 z-10"
                style={{ left: `${provinceData.avgScore}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
              <span>20</span>
              <span>40</span>
              <span>60</span>
              <span>80</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* --- 3. Scrollable Content --- */}
        <div className="p-4 bg-gray-50 flex-grow overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {provinceData.categories.map((cat) => (
              <div key={cat.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all cursor-pointer hover:border-green-400 group h-[140px] justify-between">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-green-700 group-hover:bg-green-50 transition-colors">
                  {cat.icon}
                </div>
                <span className="text-xs text-gray-600 font-medium px-1 leading-tight line-clamp-2 h-8 flex items-center">
                  {cat.name}
                </span>
                <span className="text-3xl font-bold text-[#2E7D32]">{cat.score}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100 mb-20 lg:mb-0">
            <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed">
              เลือกดูรายละเอียดรายอำเภอได้จากแผนที่ด้านขวา
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;