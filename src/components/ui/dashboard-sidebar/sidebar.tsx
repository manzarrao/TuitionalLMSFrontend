"use client";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import styles from "./sidebar.module.css";
import Image from "next/image";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import { emptyUserData } from "@/lib/store/slices/user-slice";
import { emptyAssignedPages } from "@/lib/store/slices/assignedPages-slice";
import { emptyResources } from "@/lib/store/slices/resources-slice";
import { emptyRoles } from "@/lib/store/slices/role-slice";
import { emptyUserByGroup } from "@/lib/store/slices/usersByGroup-slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks/hooks";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { Tooltip } from "@mui/material";
import { ROLES } from "@/const/dashboard/role_ids_names";

const SidebarIcon = React.memo(
  ({
    item,
    isActive,
    roleName,
  }: {
    item: any;
    isActive: boolean;
    roleName: string;
  }) => {
    return (
      <div className={styles.iconWrapper}>
        <Tooltip title={item?.name} placement="bottom" arrow>
          <Link
            href={`/${roleName}${item?.route}`}
            className={isActive ? styles.active : styles.iconBox}
          >
            {typeof item?.icon === "string" ? (
              <Image src={item.icon} alt={item?.name} width={24} height={24} />
            ) : typeof item?.icon === "object" ? (
              <item.icon
                className={`${
                  isActive ? "text-white " : "text-black"
                } hover:text-white `}
                style={{
                  width: "18px",
                  height: "18px",
                }}
              />
            ) : (
              item.icon
            )}
          </Link>
        </Tooltip>
      </div>
    );
  }
);

SidebarIcon.displayName = "SidebarIcon";

const Sidebar: React.FC = React.memo(() => {
  const { assignedPages } = useAppSelector(
    (state: any) => state?.assignedPages
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user, token } = useAppSelector((state: any) => state?.user);
  const roleName = ROLES[user?.roleId as keyof typeof ROLES];
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [isContentVisible, setIsContentVisible] = useState<boolean>(false);

  const sidebarData = useMemo(() => {
    const excludedRoutes = ["/enrollment-details", "/session-details","/tutor-profile"];
    return assignedPages?.filter(
      (item: any) => !excludedRoutes.includes(item.route)
    );
  }, [assignedPages, user?.roleId]);

  // Check if width is 576px or smaller
  const isMobile = windowWidth <= 576;

  const toggleContentVisibility = useCallback(() => {
    if (isMobile) {
      setIsContentVisible((prev) => !prev);
    }
  }, [isMobile]);

  const handleLogout = useCallback(() => {
    dispatch(emptyUserData());
    dispatch(emptyAssignedPages());
    dispatch(emptyResources());
    dispatch(emptyRoles());
    dispatch(emptyUserByGroup());
    router.push("/signin");
    toast.success("Logout Successfully");
  }, [dispatch, router]);

  // Effect to track window width
  useEffect(() => {
    // Only run on the client side
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);

      // Add resize event listener
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);

      // Clean up event listener
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // The sidebar section content
  const sidebarContent = (
    <section
      className={`${styles.sidebar} ${isMobile ? styles.mobileSidebar : ""}`}
      onClick={toggleContentVisibility}
    >
      <div style={{ height: "45px", width: "45px", position: "relative" }}>
        <Image
          src="/assets/svgs/logo.svg"
          alt="Logo"
          fill
          sizes="(max-width: 480px) 15px, (max-width: 768px) 20px, 20px"
          priority
        />
      </div>
      <div
        className={`${styles.content} ${
          isMobile && !isContentVisible ? styles.contentHidden : ""
        }`}
      >
        <div className={styles.routesBox}>
          {sidebarData?.map((item: any) => (
            <SidebarIcon
              roleName={roleName}
              key={item?.name}
              item={item}
              isActive={pathname === `/${roleName}/${item?.route}`}
            />
          ))}
        </div>
        <div className={styles.logoutBox} onClick={handleLogout}>
          <span>Logout</span>
          <LogoutIcon className={styles.icon} />
        </div>
      </div>
    </section>
  );

  // Conditionally wrap the section in an extra div
  if (isMobile && isContentVisible) {
    return <div className={styles.sidebarWrapper}>{sidebarContent}</div>;
  }

  // Return just the section if conditions aren't met
  return sidebarContent;
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
