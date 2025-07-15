import React, { useCallback, useState } from "react";
import classes from "./notificationBox.module.css";
import Image from "next/image";
import { Box } from "@mui/material";
import { toast } from "react-toastify";
import { MyAxiosError } from "@/services/error.type";
import { useMutation } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import { User_Type } from "@/services/auth/auth.types";
import { googleChatNotifications } from "@/services/dashboard/superAdmin/messages/messages";
import { GoogleChatNotification_Payload_Type } from "@/types/messages/google-chat-notifications.type";
import NotificationsModal from "@/components/global/notifications-modal/notifications-modal";
import LoadingBox from "@/components/global/loading-box/loading-box";

const NotificationBox: React.FC = () => {
  const { token, user } = useAppSelector((state: any) => state?.user);
  const [notificationsModal, setNotificationsModal] = useState(false);

  // const handleNotificationsModalOpen = useCallback(() => {
  //   // new Notification("ajksgdhg", {
  //   //   body: "test",
  //   // });
  //   setNotificationsModal(true);
  // }, []);

  const handleGoogleChatNotifications = useMutation({
    mutationFn: (payload: GoogleChatNotification_Payload_Type) =>
      googleChatNotifications(
        {
          token,
        },
        payload
      ),
    onSuccess: (data: any) => {
      if (data.message) {
        toast.success(data.message);
      } else if (data.error) {
        return toast.error(data.error);
      }

      toast.success("OK");
    },
    onError: (error) => {
      const axiosError = error as MyAxiosError;
      if (axiosError?.response) {
        toast.error(
          axiosError?.response?.data?.message
            ? `${axiosError?.response?.data?.message}`
            : axiosError?.response?.data?.error
            ? `${axiosError?.response?.data?.error}`
            : `${axiosError?.response?.status} ${axiosError?.response?.statusText}`
        );
      } else {
        toast.error(axiosError.message);
      }
    },
  });

  const handleNotificationsModalClose = useCallback(() => {
    setNotificationsModal(false);
  }, []);

  return (
    <>
      <div className={classes.mainConatiner}>
        <Box className={classes.notBox}>
          <div
            className={classes.notificationsIcon}
            onClick={() =>
              handleGoogleChatNotifications.mutate({
                type: "MESSAGE",
                message: {
                  sender: {
                    displayName: user?.name || "",
                    email: user?.email || "",
                  },
                  text: "Hello there!",
                },
              })
            }
          >
            {handleGoogleChatNotifications?.isPending ? (
              <LoadingBox
                loaderStyling={{
                  width: "50% !important",
                  height: "50% !important",
                }}
              />
            ) : (
              <Image
                src={"/assets/svgs/notificationIcon.svg"}
                alt={(user as User_Type)?.name || ""}
                width={0}
                height={0}
                style={{
                  width: "50%",
                  height: "50%",
                }}
              />
            )}{" "}
          </div>
          <div className={classes.number}>
            <p>0</p>
          </div>
        </Box>
        <div className={classes.line}></div>
        <Box className={classes.picContainer}>
          <div className={classes.picBox}>
            <Image
              src={
                (user as User_Type)?.profileImageUrl ||
                "/assets/images/demmyPic.png"
              }
              alt={(user as User_Type)?.name || ""}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Box>
      </div>
      <NotificationsModal
        modalOpen={notificationsModal}
        handleClose={handleNotificationsModalClose}
      />
    </>
  );
};

export default NotificationBox;
