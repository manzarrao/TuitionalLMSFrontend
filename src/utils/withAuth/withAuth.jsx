"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks/hooks";
import { toast } from "react-toastify";
import { fetchAllPagesAssignToUser } from "@/lib/store/slices/assignedPages-slice";
import { fetchResources } from "@/lib/store/slices/resources-slice";
import { fetchRoles } from "@/lib/store/slices/role-slice";
import { fetchUsersByGroup } from "@/lib/store/slices/usersByGroup-slice";
import { ROLES } from "@/const/dashboard/role_ids_names";

// Constants moved outside of component to prevent recreation
const PUBLIC_ROUTES = [
  "/signin",
  "/forgot-password",
  /^\/password-reset(\/.*)?$/,
  /^\/confirm-password(\/.*)?$/,
];

// Check if a path matches any route pattern - Updated to handle dynamic routes
const isMatchingRoute = (path, patterns) => {
  return patterns.some((pattern) => {
    if (typeof pattern === "string") {
      if (path === pattern) {
        return true;
      } else if (
        path
          .split(/(\/)/)
          .slice(0, -2)
          .filter((item) => item !== "")
          .join("") === pattern
      ) {
        return true;
      }

      return false;
    }
    return pattern.test(path);
  });
};

export const withAuth = (WrappedComponent) => {
  const WithAuth = (props) => {
    const { user, token } = useAppSelector((state) => state.user);
    const { assignedPages } = useAppSelector((state) => state.assignedPages);
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();

    // UseRefs to track navigation state
    const hasRedirected = useRef(false);
    const previousPathRef = useRef(null);
    const hasDispatchedPages = useRef(false);

    // Memoized values for better performance
    const isAuthenticated = useMemo(() => Boolean(token), [token]);
    const roleName = useMemo(
      () => (user?.roleId ? ROLES[user?.roleId] : undefined),
      [user?.roleId]
    );
    const roleFromPath = useMemo(() => pathname.split("/")[1], [pathname]);

    // Get protected routes for the current role - Updated for dynamic routes
    const protectedRoutePatterns = useMemo(() => {
      if (!roleName || !assignedPages) return [];
      return assignedPages?.map((item) => {
        const baseRoute = `/${roleName}${item?.route}`;
        return baseRoute;
      });
    }, [roleName, assignedPages]);

    // Memoized route checking
    const isPublicRoute = useMemo(
      () => isMatchingRoute(pathname, PUBLIC_ROUTES),
      [pathname]
    );

    const isProtectedRoute = useMemo(
      () => isMatchingRoute(pathname, protectedRoutePatterns),
      [pathname, protectedRoutePatterns]
    );

    // User's role-based home path
    const roleBasePath = useMemo(
      () => (roleName ? `/${roleName}/dashboard` : "/signin"),
      [roleName]
    );

    // Navigation with toast notification
    const navigateTo = useCallback(
      (path, message) => {
        if (message) {
          if (message.type === "success") {
            toast.success(message.text);
          } else {
            toast.error(message.text);
          }
        }
        router.push(path);
      },
      [router]
    );

    // Effect to dispatch fetchAllPagesAssignToUser when user is authenticated
    useEffect(() => {
      console.log("useEffect 1");
      if (
        isAuthenticated &&
        user?.roleId &&
        token &&
        (!assignedPages || assignedPages.length === 0) &&
        !hasDispatchedPages.current
      ) {
        console.log("apis");
        dispatch(fetchAllPagesAssignToUser(user.roleId, { token }));
        dispatch(fetchUsersByGroup({ token }));
        dispatch(fetchResources({ token }));
        dispatch(fetchRoles({ token }));
        hasDispatchedPages.current = true;
      }

      // Reset the dispatch flag when user logs out
      if (!isAuthenticated) {
        console.log("public");
        hasDispatchedPages.current = false;
      }
    }, [isAuthenticated, user?.roleId, token, assignedPages, dispatch]);

    useEffect(() => {
      console.log("useEffect 2");

      // Prevent effect from running twice in development
      if (previousPathRef.current === pathname) return;
      previousPathRef.current = pathname;

      // Reset redirect flag when path changes (except for the initial redirect)
      if (pathname !== "/" && hasRedirected.current) {
        hasRedirected.current = false;
      }

      // CASE 1: Initial route handling
      if (pathname === "/") {
        if (isAuthenticated) {
          navigateTo(roleBasePath);
        } else {
          navigateTo("/signin");
        }
        return;
      }

      // Handle authentication-based routing
      if (isAuthenticated) {
        // User is authenticated

        // CASE 2 & 4: Prevent authenticated users from accessing public routes (including signin)
        if (isPublicRoute) {
          navigateTo(roleBasePath, {
            type: "error",
            text: "You are already logged in. Redirecting to your dashboard.",
          });
          return;
        }

        // CASE 5: Prevent access to other roles' routes
        if (
          roleFromPath &&
          roleName &&
          roleFromPath !== roleName &&
          !isPublicRoute
        ) {
          navigateTo(roleBasePath, {
            type: "error",
            text: "Unauthorized access. Redirecting to your dashboard.",
          });
          return;
        }

        // CASE 6: Check if authenticated user has access to this protected route
        if (
          !isPublicRoute &&
          !isProtectedRoute &&
          assignedPages &&
          assignedPages.length > 0
        ) {
          navigateTo(roleBasePath, {
            type: "error",
            text: "You don't have access to this page. Redirecting to your dashboard.",
          });
          return;
        }
      } else {
        // User is not authenticated

        // CASE 3: Block unauthenticated access to protected routes
        if (!isPublicRoute) {
          navigateTo("/signin", {
            type: "error",
            text: "Access denied. Please sign in.",
          });
          return;
        }
      }
    }, [
      user?.roleId,
      token,
      pathname,
      isAuthenticated,
      roleName,
      roleFromPath,
      roleBasePath,
      isPublicRoute,
      isProtectedRoute,
      navigateTo,
      assignedPages,
    ]);

    // Only render the component if access is allowed
    const isAllowedAccess = useMemo(() => {
      // Allow public routes
      if (isPublicRoute) return true;

      // Require authentication for non-public routes
      if (!isAuthenticated) return false;

      // If we haven't loaded assignedPages yet, allow access (loading state)
      if (!assignedPages || assignedPages.length === 0) return true;

      // Check if user has access to this protected route
      return isProtectedRoute;
    }, [isPublicRoute, isAuthenticated, assignedPages, isProtectedRoute]);

    return isAllowedAccess ? <WrappedComponent {...props} /> : null;
  };

  // Display name for debugging
  const wrappedComponentName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  WithAuth.displayName = `withAuth(${wrappedComponentName})`;

  return WithAuth;
};

export default withAuth;
