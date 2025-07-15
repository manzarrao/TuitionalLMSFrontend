import React from "react";
import Dashboard from "@/screens/admin-dashboard/admin-dashboard";
import StudentTeacherDashboard from "@/screens/student-teacher-dashboard/student-teacher-dashboard";

const Page = async ({ params }: { params: Promise<{ role: string }> }) => {
  const { role } = await params;

  return role === "superAdmin" || role === "admin" ? (
    <Dashboard />
  ) : role === "student" || role === "teacher" || role === "parent" ? (
    <StudentTeacherDashboard />
  ) : null;
};

export default Page;
