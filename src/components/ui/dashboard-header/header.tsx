"use client";
import React, { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Grid, Box } from "@mui/material";
import styles from "./header.module.css";
import NotificationBox from "./notificationBox/notificationBox";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useAppSelector } from "@/lib/store/hooks/hooks";

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const userRole = useAppSelector((state: any) => state?.user?.user?.roleId);
  const role = userRole === 1 ? "superAdmin" : userRole === 2 ? "admin" : "";

  // Function to format the pathname into a user-friendly title
  const formattedPathname = useMemo(() => {
    const segments = pathname
      .replace(/^\/+/, "") // Remove leading slashes
      .split("/")
      .filter(
        (segment) =>
          !["superAdmin", "admin", "student", "parent", "teacher"].includes(
            segment
          ) && isNaN(Number(segment)) // Exclude numeric segments
      )
      .map((segment) =>
        segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      );

    return segments.join(" ");
  }, [pathname]);

  // Check if the current route matches specific patterns
  const isSpecificPath = useMemo(() => {
    const patterns = {
      tutorProfile: new RegExp(`^/${role}/tutor-profile/\\d+$`),
      enrollmentDetails: new RegExp(`^/${role}/enrollment-details/\\d+$`),
      sessionDetails: new RegExp(`^/${role}/session-details/\\d+$`),
    };

    return {
      tutorProfile: patterns.tutorProfile.test(pathname),
      enrollmentDetails: patterns.enrollmentDetails.test(pathname),
      sessionDetails: patterns.sessionDetails.test(pathname),
    };
  }, [pathname, role]);

  // Handle back button navigation
  const handleBackClick = () => {
    if (isSpecificPath.tutorProfile) {
      router.push(`/${role}/tutor-requests`);
    } else if (isSpecificPath.enrollmentDetails) {
      router.push(`/${role}/enrollments`);
    } else if (isSpecificPath.sessionDetails) {
      router.push(`/${role}/sessions`);
    }
  };

  return (
    <header className={styles.container}>
      <div className={styles.aside1}>
        {(isSpecificPath.tutorProfile ||
          isSpecificPath.enrollmentDetails ||
          isSpecificPath.sessionDetails) && (
          <Box className={styles.backButton} onClick={handleBackClick}>
            <ArrowBackIosIcon />
          </Box>
        )}
        <h1 className={styles.heading}>{formattedPathname}</h1>
      </div>
      <div className={styles.aside2}>
        <NotificationBox />
      </div>
    </header>
  );
};

export default Header;
