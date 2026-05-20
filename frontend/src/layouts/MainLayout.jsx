import Navbar from "../components/navbar/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* - pt-28: Để nội dung không bị Navbar đè lên
         - xl:px-24: Đây chính là "khoảng trắng" 2 bên y hệt Airbnb
      */}
      <main className="max-w-[2520px] mx-auto xl:px-24 md:px-10 sm:px-4 px-4 pt-28 pb-10">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;