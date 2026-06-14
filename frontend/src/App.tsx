import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthLayout } from "./layouts/AuthLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { PublicRoute } from "./components/PublicRoute";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <PublicRoute><LoginPage /></PublicRoute>
      },
      {
        path: '/register',
        element: <PublicRoute><RegisterPage /></PublicRoute>
      },
      {
        path: "*",
        element: <Navigate to="/login" replace />,
      },
    ]
  }
]);

export function App() {
  return <RouterProvider router={router} />
}

export default App
