"use client";
import BootScreen from "@/components/ui/boot-screen";
import DesktopDashboard from "@/components/dashboard/desktop-dashboard";

export default function Home() {
  return (
    <>
      <BootScreen />
      <DesktopDashboard />
    </>
  );
}
