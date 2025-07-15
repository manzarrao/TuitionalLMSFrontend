import React, { useState, memo, useCallback, useEffect } from "react";
import Modal from "@mui/material/Modal";
import classes from "./notifications-modal.module.css";
import Image from "next/image";
const notificationPic = "/assets/svgs/notificationPic.svg";

interface BasicModalProps {
  modalOpen: boolean;
  handleClose: any;
}

const NotificationsModal: React.FC<BasicModalProps> = ({
  modalOpen,
  handleClose,
}) => {
  return (
    <Modal
      open={modalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        background: "rgba(255, 255, 255, 0.01)",
        backdropFilter: "blur(17.5px)",
      }}
    >
      <div className={classes.mainBox}>
        <header className={classes.header}>
          <p>Notification</p>
          <p>Stay Updated With Your Latest Notifications</p>
        </header>
        <div className={classes.section2}>
          <div className={classes.contentBox}>
            <div className={classes.notificationIconBox}>
              <Image
                alt="icon"
                src={notificationPic}
                width={0}
                height={0}
                style={{
                  height: "60%",
                  width: "60%",
                }}
              />
            </div>
            <div className={classes.notificationTextBox}>
              <p>
                Avni your class for 12/12/25 11:00 PM has been cancelled and
                rescheduled to 13/12/2025 at 12:00 PM
              </p>
              <p>July 12th, 2025 | 9:15 PM</p>
            </div>
            <div className={classes.redDot}></div>
          </div>
          <div className={classes.contentBox}>
            <div className={classes.notificationIconBox}>
              <Image
                alt="icon"
                src={notificationPic}
                width={0}
                height={0}
                style={{
                  height: "60%",
                  width: "60%",
                }}
              />
            </div>
            <div className={classes.notificationTextBox}>
              <p>
                Avni your class for 12/12/25 11:00 PM has been cancelled and
                rescheduled to 13/12/2025 at 12:00 PM
              </p>
              <p>July 12th, 2025 | 9:15 PM</p>
            </div>
            <div className={classes.redDot}></div>
          </div>
          <div className={classes.contentBox}>
            <div className={classes.notificationIconBox}>
              <Image
                alt="icon"
                src={notificationPic}
                width={0}
                height={0}
                style={{
                  height: "60%",
                  width: "60%",
                }}
              />
            </div>
            <div className={classes.notificationTextBox}>
              <p>
                Avni your class for 12/12/25 11:00 PM has been cancelled and
                rescheduled to 13/12/2025 at 12:00 PM
              </p>
              <p>July 12th, 2025 | 9:15 PM</p>
            </div>
            <div className={classes.redDot}></div>
          </div>
          <div className={classes.contentBox}>
            <div className={classes.notificationIconBox}>
              <Image
                alt="icon"
                src={notificationPic}
                width={0}
                height={0}
                style={{
                  height: "60%",
                  width: "60%",
                }}
              />
            </div>
            <div className={classes.notificationTextBox}>
              <p>
                Avni your class for 12/12/25 11:00 PM has been cancelled and
                rescheduled to 13/12/2025 at 12:00 PM
              </p>
              <p>July 12th, 2025 | 9:15 PM</p>
            </div>
            <div className={classes.redDot}></div>
          </div>
          <div className={classes.contentBox}>
            <div className={classes.notificationIconBox}>
              <Image
                alt="icon"
                src={notificationPic}
                width={0}
                height={0}
                style={{
                  height: "60%",
                  width: "60%",
                }}
              />
            </div>
            <div className={classes.notificationTextBox}>
              <p>
                Avni your class for 12/12/25 11:00 PM has been cancelled and
                rescheduled to 13/12/2025 at 12:00 PM
              </p>
              <p>July 12th, 2025 | 9:15 PM</p>
            </div>
            <div className={classes.redDot}></div>
          </div>
          <div className={classes.contentBox}>
            <div className={classes.notificationIconBox}>
              <Image
                alt="icon"
                src={notificationPic}
                width={0}
                height={0}
                style={{
                  height: "60%",
                  width: "60%",
                }}
              />
            </div>
            <div className={classes.notificationTextBox}>
              <p>
                Avni your class for 12/12/25 11:00 PM has been cancelled and
                rescheduled to 13/12/2025 at 12:00 PM
              </p>
              <p>July 12th, 2025 | 9:15 PM</p>
            </div>
            <div className={classes.redDot}></div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default memo(NotificationsModal);
