'use client';

import { useRouter, useParams } from 'next/navigation';
import { loadDistricts } from '@/app/utils/districts';
import { DistrictData } from '@/app/data/districts';
import { ArrowLeft, CloudRain, Shield, Trees, Users, MapPin } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useEffect, useState, useMemo } from 'react';

// Helper Component (Card) for detail rows
const DetailCard = ({ icon, title, score, desc }: { icon: React.ReactNode; title: string; score: number; desc: string }) => {
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
        <div className="bg-green-600 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${score}%` }} />
      </div>
      <p className="text-xs text-gray-400 leading-relaxed font-light">{desc}</p>
    </div>
  );
};

export default function DistrictDetail() {
  const router = useRouter();
  const params = useParams();
  const [district, setDistrict] = useState<DistrictData | null>(null);
  const [allDistricts, setAllDistricts] = useState<DistrictData[]>([]);
  const [compareId, setCompareId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await loadDistricts();
        setAllDistricts(data);
        const d = data.find((item) => item.id === Number(params.id));
        if (!d) {
          setError('ไม่พบข้อมูลอำเภอนี้');
        } else {
          setDistrict(d);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'ไม่สามารถโหลดข้อมูลอำเภอได้');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [params.id]);

  // Prepare comparison data
  const compareDistrict = useMemo(() =>
    allDistricts.find(d => d.id.toString() === compareId),
    [allDistricts, compareId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-600">กำลังโหลดข้อมูลอำเภอ…</p>
      </div>
    );
  }

  if (error || !district) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-400 mb-4">{error ?? 'ไม่พบข้อมูลอำเภอนี้'}</h2>
        <button onClick={() => router.back()} className="text-green-600 hover:underline">
          กลับหน้าหลัก
        </button>
      </div>
    );
  }

  const BAR_DATA = [
    {
      name: 'มุมมองปชช.',
      current: district.radar[4].A,
      compare: compareDistrict?.radar[4].A ?? 0
    },
    {
      name: 'สังคม-ศก.',
      current: district.details.social,
      compare: compareDistrict?.details.social ?? 0
    },
    {
      name: 'ทรัพยากรฯ',
      current: district.details.resource,
      compare: compareDistrict?.details.resource ?? 0
    },
    {
      name: 'ศักยภาพฯ',
      current: district.details.potential,
      compare: compareDistrict?.details.potential ?? 0
    },
    {
      name: 'ภัยธรรมชาติ',
      current: district.details.disaster,
      compare: compareDistrict?.details.disaster ?? 0
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-[#4CAF50] text-white p-4 lg:p-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg mb-4 transition-all w-fit backdrop-blur-sm"
          >
            <ArrowLeft size={16} /> กลับ
          </button>
          <div className="flex items-center gap-2 opacity-90 text-xs lg:text-sm mb-1">
            <MapPin size={14} />
            <span>อำเภอ &gt; {district.name}</span>
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold mb-2 tracking-tight">{district.name}</h1>
          <p className="text-green-100 font-light text-xs lg:text-sm">
            Dashboard วิเคราะห์ความพร้อมรับมือการเปลี่ยนแปลงสภาพภูมิอากาศ
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Column 1: Score & Radar */}
        <div className="lg:col-span-3 flex flex-col gap-4 lg:gap-6">
          {/* Score Card */}
          <div className="bg-gradient-to-br from-[#43A047] to-[#2E7D32] text-white rounded-xl p-4 lg:p-6 shadow-lg flex flex-col justify-between min-h-[120px] lg:min-h-[140px] relative overflow-hidden">
            <div className="flex justify-between items-start z-10">
              <span className="bg-white/20 p-1.5 rounded mb-2"><Users size={20} /></span>
            </div>
            <div className="z-10">
              <p className="text-xs lg:text-sm opacity-90">ดัชนีความพร้อมโดยรวม</p>
              <h2 className="text-4xl lg:text-5xl font-bold mt-1">{district.score}</h2>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
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
                  <Radar name="Score" dataKey="A" stroke="#4CAF50" strokeWidth={2} fill="#4CAF50" fillOpacity={0.4} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Column 2: Detail Cards */}
        <div className="lg:col-span-5 flex flex-col gap-3 lg:gap-4">
          <h3 className="font-bold text-lg lg:text-xl text-gray-800 mb-2 flex items-center gap-2">รายละเอียดตามมิติ</h3>
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

        {/* Column 3: Bar Chart */}
        <div className="lg:col-span-4 flex flex-col gap-4 lg:gap-6">
          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm h-[380px] border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-gray-800 mb-1">คะแนนเปรียบเทียบ</h3>
                <p className="text-xs text-gray-500">เทียบกับ: {compareDistrict ? compareDistrict.name : 'เลือกอำเภอเพื่อเปรียบเทียบ'}</p>
              </div>
              <div className="relative">
                <select
                  className="text-xs text-gray-500 border border-gray-300 rounded-lg p-2 pr-8 appearance-none bg-white focus:ring-2 focus:ring-green-500 focus:outline-none cursor-pointer max-w-[120px] lg:max-w-none truncate"
                  value={compareId}
                  onChange={(e) => setCompareId(e.target.value)}
                >
                  <option value="">-- เลือกอำเภอเทียบ --</option>
                  {allDistricts
                    .filter(d => d.id !== district.id)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))
                  }
                </select>
              </div>
            </div>

            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={BAR_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-xs">
                          <p className="font-bold text-gray-800 mb-2">{label}</p>
                          {payload.map((entry: any, index: number) => {
                            const isCurrent = entry.name === 'current';
                            const name = isCurrent ? district.name : (compareDistrict?.name || 'Compare');
                            const color = isCurrent ? '#1B5E20' : '#afb8c1ff';

                            return (
                              <div key={index} className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                <span style={{ color: color }} className="font-medium">
                                  {name}: {entry.value}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="current" name="current" fill="#4CAF50" radius={[4, 4, 0, 0]} barSize={30} />
                {compareId && (
                  <Bar dataKey="compare" name="compare" fill="#afb8c1ff" radius={[4, 4, 0, 0]} barSize={30} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend / Summary */}
          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm h-auto border border-gray-100 flex flex-col justify-center">
            <h3 className="font-bold text-gray-700 text-sm mb-3">สรุปผลการเปรียบเทียบ</h3>
            {compareDistrict ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-100">
                  <span className="text-xs font-bold text-green-800">{district.name}</span>
                  <span className="text-lg font-bold text-green-600">{district.score}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-xs font-bold text-gray-600">{compareDistrict.name}</span>
                  <span className="text-lg font-bold text-gray-500">{compareDistrict.score}</span>
                </div>
                <div className="text-xs text-center text-gray-400 mt-2">
                  {district.score > compareDistrict.score
                    ? `${district.name} มีความพร้อมมากกว่า ${Math.abs(district.score - compareDistrict.score).toFixed(1)} คะแนน`
                    : `${compareDistrict.name} มีความพร้อมมากกว่า ${Math.abs(compareDistrict.score - district.score).toFixed(1)} คะแนน`
                  }
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 text-xs py-4">
                เลือกอำเภอจากเมนูด้านบน<br />เพื่อดูผลวิเคราะห์เปรียบเทียบ
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}