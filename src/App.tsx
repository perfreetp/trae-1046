import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import MainLayout from "@/components/Layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Announcements from "@/pages/Announcements";
import Bidding from "@/pages/Bidding";
import Clues from "@/pages/Clues";
import Credit from "@/pages/Credit";
import Statistics from "@/pages/Statistics";

export default function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: "#165DFF",
        },
      }}
    >
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/bidding" element={<Bidding />} />
            <Route path="/clues" element={<Clues />} />
            <Route path="/credit" element={<Credit />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </MainLayout>
      </Router>
    </ConfigProvider>
  );
}
