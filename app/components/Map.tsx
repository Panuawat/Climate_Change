'use client';

import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet'; // ลบ ZoomControl ออก
import L from 'leaflet';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { DistrictData } from '@/app/data/districts'; 
import { Search, X, ChevronRight } from 'lucide-react';

const THAILAND_DISTRICTS_GEOJSON_URL = 'https://raw.githubusercontent.com/chingchai/OpenGISData-Thailand/master/districts.geojson';

const getColor = (score: number) => {
  if (score >= 80) return '#1B5E20';
  if (score >= 70) return '#4CAF50';
  if (score >= 60) return '#FFC107';
  if (score >= 50) return '#FF9800';
  return '#F44336';
};

const MapController = ({ setMap }: { setMap: (map: L.Map) => void }) => {
  const map = useMap();
  useEffect(() => {
    setMap(map);
  }, [map, setMap]);
  return null;
};

interface MapProps {
  districts: DistrictData[];
}

const Map = ({ districts }: MapProps) => {
  const router = useRouter();
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState<L.Map | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const filteredDistricts = useMemo(() => {
    return districts.filter(d => d.name.includes(searchTerm));
  }, [districts, searchTerm]);

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        setLoading(true);
        const response = await fetch(THAILAND_DISTRICTS_GEOJSON_URL);
        const data = await response.json();
        const khonKaenFeatures = data.features.filter((feature: any) => feature.properties.pro_th === 'ขอนแก่น');
        
        const featuresWithScore = khonKaenFeatures.map((feature: any) => {
          const geoName = feature.properties.amp_th.replace('อำเภอ', '').trim();
          const matchDistrict = districts.find(d => d.name.replace('อำเภอ', '').trim() === geoName);
          return {
            ...feature,
            properties: {
              ...feature.properties,
              ...matchDistrict, 
              score: matchDistrict ? matchDistrict.score : 0,
              hasData: !!matchDistrict,
              matchId: matchDistrict?.id 
            }
          };
        });

        setGeoJsonData({ type: 'FeatureCollection', features: featuresWithScore });
      } catch (error) {
        console.error("Error fetching GeoJSON:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGeoJSON();
  }, [districts]);

  const style = (feature: any) => {
    const score = feature.properties.score;
    const hasData = feature.properties.hasData;
    const distId = feature.properties.matchId;

    const isMatch = filteredDistricts.some(d => d.id === distId);
    const isDimmed = searchTerm !== '' && !isMatch;

    return {
      fillColor: hasData ? getColor(score) : '#e0e0e0',
      weight: isMatch ? 2 : 1,
      opacity: 1,
      color: 'white',
      dashArray: hasData ? '' : '3',
      fillOpacity: isDimmed ? 0.2 : 0.7,
    };
  };

  const handleSelectDistrict = (d: DistrictData) => {
    if (map) {
      map.flyTo([d.lat, d.lng], 11, { duration: 1.5 });
    }
  };

  const onEachFeature = (feature: any, layer: any) => {
    layer.bindTooltip(
      `<div style="text-align:center;"><b>${feature.properties.amp_th}</b><br/>คะแนน: ${feature.properties.score}</div>`,
      { permanent: false, direction: "center", className: "custom-tooltip" }
    );
    layer.on({
      click: () => { if (feature.properties.id) router.push(`/district/${feature.properties.id}`); }
    });
  };

  const position: L.LatLngExpression = [16.4419, 102.8360];

  return (
    <div className="relative h-full w-full bg-[#f8f9fa]">
      
      {/* --- 1. ย้าย Filter Panel ไปมุมขวาบน (right-4) --- */}
      <div className={`absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-xl transition-all duration-300 flex flex-col font-sans border border-gray-200 ${isOpen ? 'w-72 h-[80%]' : 'w-12 h-12 overflow-hidden'}`}>
        
        <div 
          className="p-3 bg-gray-800 text-white flex items-center justify-between cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <>
              <span className="font-bold text-sm">ค้นหาพื้นที่ (Filter)</span>
              <X size={16} />
            </>
          ) : (
            <Search size={20} className="mx-auto" />
          )}
        </div>

        {isOpen && (
          <>
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="พิมพ์ชื่ออำเภอ..." 
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-2 space-y-1">
              <div className="flex justify-between text-[10px] text-gray-400 px-2 mb-1 uppercase font-bold">
                <span>District</span>
                <span>Index</span>
              </div>
              
              {filteredDistricts.length > 0 ? (
                filteredDistricts.map(d => (
                  <div 
                    key={d.id} 
                    className="group flex items-center justify-between p-2 hover:bg-green-50 rounded cursor-pointer transition-colors border border-transparent hover:border-green-100"
                    onClick={() => handleSelectDistrict(d)}
                  >
                    <span className="text-sm text-gray-700 font-medium">{d.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="relative w-16 h-4 bg-gray-200 rounded overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full" 
                          style={{ width: `${d.score}%`, backgroundColor: getColor(d.score) }}
                        ></div>
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white text-shadow-sm">
                          {d.score}
                        </span>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-green-500" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-gray-400">ไม่พบข้อมูลอำเภอ</div>
              )}
            </div>
            
            <div className="p-2 bg-gray-50 border-t border-gray-100 text-[10px] text-center text-gray-500">
              แสดง {filteredDistricts.length} จาก {districts.length} พื้นที่
            </div>
          </>
        )}
      </div>

      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      <MapContainer 
        center={position} 
        zoom={9} 
        scrollWheelZoom={true}
        // 2. ลบ zoomControl={false} ออก เพื่อให้ปุ่ม Zoom มาตรฐาน (ซ้ายบน) กลับมา
        style={{ height: '100%', width: '100%', background: '#f0f0f0' }}
      >
        <MapController setMap={setMap} />
        
        {/* 3. ลบ <ZoomControl /> ที่เป็นต้นเหตุของ Error ออก */}

        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {geoJsonData && (
          <GeoJSON 
            data={geoJsonData} 
            style={style} 
            onEachFeature={onEachFeature} 
          />
        )}

        {filteredDistricts.map(d => (
           <Marker 
             key={d.id}
             position={[d.lat, d.lng]}
             icon={L.divIcon({
               className: 'text-label',
               html: `<div style="text-shadow: 0 0 4px white; font-weight: 600; font-size: 11px; color: #2c3e50; text-align: center; width: 120px; margin-left: -60px;">
                 ${d.name}<br/><span style="color:${getColor(d.score)}; font-size:10px;">(${d.score})</span>
               </div>`,
               iconSize: [0, 0]
             })} 
             eventHandlers={{ click: () => router.push(`/district/${d.id}`) }}
           />
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;