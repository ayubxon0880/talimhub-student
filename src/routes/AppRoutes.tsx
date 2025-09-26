import { Routes, Route, Navigate } from "react-router-dom";
import {  lazy } from "react";
import ProtectedRoute from "../components/layout/ProtectedRoute";

const Login = lazy(() => import("../pages/login/AuthLogin"));
const Home = lazy(() => import("../pages/Home/Home"));
const Layout = lazy(() => import("../pages/Layout/layout"));
const Profile = lazy(() => import("../pages/profile/Profile"));
const Speakings = lazy(() => import("../pages/speaking/Speakings"));
const MySpeaking = lazy(() => import("../pages/speaking/MySpeaking"));
const TakeExam = lazy(() => import("../pages/SpeakingExam/Take-Exam"));
const SpeakingDetail = lazy(() => import("../pages/speaking/SingleSpeaking"));
const UserDetail = lazy(() => import("../pages/UserDetail"));
const Likes = lazy(() => import("../pages/Likes"));
const TeamPage = lazy(() => import("../pages/Team"));

const AppRoutes = () => {
  return (
   
      <Routes>
     
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="speaking" element={<Speakings />} />
          <Route path="my-speaking" element={<MySpeaking />} />
          <Route path="take-exam" element={<TakeExam />} />
          <Route path="speaking/:id" element={<SpeakingDetail />} />
          <Route path="user-detail/:id" element={<UserDetail />} />
          <Route path="user-speaking/:id" element={<MySpeaking />} />
          <Route path="likes" element={<Likes />} />
          <Route path="team" element={<TeamPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  
  );
};

export default AppRoutes;
