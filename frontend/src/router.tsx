import React from "react";
import { Route, Routes } from "react-router-dom";
import { Space, Spin } from "antd";

const Loading = () => {
  return (
    <Space size="middle">
      <Spin size="large" />
    </Space>
  )
}
const routers = [
  {
    name: "Home",
    path: "/",
    element: React.lazy(() => import("@/pages/home")),
  },
  {
    name: "About",
    path: "about",
    element: React.lazy(() => import("@/pages/about")),
  },
  {
    name: "Test",
    path: "test",
    element: React.lazy(() => import("@/pages/test")),
  },
  {
    name: "Login",
    path: "login",
    element: React.lazy(() => import("@/pages/login")),
  },
  {
    name: "Account",
    path: "account",
    element: React.lazy(() => import("@/pages/account")),
  },
  {
    name: "404",
    path: "*",
    element: React.lazy(() => import("@/pages/404")),
  },
];

const Router = () => {
  return (
    <Routes>
      {routers.map(item => {
        return <Route
          {...item}
          key={item.name}
          path={item.path}
          element={
            <React.Suspense fallback={<Loading />}>
              <item.element />
            </React.Suspense>
          } />
      })}
    </Routes>
  )
}
export default Router;
