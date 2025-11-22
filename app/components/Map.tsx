'use client';

import { MapContainer, TileLayer, GeoJSON, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { DistrictData } from '@/app/data/districts';
import { GeoJSONFeatureCollection } from '@/app/types/geojson';
import { getScoreColor } from '@/app/utils/colors';
import { loadGeoJSON, filterByProvince, mergeDistrictData } from '@/app/utils/geojson';
import { loadDistricts } from '@/app/utils/districts';
import { Search, X, ChevronRight, AlertCircle } from 'lucide-react';

// Controller to expose the Leaflet map instance
const MapController = ({ setMap }: { setMap: (map: L.Map) => void }) => {
  const map = useMap();
  useEffect(() => setMap(map), [map, setMap]);
  return null;
};

export default function Map() {
  const router = useRouter();

  // ----- State ---------------------------------------------------------
  const [districts, setDistricts] = useState<DistrictData[] | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONFeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const filteredDistricts = useMemo(() => {
    if (!districts) return [];
    return districts.filter((d) => d.name.includes(searchTerm));
  }, [districts, searchTerm]);

  // ----- Load districts -------------------------------------------------
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const data = await loadDistricts();
        setDistricts(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'ไม่สามารถโหลดข้อมูลอำเภอได้');
      }
    };
    fetchDistricts();
  }, []);

  // ----- Load & merge GeoJSON (needs districts) ------------------------
  useEffect(() => {
    if (!districts) return;
    const fetchGeo = async () => {
      setLoading(true);
      setError(null);
      try {
        const raw = await loadGeoJSON('/geojson/thailand-districts.json');
        const khonKaen = filterByProvince(raw, 'ขอนแก่น');
        const merged = mergeDistrictData(khonKaen, districts);
        setGeoJsonData(merged);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'ไม่สามารถโหลดข้อมูลแผนที่ได้');
        console.error('Error loading GeoJSON:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchGeo();
  }, [districts]);

  // ----- Styling callbacks --------------------------------------------
  const style = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (feature: any) => {
      if (!feature) return {};
      const { score, hasData, matchId } = feature.properties;
      const isMatch = filteredDistricts.some((d) => d.id === matchId);
      const dim = searchTerm !== '' && !isMatch;
      return {
        fillColor: hasData ? getScoreColor(score) : '#e0e0e0',
        weight: isMatch ? 2 : 1,
        opacity: 1,
        color: 'white',
        dashArray: hasData ? '' : '3',
        fillOpacity: dim ? 0.2 : 0.7,
      };
    },
    [filteredDistricts, searchTerm],
  );

  const onEachFeature = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (feature: any, layer: L.Layer) => {
      layer.bindTooltip(
        `<div style="text-align:center;"><b>${feature.properties.amp_th}</b><br/>คะแนน: ${feature.properties.score}</div>`,
        { permanent: false, direction: 'center', className: 'custom-tooltip' },
      );
      layer.on({
        click: () => {
          if (feature.properties.id) router.push(`/district/${feature.properties.id}`);
        },
      });
    },
    [router],
  );

  const handleSelectDistrict = useCallback(
    (d: DistrictData) => {
      if (map) map.flyTo([d.lat, d.lng], 11, { duration: 1.5 });
    },
    [map],
  );

  const handleRetry = useCallback(() => {
    setError(null);
    window.location.reload();
  }, []);

  const position: L.LatLngExpression = [16.4419, 102.836];

  // ----- Render --------------------------------------------------------
  if (!districts) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-600">กำลังโหลดข้อมูลอำเภอ…</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-[#f8f9fa]">
      {/* Filter panel */}
      <div
        className={`absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-xl transition-all duration-300 flex flex-col font-sans border border-gray-200 ${isOpen ? 'w-72 h-[80%]' : 'w-12 h-12 overflow-hidden'
          }`}
      >
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
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                filteredDistricts.map((d) => (
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
                          style={{ width: `${d.score}%`, backgroundColor: getScoreColor(d.score) }}
                        />
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

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-600">กำลังโหลดแผนที่…</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/95 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 max-w-md p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">เกิดข้อผิดพลาด</h3>
            <p className="text-sm text-gray-600 text-center">{error}</p>
            <button onClick={handleRetry} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              ลองอีกครั้ง
            </button>
          </div>
        </div>
      )}

      {/* Leaflet map */}
      <MapContainer center={position} zoom={9} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <MapController setMap={setMap} />
        <TileLayer attribution="&copy; CARTO" url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        {geoJsonData && <GeoJSON data={geoJsonData} style={style} onEachFeature={onEachFeature} />}
        {filteredDistricts.map((d) => (
          <Marker
            key={d.id}
            position={[d.lat, d.lng]}
            icon={L.divIcon({
              className: 'text-label',
              html: `<div style="text-shadow:0 0 4px white;font-weight:600;font-size:11px;color:#2c3e50;text-align:center;width:120px;margin-left:-60px;">
                       ${d.name}<br/><span style="color:${getScoreColor(d.score)};font-size:10px;">(${d.score})</span>
                     </div>`,
              iconSize: [0, 0],
            })}
            eventHandlers={{ click: () => router.push(`/district/${d.id}`) }}
          />
        ))}
      </MapContainer>
    </div>
  );
}