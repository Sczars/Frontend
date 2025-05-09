import Login from "./Login";
import Dashboard from "./Dashboard";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Navigate,
} from "react-router-dom";
import { ReactNode } from "react";

interface ProtectWrapperProps {
  children: ReactNode;
}

function ProtectWrapper({ children }: ProtectWrapperProps) {
  const access_tk = localStorage.getItem("access_token");

  if (!access_tk) {
    return <Navigate to="/" />;
  }

  return children;
}

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/dashboard",
    element: (
      <ProtectWrapper>
        <Dashboard />
      </ProtectWrapper>
    ),
  },
  {
    path: "*",
    element: (
      <>
        <h1>This page does not exist</h1>
        <Link to="/">GO TO LOGIN</Link>
      </>
    ),
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
