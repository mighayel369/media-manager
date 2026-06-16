import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthLayout } from "./layouts/AuthLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { PublicRoute } from "./components/PublicRoute";
import { GalleryPage } from "./pages/dashboard/GalleryPage";
import { RootLayout } from "./layouts/RootLayout";
import { PrivateRoute } from "./components/PrivateRoute";
import { NotFound } from "./components/NotFound";
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
        element: <NotFound errorCode="404" title="Route Not Found" />
      }
    ]
  },
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <PrivateRoute ><GalleryPage /></PrivateRoute>
      },
      {
        path: "*",
        element: <NotFound errorCode="404" title="Route Not Found" />
      }
    ]
  }
]);

export function App() {
  return <RouterProvider router={router} />
}

export default App
