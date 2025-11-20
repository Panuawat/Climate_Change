'use client';

import { useRouter, useParams } from 'next/navigation';
import { DISTRICTS_DATA } from '@/app/data/districts'; // เรียกใช้ข้อมูลจากไฟล์กลาง
import { ArrowLeft, CloudRain, Shield, Trees, Users, MapPin } from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

export default function DistrictDetail() {
  const router = useRouter();
  const params = useParams();
  
  // แปลง id จาก url เป็นตัวเลข แล้วค้นหาใน array ข้อมูล
  const district = DISTRICTS_DATA.find(d => d.id === Number(params.id));

  if (!district) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-400 mb-4">ไม่พบข้อมูลอำเภอนี้</h2>
        <button onClick={() => router.back()} className="text-green-600 hover:underline">กลับหน้าหลัก</button>
      </div>
    );
  }

  // เตรียมข้อมูลกราฟแท่ง (Mapping ข้อมูลให้ตรงกับ Recharts)
  const BAR_DATA = [
    { name: 'มุมมองปชช.', score: district.radar[4].A },
    { name: 'สังคม-ศก.', score: district.details.social },
    { name: 'ทรัพยากรฯ', score: district.details.resource },
    { name: 'ศักยภาพฯ', score: district.details.potential },
    { name: 'ภัยธรรมชาติ', score: district.details.disaster },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* --- Header สีเขียวตามรูป --- */}
      <header className="bg-[#4CAF50] text-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg mb-4 transition-all w-fit backdrop-blur-sm"
          >
            <ArrowLeft size={16} /> กลับ
          </button>
          
          <div className="flex items-center gap-2 opacity-90 text-sm mb-1">
            <MapPin size={14} />
            <span>อำเภอ &gt; {district.name}</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">{district.name}</h1>
          <p className="text-green-100 font-light text-sm">Dashboard วิเคราะห์ความพร้อมรับมือการเปลี่ยนแปลงสภาพภูมิอากาศ</p>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Column 1: Score & Radar Chart */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Score Card */}
          <div className="bg-gradient-to-br from-[#43A047] to-[#2E7D32] text-white rounded-xl p-6 shadow-lg flex flex-col justify-between min-h-[140px] relative overflow-hidden">
             <div className="flex justify-between items-start z-10">
               <span className="bg-white/20 p-1.5 rounded mb-2"><Users size={20}/></span>
             </div>
             <div className="z-10">
               <p className="text-sm opacity-90">ดัชนีความพร้อมโดยรวม</p>
               <h2 className="text-5xl font-bold mt-1">{district.score}</h2>
             </div>
             {/* Decorative Circle */}
             <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
          </div>

          {/* Radar Chart */}
          <div className="bg-white rounded-xl p-4 shadow-sm flex-grow flex flex-col border border-gray-100">
            <h3 className="font-bold text-gray-700 text-sm mb-4 text-center">ระดับดัชนีความพร้อมรับมือ</h3>
            <div className="flex-grow min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={district.radar}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar 
                    name="Score" 
                    dataKey="A" 
                    stroke="#4CAF50" 
                    strokeWidth={2} 
                    fill="#4CAF50" 
                    fillOpacity={0.4} 
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Column 2: Detail List */}
        <div className="lg:col-span-5 flex flex-col gap-4">
           <h3 className="font-bold text-xl text-gray-800 mb-2 flex items-center gap-2">
             รายละเอียดตามมิติ
           </h3>
           
           <DetailCard 
             icon={<CloudRain className="text-gray-500" />} 
             title="ภัยพิบัติและอันตรายจากธรรมชาติ" 
             score={district.details.disaster} 
             desc="มีระบบเตือนภัยน้ำท่วมที่ดี แต่ยังมีความเสี่ยงจากฝนฟ้าคะนองและลมแรง" 
           />
           <DetailCard 
             icon={<Shield className="text-green-600" />} 
             title="ศักยภาพการรับมือการเปลี่ยนแปลง" 
             score={district.details.potential} 
             desc="มีความสามารถในการปรับตัวสูง มีองค์กรและระบบสนับสนุนที่แข็งแกร่ง" 
           />
           <DetailCard 
             icon={<Trees className="text-green-500" />} 
             title="ทรัพยากรธรรมชาติ" 
             score={district.details.resource} 
             desc="ทรัพยากรน้ำเพียงพอ แต่คุณภาพดินในบางพื้นที่เสื่อมโทรม" 
           />
           <DetailCard 
             icon={<Users className="text-green-700" />} 
             title="ความพร้อมทางด้านสังคมและเศรษฐกิจ" 
             score={district.details.social} 
             desc="ศูนย์กลางเศรษฐกิจที่แข็งแกร่ง มีการศึกษาและสาธารณสุขที่ดี" 
           />
        </div>

        {/* Column 3: Bar Charts */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Bar Chart (Vertical ตามรูป) */}
          <div className="bg-white rounded-xl p-6 shadow-sm h-[380px] border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-1">คะแนนเปรียบเทียบ</h3>
            <p className="text-xs text-gray-500 mb-6">ในแต่ละด้านที่มีความใกล้เคียงกัน</p>
            
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={BAR_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 100]} tick={{fontSize: 10}} />
                <Tooltip 
                  cursor={{fill: 'transparent'}} 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}
                />
                {/* Bar แนวตั้ง สีเขียวเข้ม */}
                <Bar dataKey="score" fill="#1B5E20" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Empty Chart Placeholder */}
          <div className="bg-white rounded-xl p-6 shadow-sm h-[200px] border border-gray-100 flex flex-col items-center justify-center text-gray-300">
            <h3 className="font-bold text-gray-400 mb-1 text-sm w-full text-left">คะแนนเปรียบเทียบ (รายอำเภอ)</h3>
            <div className="flex-grow flex items-center justify-center w-full">
               <div className="w-full h-20 bg-gray-50 rounded flex items-center justify-center">
                 [กราฟเปรียบเทียบอื่นๆ]
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Helper Component (Card ตรงกลาง)
const DetailCard = ({ icon, title, score, desc }: { icon: any, title: string, score: number, desc: string }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-50 rounded-lg text-gray-600 border border-gray-100">{icon}</div>
          <h4 className="font-bold text-gray-700 text-sm">{title}</h4>
        </div>
        <span className="text-xl font-bold text-green-600">{score}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
        <div 
          className="bg-green-600 h-2 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed font-light">{desc}</p>
    </div>
  );
}