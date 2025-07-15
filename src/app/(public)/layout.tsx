"use client";
import React, { useMemo, useCallback } from "react";
import { withAuth } from "@/utils/withAuth/withAuth";
import Image from "next/image";
import classes from "./layout.module.css";
import { usePathname, useParams } from "next/navigation";
import {
  GraduationCap,
  Users,
  Calendar,
  DollarSign,
  Shield,
  BookOpen,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

// Static route configuration object
const ROUTE_CONFIG = Object.freeze({
  signin: {
    heading: "Sign in",
    text: "Login to manage your account",
  },
  "forgot-password": {
    heading: "Forgot Password?",
    text: "To reset your password, enter your email address below",
  },
});

// Extract route pattern checking into a dedicated function - memoize at module level
const getRouteType = (pathname: string): string => {
  if (pathname.includes("/signin")) return "signin";
  if (pathname.includes("/forgot-password")) return "forgot-password";
  if (pathname.includes("/password-reset/")) return "password-reset";
  if (pathname.includes("/confirm-password/")) return "confirm-password";
  return "default";
};

// Memoized static image props at module level to be shared across renders
const LOGO_IMAGE_PROPS = Object.freeze({
  src: "/assets/svgs/logo.svg",
  alt: "icon",
  fill: true,
  sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority: true,
});

const GREETING_IMAGE_PROPS = Object.freeze({
  src: "/assets/images/greeting.png",
  alt: "Greeting Image",
  fill: true,
  sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  loading: "eager" as const,
});

const MAIN_PIC_IMAGE_PROPS = Object.freeze({
  src: "/assets/svgs/mainPic.svg",
  alt: "Main Image",
  fill: true,
  sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority: true,
});

// Create memoized components for each section
const LogoSection = React.memo(() => (
  <div className={classes.iconBox}>
    <Image {...LOGO_IMAGE_PROPS} />
  </div>
));
LogoSection.displayName = "LogoSection";

const BannerImages = React.memo(() => (
  <div className={classes.signinBannerBox}>
    <div className={classes.heading}>
      <Image {...GREETING_IMAGE_PROPS} />
    </div>
    <div className={classes.mainPic}>
      <Image {...MAIN_PIC_IMAGE_PROPS} />
    </div>
  </div>
));
BannerImages.displayName = "BannerImages";

// Main component
const Layout = React.memo(({ children }: LayoutProps) => {
  const { email } = useParams<{ email: string }>();
  const pathname = usePathname();

  // Decode email only once with safeguard against decoding errors
  const decodedEmail = useMemo(() => {
    if (!email) return "";
    try {
      return decodeURIComponent(email);
    } catch (e) {
      console.error("Error decoding email:", e);
      return email; // Fallback to encoded version
    }
  }, [email]);

  // Memoize the route type calculation
  const routeType = useMemo(() => getRouteType(pathname), [pathname]);

  // Determine content based on route type - now with memoized routeType
  const content = useMemo(() => {
    switch (routeType) {
      case "signin":
      case "forgot-password":
        return ROUTE_CONFIG[routeType];

      case "password-reset":
        return {
          heading: "Password Reset",
          text: (
            <>
              We sent a code to <span>{decodedEmail}</span>. Please enter the
              code below to reset your password.
            </>
          ),
        };

      case "confirm-password":
        return {
          heading: "Enter your new password",
          text: "Your new password must be different from previous passwords",
        };

      default:
        return {
          heading: "Welcome",
          text: "Please complete the required information",
        };
    }
  }, [routeType, decodedEmail]);

  // Memoize the heading and text rendering
  const HeadingSection = useCallback(
    () => (
      <div className={classes.headingBox}>
        <p>{content.heading}</p>
        <p>{content.text}</p>
      </div>
    ),
    [content]
  );

  return (
    <main className={classes.mainContainer}>
      <div className={classes.signinFormBox}>
        <div className={classes.child}>
          <div className={classes.conatiner}>
            <LogoSection />
            <HeadingSection />
            {children}
          </div>
        </div>
      </div>
      <div className={classes.rightSideContainer}>
        <Image
          src="/assets/svgs/mainPic.svg"
          alt="Main Image"
          width={0}
          height={0}
          className={classes.backgroundImage}
          priority={true}
        />
        <div className={classes.titleContainer}>
          <h1 className={classes.title}>Tuitional LMS Pro</h1>
          <p className={classes.subtitle}>School Management System</p>
        </div>
        <div className={classes.descriptionContainer}>
          <h2 className={classes.descriptionTitle}>
            Complete School Management Solution
          </h2>
          <p className={classes.descriptionText}>
            Streamline admissions, attendance, academics, and administration
            with our comprehensive platform designed for traditional schools.
          </p>
        </div>
        <div className={classes.featuresGrid}>
          <div className={classes.featureItem}>
            <Users className={classes.iconBlue} />
            <span className={classes.featureText}>Student Management</span>
          </div>
          <div className={classes.featureItem}>
            <BookOpen className={classes.iconGreen} />
            <span className={classes.featureText}>Academic Records</span>
          </div>
          <div className={classes.featureItem}>
            <Calendar className={classes.iconPurple} />
            <span className={classes.featureText}>Attendance Tracking</span>
          </div>
          <div className={classes.featureItem}>
            <DollarSign className={classes.iconYellow} />
            <span className={classes.featureText}>Fee Management</span>
          </div>
          <div className={classes.featureItem}>
            <Shield className={classes.iconRed} />
            <span className={classes.featureText}>Security & Safety</span>
          </div>
          <div className={classes.emptyGridCell}></div>
          <div className={classes.featureItem}>
            <GraduationCap className={classes.iconIndigo} />
            <span className={classes.featureText}>Exam Management</span>
          </div>
        </div>
      </div>
    </main>
  );
});

// Set display name for better debugging
Layout.displayName = "AuthLayout";

// Export with higher-order component
export default withAuth(Layout);
