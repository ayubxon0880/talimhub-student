import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow min-h-screen bg-gradient-to-b from-[#fdf8f6] to-[#fcefe9] ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;