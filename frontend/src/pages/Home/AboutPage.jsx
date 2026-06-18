import { Users, Target, Heart, Award } from "lucide-react";
import { Link } from "react-router-dom";

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
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Giới thiệu
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Booking HomeStay là nền tảng đặt phòng trực tuyến hàng đầu, mang đến cho bạn những trải nghiệm lưu trú tuyệt vời nhất với giao diện thân thiện và dịch vụ chuyên nghiệp.
        </p>
      </section>

      {/* Vision & Mission */}
      <section className="grid md:grid-cols-2 gap-8 px-4 max-w-5xl mx-auto">
        <div className="bg-rose-50 rounded-[32px] p-8 md:p-12">
          <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center mb-6">
            <Target size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sứ mệnh</h2>
          <p className="text-gray-700 leading-relaxed">
            Kết nối những người đam mê du lịch với những không gian lưu trú độc đáo, tiện nghi và an toàn. Chúng tôi không chỉ cung cấp phòng nghỉ, mà còn mang đến những kỷ niệm đáng nhớ cho mỗi chuyến đi.
          </p>
        </div>
        <div className="bg-emerald-50 rounded-[32px] p-8 md:p-12">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6">
            <Heart size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tầm nhìn</h2>
          <p className="text-gray-700 leading-relaxed">
            Trở thành ứng dụng đặt phòng được yêu thích nhất tại Việt Nam vào năm 2027, với hệ sinh thái đa dạng từ Homestay, Villa đến Resort nghỉ dưỡng cao cấp trải dài khắp cả nước.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 py-16 px-4 rounded-[40px] max-w-6xl mx-auto">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-white mb-2">1,000+</p>
            <p className="text-gray-400 font-medium uppercase tracking-wider text-sm">Khách hàng</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white mb-2">50+</p>
            <p className="text-gray-400 font-medium uppercase tracking-wider text-sm">Đối tác</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white mb-2">4.9/5</p>
            <p className="text-gray-400 font-medium uppercase tracking-wider text-sm">Đánh giá sao</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white mb-2">24/7</p>
            <p className="text-gray-400 font-medium uppercase tracking-wider text-sm">Hỗ trợ</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Đội ngũ phát triển</h2>
          <p className="mt-4 text-gray-600">Những người đứng sau sự thành công của dự án</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm hover:shadow-md transition text-center group">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-gray-50 group-hover:border-rose-100 transition">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-4">{member.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
            </div>
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
