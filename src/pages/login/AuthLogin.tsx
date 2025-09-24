import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { loginUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const AuthLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state: any) => state.auth);

  const [phone, setPhone] = useState("998");  
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { phone?: string; password?: string } = {};

    if (!phone || phone.length !== 12) {
      newErrors.phone = "Telefon raqamida xatolik bor!";
    }
    if (!password) {
      newErrors.password = "Parol kiritilishi shart!";
    } else if (password.length < 5) {
      newErrors.password = "Parol kamida 5 ta belgidan iborat bo‘lishi kerak!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const result = await dispatch(loginUser({ phone, password })).unwrap();

    
      localStorage.setItem("token", result.token);

      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) {
      if (!inputValue.startsWith("998")) {
        setPhone("998");
      } else if (inputValue.length <= 12) {
        setPhone(inputValue);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] min-h-screen">
      {/* Left side */}
      <div className="hidden lg:flex items-center justify-center bg-[#FDFBF9] p-12">
        <div className="flex flex-col items-center text-center space-y-6">
          <img
            src="https://talimhub-student-delta.vercel.app/logo.png"
            alt="TalimHub logo"
            className="w-[65%] object-contain"
          />
          <p className="text-lg text-gray-600">
            TalimHub - bu o‘quvchilar va o‘qituvchilar uchun qulay va samarali
            ta‘lim platformasi.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md p-10 rounded-2xl">
          <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone */}
            <input
              type="text"
              placeholder="Telefon raqam"
              value={phone}
              onChange={handlePhoneChange}
              className={`w-full px-4 py-3 border rounded-lg placeholder-gray-400 ${
                errors.phone ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Parol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg placeholder-gray-400 ${
                  errors.password ? "border-red-500 focus:ring-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#B28E7C]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}

            {/* Backend error */}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-lg transition transform hover:scale-[1.02] shadow-md ${
                loading
                  ? "bg-[#e4c1af] text-white cursor-not-allowed"
                  : "bg-[#B28E7C] text-white hover:bg-[#9c6f60]"
              }`}
            >
              {loading ? "Kirilmoqda..." : "Kirish"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AuthLogin);
