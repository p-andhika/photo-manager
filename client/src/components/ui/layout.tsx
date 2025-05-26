import { Outlet } from "react-router";
import { Toaster } from "sonner";

export const Layout = () => {
  return (
    <div className="px-40 py-20">
      <Outlet />
      <Toaster richColors position="bottom-center" />
    </div>
  );
};
