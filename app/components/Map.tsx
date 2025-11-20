'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface District {
  id: number;
  name: string;
  score: number;
  lat: number;
  lng: number;
  status: string;
}

const fixLeafletIcon = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// --- CUSTOM MARKER STYLE ---
// สร้าง HTML string ให้เป็นป้ายสี่เหลี่ยมสีเขียว/เหลือง/แดง ตามคะแนน
const createCustomIcon = (name: string, score: number, status: string) => {
  let bgColor = '#4CAF50'; // Green (Good)
  if (status === 'mid') bgColor = '#FBC02D'; // Yellow (Mid)
  if (status === 'bad') bgColor = '#D32F2F'; // Red (Bad)

  return L.divIcon({
    className: 'custom-label-icon',
    // HTML นี้คือตัวป้ายที่โชว์บนแผนที่
    html: `
      <div style="
        background-color: ${bgColor};
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-width: 80px;
        text-align: center;
        font-family: 'Prompt', sans-serif;
      ">
        <span style="font-size: 10px; opacity: 0.9; margin-bottom: 2px;">${name}</span>
        <span style="font-size: 14px; font-weight: bold; line-height: 1;">${score}</span>
      </div>
    `,
    iconSize: [80, 42], // ขนาดของป้าย
    iconAnchor: [40, 42], // จุดชี้ (กลางล่าง)
  });
};

const Map = ({ districts }: { districts: District[] }) => {
  const router = useRouter(); // 2. เรียกใช้ Router

  useEffect(() => {
    fixLeafletIcon(); // (สมมติว่ามีฟังก์ชันเดิมอยู่แล้ว)
  }, []);

  const position: L.LatLngExpression = [16.445329, 102.823105];

  return (
    <MapContainer center={position} zoom={9} scrollWheelZoom={true} style={{ height: '100%', width: '100%', background: '#1a1a1a' }}>
      {/* ใช้ Satellite Map (ภาพถ่ายดาวเทียม) */}
      <TileLayer
        attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      
      {/* Optional: ใส่ชื่อถนนทับจางๆ (Reference Overlay) ถ้าต้องการ */}
      <TileLayer 
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}{r}.png"
        opacity={0.4}
      />

      {districts.map((district) => (
        <Marker 
          key={district.id} 
          position={[district.lat, district.lng]}
          icon={createCustomIcon(district.name, district.score, district.status)}
          eventHandlers={{
            click: () => {
              // สั่งให้วิ่งไปหน้า /district/1 (ตาม id)
              router.push(`/district/${district.id}`);
            },
          }}
        >
          <Popup>
            <div className="text-center font-sans">
              <h3 className="font-bold text-gray-800">{district.name}</h3>
              <div className="text-lg font-bold text-green-600">{district.score}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;