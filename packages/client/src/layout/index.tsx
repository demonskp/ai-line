import { useAccountStore } from "@/store/account-store";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";

export default function Layout() {
  const getMyInfo = useAccountStore((state) => state.getMyInfo);

  useEffect(() => {
    async function fetchMyInfo() {
      await getMyInfo();
    }
    fetchMyInfo();
  }, []);

  return (
    <div>
      <h1>Layout</h1>
      <Outlet />
    </div>
  );
}
