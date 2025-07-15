import React from "react";
import classes from "./upcomingDemos.module.css";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import UpcomingDemoCards from "./upcomingDemoCards/upcomingDemoCards";

const UpcomingDemos = () => {
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div>
          <span>
            <CalendarTodayOutlinedIcon sx={{ width: "2rem", height: "2rem" }} />
          </span>
          <p>Create Demo Link</p>
        </div>
        <p>
          Generate a new Google Meet demo session link for one-on-one student
          sessions
        </p>
      </div>
      <div className={classes.cardsDiv}>
        <UpcomingDemoCards key={1} />
      </div>
    </div>
  );
};

export default UpcomingDemos;
