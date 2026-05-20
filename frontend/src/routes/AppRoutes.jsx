import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { AuthProvider } from "../context/AuthContext";
import AuthPage from "../pages/Auth/AuthPage";
import BookingPage from "../pages/Booking/BookingPage";
import HomePage from "../pages/Home/HomePage";
import ProfilePage from "../pages/Profile/ProfilePage";
import PropertyDetailPage from "../pages/PropertyDetail/PropertyDetailPage";
import SearchResultsPage from "../pages/SearchResults/SearchResultsPage";

const NotFoundPage = () => (
  <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 text-center">
    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
      404
    </p>
    <h1 className="text-3xl font-semibold text-gray-950 md:text-5xl">
      Không tìm thấy trang bạn yêu cầu
    </h1>
    <p className="max-w-xl text-base leading-7 text-gray-600">
      Liên kết có thể đã thay đổi hoặc nội dung hiện chưa được xuất bản.
    </p>
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />
          <Route
            path="/search"
            element={
              <MainLayout>
                <SearchResultsPage />
              </MainLayout>
            }
          />
          <Route
            path="/rooms/:roomId"
            element={
              <MainLayout>
                <PropertyDetailPage />
              </MainLayout>
            }
          />
          <Route
            path="/rooms/:roomId/booking"
            element={
              <MainLayout>
                <BookingPage />
              </MainLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            }
          />
          <Route
            path="/auth"
            element={
              <MainLayout>
                <AuthPage />
              </MainLayout>
            }
          />
          <Route
            path="*"
            element={
              <MainLayout>
                <NotFoundPage />
              </MainLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
