import { Outlet, useLocation, useNavigate } from "react-router-dom";
import InfinityLoader from "../components/loader/Infinity";
import { useDispatch, useSelector } from "react-redux";
import Drawer from "../components/drawer/Drawer";
import CustomBreadCrumb from "../components/breadcrumbs/BreadCrumb";
import { protectedCall } from "../services/userService";
import { useEffect, useState } from "react";
import { deleteDetails, selectLoggedUser } from "../pages/login/loginSlice";
import { deleteUser } from "../pages/user/userSlice";

export default function Main() {
  const selector = useSelector((select) => select.user);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [menu, setMenu] = useState([]);
  const loggedUser = useSelector(selectLoggedUser);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const newRoles = await protectedCall("api/roles");
        console.log("Fetched roles:", newRoles); // Debugging log
        setRoles(newRoles);
      } catch (error) {
        console.error("Failed to fetch roles:", error); // Error handling
      } finally {
        setLoading(false); // Always stop loading after attempt
      }
    };

    if (loggedUser?.role) {
      setLoading(true);
      fetchRoles();
    } else {
      setLoading(false); // Set loading to false if no user role
    }
  }, [loggedUser?.role]);

  // Fetch menu based on role
  useEffect(() => {
    const fetchMenu = async () => {
      const isRole = roles.find(
        (elem) => loggedUser?.role?.toLowerCase() === elem?.name?.toLowerCase()
      )?.id;

      if (isRole) {
        try {
          const newMenus = await protectedCall(`api/menu-creator/${isRole}`);
          console.log("Fetched menus:", newMenus); // Debugging log
          setMenu(newMenus);
        } catch (error) {
          console.error("Failed to fetch menu:", error); // Error handling
        } finally {
          setLoading(false); // Stop loading after fetching
        }
      }
    };

    if (roles.length > 0 && loggedUser?.role) {
      setLoading(true);
      fetchMenu();
    } else {
      setLoading(false); // Set loading to false if no roles
    }
  }, [loggedUser?.role, roles]);

  // Function to check allowed routes
  function getAllowedRoutes(data) {
    let allowedRoutes = [];

    // Loop through each module
    data.forEach((module) => {
      // Check for subModules and their screens
      if (module.subModules && module.subModules.length > 0) {
        module.subModules.forEach((subModule) => {
          if (
            subModule.subModuleScreens &&
            subModule.subModuleScreens.length > 0
          ) {
            subModule.subModuleScreens.forEach((screen) => {
              // Check if any action has permission
              const hasPermission = screen.actions.some(
                (action) => action.hasPermission
              );
              if (hasPermission) {
                allowedRoutes.push(screen.screenRoute);
              }
            });
          }
        });
      }

      // Check for screens directly in the module (like /dashboard)
      if (module.screens && module.screens.length > 0) {
        module.screens.forEach((screen) => {
          // Check if any action has permission
          const hasPermission = screen.actions.some(
            (action) => action.hasPermission
          );
          if (hasPermission) {
            allowedRoutes.push(screen.screenRoute);
          }
        });
      }
    });

    return allowedRoutes;
  }

  // Check route permissions after menu is fetched
  useEffect(() => {
    const checkRoutePermission = (currentRoute) => {
      const allowedRoutes = getAllowedRoutes(menu);
      console.log("Allowed routes:", allowedRoutes); // Debugging log
      // Check if the current route is allowed
      if (allowedRoutes?.some((route) => currentRoute.startsWith(route))) {
        return true; // Allow access
      } else {
        // Redirect to the login page if route is not allowed
        dispatch(deleteUser([]));
        dispatch(deleteDetails());
        navigate("/");
        return false;
      }
    };

    if (!loading && menu.length > 0) {
      // Check loading state and if menu is fetched before checking permissions
      checkRoutePermission(pathname);
    }
  }, [pathname, menu, loading, dispatch, navigate]);

  return (
    <>
      <Drawer>
        <CustomBreadCrumb />
        <Outlet />
      </Drawer>
      {selector?.status === "loading" || loading ? <InfinityLoader /> : null}
    </>
  );
}
