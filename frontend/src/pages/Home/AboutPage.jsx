import { Users, Target, Heart, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Nguyễn Chánh Khuê",
      role: "Backend Developer",
      image: "https://ui-avatars.com/api/?name=Nguyễn+Chánh+Khuê&background=random&color=fff&size=150",
      description: "Phụ trách xây dựng kiến trúc hệ thống, API và tích hợp thanh toán."
    },
    {
      name: "Vũ Mạnh Dũng",
      role: "Frontend Developer",
      image: "https://ui-avatars.com/api/?name=Vũ+Mạnh+Dũng&background=random&color=fff&size=150",
      description: "Thiết kế giao diện người dùng, tối ưu hóa trải nghiệm khách hàng."
    }
  ];

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section className="relative h-[65vh] min-h-[500px] w-[100vw] ml-[calc(-50vw+50%)] mb-16 -mt-[88px]">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1551882547-ff40c0d5e9af?auto=format&fit=crop&w=2000&q=80"
            alt="About Koda"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/40 to-[#f7f9fc]"></div>
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center items-center text-center pt-20 pb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-white tracking-tight"
          >
            Về Koda Homestay
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg text-white/90 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Koda là nền tảng đặt phòng trực tuyến hàng đầu, mang đến cho bạn những trải nghiệm lưu trú tuyệt vời nhất với giao diện hiện đại và dịch vụ chuyên nghiệp.
          </motion.p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="grid md:grid-cols-2 gap-8 w-full mb-16 relative z-10 -mt-44">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100"
        >
          <div className="w-16 h-16 bg-rose-50 rounded-[20px] flex items-center justify-center mb-6">
            <Target size={32} className="text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sứ mệnh của Koda</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Kết nối những người đam mê du lịch với những không gian lưu trú độc đáo, tiện nghi và an toàn. Chúng tôi không chỉ cung cấp phòng nghỉ, mà còn mang đến những kỷ niệm đáng nhớ cho mỗi chuyến đi.
          </p>
        </motion.div>
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100"
        >
          <div className="w-16 h-16 bg-emerald-50 rounded-[20px] flex items-center justify-center mb-6">
            <Heart size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tầm nhìn</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Trở thành ứng dụng đặt phòng được yêu thích nhất tại Việt Nam vào năm 2027, với hệ sinh thái đa dạng từ Homestay, Villa đến Resort nghỉ dưỡng cao cấp trải dài khắp cả nước.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 py-20 px-8 rounded-[40px] w-full mb-20 shadow-2xl">
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-5xl font-black text-white mb-3">1,000<span className="text-rose-500">+</span></p>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Khách hàng</p>
          </div>
          <div>
            <p className="text-5xl font-black text-white mb-3">50<span className="text-rose-500">+</span></p>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đối tác</p>
          </div>
          <div>
            <p className="text-5xl font-black text-white mb-3">4.9<span className="text-rose-500">/5</span></p>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đánh giá sao</p>
          </div>
          <div>
            <p className="text-5xl font-black text-white mb-3">24<span className="text-rose-500">/7</span></p>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Hỗ trợ</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full mb-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Đội ngũ phát triển</h2>
          <p className="mt-4 text-lg text-gray-600">Những người đứng sau sự thành công của Koda</p>
        </div>
        <div className="grid md:grid-cols-2 gap-10 w-full lg:px-20">
          {teamMembers.map((member, index) => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={index} 
              className="bg-white rounded-[32px] border border-gray-100 p-10 shadow-sm hover:shadow-xl transition-shadow text-center group"
            >
              <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-8 border-[6px] border-gray-50 group-hover:border-rose-100 transition-colors duration-300">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
              <p className="text-sm font-bold text-rose-500 uppercase tracking-widest mb-5">{member.role}</p>
              <p className="text-gray-600 text-base leading-relaxed">{member.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-4 max-w-3xl mx-auto pb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Bạn đã sẵn sàng cho chuyến đi?</h2>
        <Link 
          to="/rooms" 
          className="inline-flex items-center justify-center px-8 py-4 bg-rose-500 text-white rounded-full font-bold hover:bg-rose-600 transition shadow-lg shadow-rose-500/30"
        >
          Khám phá phòng ngay
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;
