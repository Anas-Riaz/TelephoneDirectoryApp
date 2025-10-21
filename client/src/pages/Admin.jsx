import { Outlet } from "react-router-dom";

export default function Admin() {
  return (
    <>
      <h2>Welcome to Admin Dashboard</h2>
      <Outlet />
    </>
  );
}
