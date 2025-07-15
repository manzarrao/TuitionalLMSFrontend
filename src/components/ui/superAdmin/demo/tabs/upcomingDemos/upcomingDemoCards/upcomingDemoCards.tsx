import React from "react";
import classes from "./upcomingDemoCards.module.css";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

interface UpcomingDemoCardsProps {
  key: number | string;
}

const UpcomingDemoCards = ({ key }: UpcomingDemoCardsProps) => {
  const [sideActionsModal, setSideActionsModal] = React.useState(false);
  return (
    <div key={key} className={classes.card}>
      <div className={classes.cardContent}>
        <div className={classes.cardTitleRow}>
          <h3 className={classes.cardTitle}>Chemistry</h3>
          <span className={classes.capitalizeText}>CBSE</span>
          <span className={classes.capitalizeText}>Grade 11</span>
        </div>
        <div className={classes.cardDescription}>
          <div className={classes.createdDate}>
            <PermIdentityIcon sx={{ height: "1.2rem", width: "1.2rem" }} />
            Created On: 2024-01-18 11:00 AM
          </div>{" "}
          <div className={classes.createdDate}>
            <CalendarTodayOutlinedIcon sx={{ height: "1rem", width: "1rem" }} />
            Created On: 2024-01-18 11:00 AM
          </div>
        </div>
        <div className={classes.cardDescription}>
          <div className={classes.createdDate}>
            <PermIdentityIcon sx={{ height: "1.2rem", width: "1.2rem" }} />
            Created On: 2024-01-18 11:00 AM
          </div>{" "}
          <div className={classes.createdDate}>
            <PermIdentityIcon sx={{ height: "1.2rem", width: "1.2rem" }} />
            Created On: 2024-01-18 11:00 AM
          </div>
        </div>
        <div className={classes.cardActions}>
          <VideocamOutlinedIcon sx={{ color: "var(--main-color)" }} />{" "}
          <span>rst-uvwx-yz1</span>{" "}
          <ContentCopyOutlinedIcon sx={{ cursor: "pointer" }} />
        </div>
      </div>
      <div className={classes.actionsBox}>
        <div className={classes.meetingLink}>
          <LaunchOutlinedIcon sx={{ height: "1rem", width: "1rem" }} />
          Join Meet
        </div>
        <div className={classes.feedback}>
          <ChatBubbleOutlineOutlinedIcon
            sx={{ height: "1rem", width: "1rem", color: "var(--main-color)" }}
          />
          Collect Feedback
        </div>
        <span
          className={classes.sideActions}
          onClick={() => setSideActionsModal((prev) => !prev)}
        >
          <MoreHorizOutlinedIcon sx={{ height: "1rem", width: "1rem" }} />
          {sideActionsModal && <SideActionsModal />}
        </span>
      </div>
    </div>
  );
};

const SideActionsModal = () => {
  return (
    <div className={classes.sideActionsModal}>
      <div className={classes.childs}>
        <EditOutlinedIcon sx={{ height: "1rem", width: "1rem" }} />
        Edit Details
      </div>
      <div className={classes.childs}>
        <DeleteOutlineOutlinedIcon sx={{ height: "1rem", width: "1rem" }} />
        Cancel Demo
      </div>
    </div>
  );
};

export default UpcomingDemoCards;
