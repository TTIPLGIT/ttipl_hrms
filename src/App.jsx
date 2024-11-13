// import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import LoginPage from "./pages/login/Login";
// import Main from "./layouts/Main";
// import "primeicons/primeicons.css";
// import "primereact/resources/themes/lara-light-cyan/theme.css";
// import "/node_modules/primeflex/primeflex.css";

// import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
// import Registration from "./pages/registerForm/RegistrationForm";
// import Profile from "./pages/profile/Profile";
// import ErrorPage from "./pages/errorPage/ErrorPage";
// import { useEffect } from "react";
// import "./styles/global.css";
// import { useSelector } from "react-redux";

// import routes from "./routes/routes";

// //font awesome
// import "@fortawesome/fontawesome-free/css/all.css";
// import LandingLayout from "./layouts/LandingLayout";
// import ResetScreen from "./pages/forgotPassword/ResetScreen";
// import Verification from "./pages/forgotPassword/Verification";
// import CheckForgotMain from "./pages/forgotPassword/CheckForgotMain";
// import CheckOtpMain from "./pages/forgotPassword/CheckOtpMain";
// import CheckResetPassword from "./pages/forgotPassword/CheckResetPassword";

// export default function App() {
//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <LoginPage />,
//     },
//     {
//       path: "/forgot-password",
//       element: <CheckForgotMain />,
//     },
//     {
//       path: "/otp",
//       element: <CheckOtpMain />,
//     },
//     {
//       path: "/reset-password",
//       element: <CheckResetPassword />,
//     },
//     {
//       path: "/register",
//       element: <Registration />,
//     },
//     {
//       path: "/profile",
//       element: <Profile />,
//     },
//     {
//       path: "/Errorpage",
//       element: <ErrorPage />,
//     },
//     {
//       path: "/",
//       element: <Main />,
//       children: routes,
//     },
//     {
//       path: "/landing_page",
//       element: <LandingLayout />,
//     },
//     {
//       path: "/resetpassword",
//       element: <ResetScreen />,
//     },
//     {
//       path: "/otp",
//       element: <Verification />,
//     },
//   ]);

//   const theme = useSelector((select) => select.theme.theme);

//   useEffect(() => {
//     const existingLink = document.getElementById("theme-stylesheet");
//     if (existingLink) {
//       existingLink.parentNode.removeChild(existingLink);
//     }

//     const cssFile =
//       theme === "dark" ? "../src/styles/dark.css" : "../src/styles/hrms.css";

//     const link = document.createElement("link");
//     link.id = "theme-stylesheet";
//     link.rel = "stylesheet";
//     link.href = cssFile;
//     document.head.appendChild(link);

//     console.log(
//       `${theme.charAt(0).toUpperCase() + theme.slice(1)} theme loaded`
//     );

//     return () => {
//       if (link.parentNode) {
//         link.parentNode.removeChild(link);
//       }
//     };
//   }, [theme]);

//   return (
//     <>
//       <RouterProvider router={router} />
//     </>
//   );
// }

import { HashRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/Login";
import Main from "./layouts/Main";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "/node_modules/primeflex/primeflex.css";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import Registration from "./pages/registerForm/RegistrationForm";
import Profile from "./pages/profile/Profile";
import ErrorPage from "./pages/errorPage/ErrorPage";
import { useEffect } from "react";
import "./styles/global.css";
import { useSelector } from "react-redux";
import routes from "./routes/routes";
import LandingLayout from "./layouts/LandingLayout";
import ResetScreen from "./pages/forgotPassword/ResetScreen";
import Verification from "./pages/forgotPassword/Verification";
import CheckForgotMain from "./pages/forgotPassword/CheckForgotMain";
import CheckOtpMain from "./pages/forgotPassword/CheckOtpMain";
import CheckResetPassword from "./pages/forgotPassword/CheckResetPassword";
import "../public/hrms.css";

// font awesome
import "@fortawesome/fontawesome-free/css/all.css";

export default function App() {
  // const theme = useSelector((select) => select.theme.theme);

  // useEffect(() => {
  //   const existingLink = document.getElementById("theme-stylesheet");
  //   if (existingLink) {
  //     existingLink.parentNode.removeChild(existingLink);
  //   }

  //   const cssFile =
  //     theme === "dark" ? "../src/styles/dark.css" : "public/hrms.css";

  //   const link = document.createElement("link");
  //   link.id = "theme-stylesheet";
  //   link.rel = "stylesheet";
  //   link.href = cssFile;
  //   document.head.appendChild(link);

  //   console.log(
  //     `${theme.charAt(0).toUpperCase() + theme.slice(1)} theme loaded`
  //   );

  //   return () => {
  //     if (link.parentNode) {
  //       link.parentNode.removeChild(link);
  //     }
  //   };
  // }, [theme]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<CheckForgotMain />} />
        <Route path="/otp" element={<CheckOtpMain />} />
        <Route path="/reset-password" element={<CheckResetPassword />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Errorpage" element={<ErrorPage />} />
        <Route path="/" element={<Main />}>
          {routes.map((route, idx) => (
            <Route key={idx} path={route.path} element={route.element} />
          ))}
        </Route>
        <Route path="/landing_page" element={<LandingLayout />} />
        <Route path="/resetpassword" element={<ResetScreen />} />
        <Route path="/otp" element={<Verification />} />
      </Routes>
    </Router>
  );
}
