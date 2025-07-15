"use client";
import React from "react";
import classes from "./demo.module.css";
import DemoCard from "@/components/ui/superAdmin/demo/demoCard/demoCard";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Tabs from "@/components/global/tabs/tabs";
import CreateDemoLink from "@/components/ui/superAdmin/demo/tabs/createDemoLink/createDemoLink";
import UpcomingDemos from "@/components/ui/superAdmin/demo/tabs/upcomingDemos/upcomingDemos";

const Demo = () => {
  const [activeTab, setActiveTab] = React.useState("Create Demo Link");

  return (
    <div className={classes.container}>
      <div className={classes.cardBox}>
        {[
          {
            heading: "Total Demos",
            number: 1,
            icon: <CalendarMonthOutlinedIcon />,
            text: "This is a demo card.",
          },
          {
            heading: "Avg Conversion Rate",
            number: 72,
            icon: <ShowChartOutlinedIcon />,
            text: "+5% from last month",
          },
          {
            heading: "Students Converted",
            number: 56,
            icon: <PeopleAltOutlinedIcon />,
            text: "From 76 total attendees",
          },
          {
            heading: "Feedback Reports",
            number: 3,
            icon: <DescriptionOutlinedIcon />,
            text: "Teacher feedback submitted",
          },
        ].map((item) => (
          <DemoCard
            heading={item.heading}
            number={item.number}
            icon={item.icon}
            text={item.text}
          />
        ))}
      </div>
      <Tabs
        tabsArray={[
          "Create Demo Link",
          "Upcoming Demos",
          "Manage All Demos",
          "Teacher Performance",
          "Feedback  Reports",
        ]}
        activeTab={activeTab}
        handleTabChange={(tab) => setActiveTab(tab)}
        inlineTabsStyles={{ borderRadius: "7.5px" }}
        borderRadius="5px"
      />
      {activeTab === "Create Demo Link" ? (
        <CreateDemoLink />
      ) : (
        <UpcomingDemos />
      )}
    </div>
  );
};

export default Demo;
