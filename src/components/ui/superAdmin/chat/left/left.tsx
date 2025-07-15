import React, { FC } from "react";
import classes from "./left.module.css";
import SearchBox from "@/components/global/search-box/search-box";
import Button from "@/components/global/button/button";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Room, Rooms_Api_Response_Type } from "@/types/rooms/getRooms.types";
import UserCard from "./userCard/userCard";
import ErrorBox from "@/components/global/error-box/error-box";

interface LeftProps {
  data?: Rooms_Api_Response_Type;
  loading: boolean;
  error: any;
  room: (item: Room) => void;
}

const Left: FC<LeftProps> = ({ data, loading, error, room }) => {
  return (
    <div className={classes.container}>
      <div className={classes.searchContainer}>
        <SearchBox
          inlineStyles={{ width: "100%" }}
          placeholder="Search any chat"
        />
      </div>
      <div className={classes.usersContainer}>
        {data && data?.length === 0 ? (
          <ErrorBox inlineStyling={{ flex: 1 }} />
        ) : (
          data?.map((item) => (
            <UserCard item={item} room={room} key={item.id} />
          ))
        )}
      </div>
      <div className={classes.newChatContainer}>
        <Button
          text={"Start New Chat"}
          inlineStyling={{ width: "100%" }}
          icon={<AddOutlinedIcon />}
        />
      </div>
    </div>
  );
};

export default Left;
