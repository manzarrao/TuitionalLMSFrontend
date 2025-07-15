"use client";
import React, { useCallback, useEffect } from "react";
import Image from "next/image";
import classes from "./layout.module.css";
import Sidebar from "@/components/ui/dashboard-sidebar/sidebar";
import Header from "@/components/ui/dashboard-header/header";
import { withAuth } from "@/utils/withAuth/withAuth";

interface LayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<LayoutProps> = ({ children }) => {
  console.log("layout");
  return (
    <main className={classes.main}>
      <Sidebar />
      <main className={classes.section}>
        <Header />
        <div className={classes.mainContent}>{children}</div>
      </main>
      <div className={classes.backgroundImage}>
        <div className={classes.imageBox}>
          <Image
            src="/assets/images/dashboard-background.png"
            alt="background image"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
          />
        </div>
      </div>
    </main>
  );
};

export default withAuth(ProtectedLayout);
