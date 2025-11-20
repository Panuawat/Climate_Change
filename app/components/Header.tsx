import { Menu } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between z-30 relative">
      <div className="flex items-center gap-3">
        {/* <div className="bg-green-600 p-2 rounded-lg text-white"> */}
          {/* ใส่ Logo ตรงนี้ */}
          {/* <Menu size={20} /> */}
        {/* </div> */}
        <h1 className="text-xl font-bold text-gray-800">Climate Change</h1>
      </div>
      
      <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
        <a href="#" className="hover:text-green-600">หน้าแรก</a>
        <a href="#" className="hover:text-green-600">เกี่ยวกับเรา</a>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          U
        </div>
      </div>
    </header>
  );
};

export default Header;