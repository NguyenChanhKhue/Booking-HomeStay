import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 md:px-8 mt-16 rounded-t-[40px]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 border-b border-gray-800 pb-8">
        {/* Logo and About */}
        <div className="space-y-4">
          <Link to="/" className="inline-block">
            <span className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
              Booking HomeStay
            </span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Khám phá những không gian lưu trú tuyệt vời nhất cho kỳ nghỉ của bạn. Chúng tôi cam kết mang đến trải nghiệm tốt nhất với giá cả hợp lý.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
          </div>
        </div>

        {/* Khám phá */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Khám phá</h3>
          <ul className="space-y-3">
            <li><Link to="/search" className="hover:text-rose-400 transition-colors">Tìm phòng</Link></li>
            <li><Link to="/about" className="hover:text-rose-400 transition-colors">Giới Thiệu</Link></li>
            <li><a href="#" className="hover:text-rose-400 transition-colors">Điểm đến phổ biến</a></li>
            <li><a href="#" className="hover:text-rose-400 transition-colors">Ưu đãi mới nhất</a></li>
          </ul>
        </div>

        {/* Hỗ trợ */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Hỗ trợ</h3>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-rose-400 transition-colors">Trung tâm trợ giúp</a></li>
            <li><a href="#" className="hover:text-rose-400 transition-colors">Câu hỏi thường gặp</a></li>
            <li><a href="#" className="hover:text-rose-400 transition-colors">Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:text-rose-400 transition-colors">Điều khoản dịch vụ</a></li>
          </ul>
        </div>

        {/* Liên hệ */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Liên hệ</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin size={20} className="text-rose-500 shrink-0 mt-1" />
              <span className="text-sm">Tăng Nhơn Phú, TP.HCM</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={20} className="text-rose-500 shrink-0" />
              <span className="text-sm">0385913788</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={20} className="text-rose-500 shrink-0" />
              <div className="flex flex-col text-sm">
                <span>dungrom4269@gmail.com</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Booking HomeStay. Được thiết kế bởi Nguyễn Chánh Khuê & Vũ Mạnh Dũng.</p>
      </div>
    </footer>
  );
};

export default Footer;
