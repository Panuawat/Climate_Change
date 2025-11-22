'use client';

import { useEffect } from 'react';
import { Home, RefreshCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-3">เกิดข้อผิดพลาด</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    ขออภัย เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง หากปัญหายังคงอยู่ กรุณาติดต่อผู้ดูแลระบบ
                </p>

                {error.message && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <p className="text-xs text-gray-500 mb-1">รายละเอียดข้อผิดพลาด:</p>
                        <p className="text-sm text-gray-700 font-mono break-all">{error.message}</p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={reset}
                        className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                        <RefreshCcw size={18} />
                        ลองอีกครั้ง
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                        <Home size={18} />
                        หน้าหลัก
                    </button>
                </div>
            </div>
        </div>
    );
}
