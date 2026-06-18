import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main className="mx-auto w-full max-w-[2520px] px-4 pt-24 pb-8 md:px-8 md:pt-28 md:pb-10 lg:px-16 xl:px-24 2xl:px-40">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
