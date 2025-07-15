import React, { FC } from "react";
import classes from "./userCard.module.css";
import Image from "next/image";
import { Room } from "@/types/rooms/getRooms.types";
import moment from "moment";

const UserCard: FC<{ item: Room; room: (item: Room) => void }> = ({
  item,
  room,
}) => {
  return (
    <div
      className={classes.container}
      onClick={() => {
        if (item) {
          room(item);
        }
      }}
    >
      <span className={classes.imageBox}>
        <Image
          src={"/assets/images/demmyPic.png"}
          alt={"User"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </span>
      <div className={classes.contentBox}>
        <div>
          <p>
            {item?.room_name.split("|")[0].split("-")[0] +
              "|" +
              item?.room_name.split("|")[item?.room_name.split("|").length - 1]}
          </p>
          <p>
            {(() => {
              const date = item?.lastMessage?.createdAt;
              if (!date) return "";
              const momentDate = moment.utc(date);
              return momentDate.isValid()
                ? momentDate.local().format("HH:mm A")
                : "";
            })()}
          </p>
        </div>
        {item?.lastMessage && (
          <div>
            <p>{item?.lastMessage.message_content || ""}</p>
            <span className={classes.newChatSign}> </span>{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
