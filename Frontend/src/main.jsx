import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import "./index.css";
import { store } from "./store/store.js";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import RoleRedirect from "./routes/RoleRedirect.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import InstructorLayout from "./layouts/InstructorLayout.jsx";
import {
  Login,
  Courses,
  Instructors,
  Lectures,
  MyLectures,
  CourseDetail
} from "./pages/index.js";
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <RoleRedirect />,
      },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          {
            path: "courses",
            element: <Courses />,
          },
          {
            path: "instructors",
            element: <Instructors />,
          },
          {
            path: "all-lectures",
            element: <Lectures />,
          },
          {
            path: "courses/:courseId",
            element: <CourseDetail />,
          },
        ],
      },
      {
        path: "instructor",
        element: <InstructorLayout />,
        children: [
          {
            path: "my-lectures",
            element: <MyLectures />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);

