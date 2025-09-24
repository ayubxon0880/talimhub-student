import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import API from "../../api/axios";
import { LoadingSpinner } from "../../utils";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import React from "react";
interface Role {
  name: string;
}

interface User {
  firstname: string;
  lastname: string;
  phone: string;
  email?: string;
  role: Role;
  avatar?: string;
}

interface FormData {
  firstname: string;
  lastname: string;
  oldPassword: string;
  password: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    oldPassword: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ oldPassword?: string }>({});
  const [imageUrl, setImageUrl] = useState<string>("");

  // 👁 toggle uchun
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await API.get<User>("/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUser(res.data);
        setFormData({
          firstname: res.data.firstname || "",
          lastname: res.data.lastname || "",
          oldPassword: "",
          password: "",
        });

        setImageUrl(
          res.data.avatar ||
            (Math.random() < 0.5
              ? "https://avatar.iran.liara.run/public/18"
              : "https://avatar.iran.liara.run/public/97")
        );
      } catch (err) {
        const axiosError = err as AxiosError;
        const resp: any = axiosError.response?.data;
        const serverMsg =
          typeof resp === "string"
            ? resp
            : resp?.message || resp?.error || "Ma'lumotlarni olishda xatolik";
        setError(serverMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "oldPassword" && fieldErrors.oldPassword) {
      setFieldErrors((prev) => ({ ...prev, oldPassword: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      user &&
      formData.firstname === user.firstname &&
      formData.lastname === user.lastname &&
      !formData.oldPassword &&
      !formData.password
    ) {
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const payload: Partial<FormData> = {
        firstname: formData.firstname,
        lastname: formData.lastname,
      };

      if (formData.oldPassword && formData.password) {
        payload.oldPassword = formData.oldPassword;
        payload.password = formData.password;
      }

      const res = await API.put<{ user: User; token: string }>(
        "/user/update",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      alert("✅ Ma'lumotlar muvaffaqiyatli yangilandi");
    } catch (err) {
      const axiosError = err as AxiosError;
      const resp: any = axiosError.response?.data;

      let serverMsg = "";
      if (typeof resp === "string") serverMsg = resp;
      else if (resp?.message) serverMsg = resp.message;
      else if (resp?.error) serverMsg = resp.error;
      else serverMsg = "Yangilashda xatolik";

      const lower = serverMsg.toLowerCase();

      if (
        resp?.errors?.oldPassword ||
        resp?.errors?.old_password ||
        lower.includes("old password") ||
        lower.includes("wrong password") ||
        lower.includes("eski parol") ||
        (lower.includes("parol") && lower.includes("xato"))
      ) {
        setFieldErrors({ oldPassword: "Eski kiritilgan parol xato." });
      } else {
        setError(serverMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) return <LoadingSpinner text="Profil yuklanmoqda..." />;

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      {user && (
        <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md text-center">
          {/* Avatar */}
          <div className="mb-4">
            <img
              src={imageUrl || "https://via.placeholder.com/150?text=No+Image"}
              alt="Profile"
              className="w-28 h-28 rounded-full mx-auto border-4 border-[#b18169] shadow-md"
            />
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col text-left">
              <label className="mb-1 font-medium">Ism</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                className="border rounded-lg p-2 shadow-sm"
                required
              />
            </div>

            <div className="flex flex-col text-left">
              <label className="mb-1 font-medium">Familiya</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                className="border rounded-lg p-2 shadow-sm"
                required
              />
            </div>

            {/* Old Password */}
            <div className="flex flex-col text-left relative">
              <label className="mb-1 font-medium">Eski parol</label>
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleInputChange}
                className={`border rounded-lg p-2 pr-10 shadow-sm ${
                  fieldErrors.oldPassword ? "border-red-400" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-10 text-gray-500"
              >
                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {fieldErrors.oldPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.oldPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="flex flex-col text-left relative">
              <label className="mb-1 font-medium">Yangi parol</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="border rounded-lg p-2 pr-10 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* User info */}
            <div className="mt-4 text-gray-600 space-y-1 text-sm">
              <p>
                <span className="font-semibold">Rol:</span>{" "}
                {user.role?.name || "Student"}
              </p>
              <p>
                <span className="font-semibold">Telefon:</span>{" "}
                {user.phone || "Noma'lum"}
              </p>
              {user.email && (
                <p>
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="mt-6 px-6 py-2 bg-[#a0674a] text-white rounded-lg hover:bg-[#e1af96] transition-colors shadow-md"
              disabled={loading}
            >
              {loading ? "Yangilanmoqda..." : "Yangilash"}
            </button>
          </form>

          {/* General server errors */}
          {error && (
            <p className="mt-4 text-red-500 bg-red-100 p-2 rounded-lg text-sm">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default  React.memo(Profile);
