import Navbar from "../components/navbar/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main className="mx-auto w-full max-w-[2520px] px-4 pt-36 pb-8 sm:px-4 md:px-8 md:pt-28 md:pb-10 xl:px-24">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
