import { Outlet } from "react-router";

export const Layout = () => {
  return (
    <div className="px-40 py-20">
      <Outlet />
    </div>
  );
};
