import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-xl border-t border-white/50 text-gray-600 py-16 px-4 md:px-8 mt-auto shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-gray-200/60 pb-12">
        {/* Logo and About */}
        <div className="space-y-6">
          <Link to="/" className="inline-flex items-center text-4xl font-black tracking-tighter text-gray-900 group">
            <span className="text-rose-500 transition-transform duration-300 group-hover:-translate-y-1">K</span>
            <MapPin size={32} strokeWidth={3} className="text-rose-500 fill-rose-500 mx-[2px] transition-transform duration-300 group-hover:scale-110" />
            <span className="transition-transform duration-300 group-hover:translate-x-1">da</span>
          </Link>
          <p className="text-sm text-gray-500 leading-relaxed pr-4">
            Khám phá những không gian lưu trú tuyệt vời nhất cho kỳ nghỉ của bạn. Koda cam kết mang đến trải nghiệm lưu trú chuẩn mực và đẳng cấp.
          </p>
          <div className="flex gap-3 pt-2">
            <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
          </div>
        </div>

        {/* Khám phá */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-6">Khám phá</h3>
          <ul className="space-y-4">
            <li><Link to="/search" className="text-gray-500 hover:text-rose-500 transition-colors font-medium">Tìm phòng</Link></li>
            <li><Link to="/about" className="text-gray-500 hover:text-rose-500 transition-colors font-medium">Giới Thiệu</Link></li>
            <li><a href="#" className="text-gray-500 hover:text-rose-500 transition-colors font-medium">Điểm đến phổ biến</a></li>
            <li><a href="#" className="text-gray-500 hover:text-rose-500 transition-colors font-medium">Ưu đãi mới nhất</a></li>
          </ul>
        </div>

        {/* Hỗ trợ */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-6">Hỗ trợ</h3>
          <ul className="space-y-4">
            <li><a href="#" className="text-gray-500 hover:text-rose-500 transition-colors font-medium">Trung tâm trợ giúp</a></li>
            <li><a href="#" className="text-gray-500 hover:text-rose-500 transition-colors font-medium">Câu hỏi thường gặp</a></li>
            <li><a href="#" className="text-gray-500 hover:text-rose-500 transition-colors font-medium">Chính sách bảo mật</a></li>
            <li><a href="#" className="text-gray-500 hover:text-rose-500 transition-colors font-medium">Điều khoản dịch vụ</a></li>
          </ul>
        </div>

        {/* Liên hệ */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-6">Liên hệ</h3>
          <ul className="space-y-5">
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <MapPin size={20} className="text-rose-500" />
              </div>
              <span className="text-sm text-gray-600 font-medium leading-relaxed">Tăng Nhơn Phú, TP.HCM</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <Phone size={20} className="text-rose-500" />
              </div>
              <span className="text-sm text-gray-600 font-medium">0385913788</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <Mail size={20} className="text-rose-500" />
              </div>
              <div className="flex flex-col text-sm text-gray-600 font-medium">
                <span>dungrom4269@gmail.com</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">&copy; {new Date().getFullYear()} KODA HOMESTAY.</p>
        <p className="text-xs text-gray-400 mt-2">Được thiết kế bởi Nguyễn Chánh Khuê & Vũ Mạnh Dũng.</p>
      </div>
    </footer>
  );
};

export default Footer;
