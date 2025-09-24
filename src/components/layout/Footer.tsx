import React from "react";
import { FaTelegramPlane, FaPhoneAlt, FaEnvelope, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#855842] text-gray-200 py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 text-center sm:text-left">
          {/* Biz haqimizda */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Biz haqimizda</h2>
            <p className="text-sm leading-relaxed">
              Talimhub platformasi ta'lim sohasida xizmat ko'rsatadi.
              Maqsadimiz - sizga eng yaxshi ta'limiy imkoniyatlarni taqdim etish.
            </p>
          </div>

          {/* Ijtimoiy tarmoqlar */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Ijtimoiy tarmoqlar</h2>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://t.me/talimhub"
                  className="flex items-center justify-center sm:justify-start gap-2 hover:text-[#e49e7b] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTelegramPlane className="text-lg" /> Talimhub
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/ayubxonobidov"
                  className="flex items-center justify-center sm:justify-start gap-2 hover:text-[#e49e7b] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTelegramPlane className="text-lg" /> Ayubxon Obidov
                </a>
              </li>
            </ul>
          </div>

          {/* Bog'lanish */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Bog'lanish</h2>
            <p className="flex items-center justify-center sm:justify-start gap-2 text-sm hover:text-[#e49e7b] transition-colors">
              <FaPhoneAlt /> +998 90 362 34 45
            </p>
            <p className="flex items-center justify-center sm:justify-start gap-2 text-sm hover:text-[#e49e7b] transition-colors">
              <FaEnvelope /> ayubxonnt@gmail.com
            </p>
          </div>

          {/* Jamoamiz sahifasi */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Loyihamiz</h2>
            <Link
              to="/team"
              className="flex items-center justify-center sm:justify-start gap-2 hover:text-[#e89b74] transition-colors"
            >
              <FaUsers className="text-lg" /> Bizning jamoa
            </Link>
          </div>
        </div>

        {/* Pastki qism */}
        <div className="border-t border-[#e49e7b]/40 mt-8 pt-4 text-center text-sm text-gray-200">
          © 2024/2025 <span className="text-white font-semibold">Talimhub</span>.
          Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
