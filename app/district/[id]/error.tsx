'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, RefreshCcw, MapPin } from 'lucide-react';

export default function DistrictError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        console.error('District page error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin className="w-10 h-10 text-yellow-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-3">ไม่พบข้อมูลอำเภอ</h2>
                <p className="text-gray-600 mb-6">
                    ขออภัย ไม่สามารถโหลดข้อมูลอำเภอได้ กรุณาลองใหม่อีกครั้งหรือกลับไปยังหน้าแผนที่
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={reset}
                        className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                        <RefreshCcw size={18} />
                        ลองอีกครั้ง
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                        <Home size={18} />
                        กลับหน้าแผนที่
                    </button>
                </div>
            </div>
        </div>
    );
}
