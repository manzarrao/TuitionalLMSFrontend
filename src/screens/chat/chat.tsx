"use client";
import React, { FC, useEffect, useState } from "react";
import classes from "./chat.module.css";
import Left from "@/components/ui/superAdmin/chat/left/left";
import Right from "@/components/ui/superAdmin/chat/right/right";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getRooms } from "@/services/chat-rooms/rooms/rooms";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import { MyAxiosError } from "@/services/error.type";
import { EmptyState } from "@/components/ui/superAdmin/chat/right/components/emptyState/emptyState";
import { Room } from "@/types/rooms/getRooms.types";

const Chat: FC = () => {
  const { token } = useAppSelector((state) => state.user);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const { data, error, isLoading } = useQuery({
    queryKey: ["getRooms"],
    queryFn: () => getRooms({ userId: 6 }, { token }),
    staleTime: 60000,
    enabled: !!token,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (error) {
      const axiosError = error as MyAxiosError;
      if (axiosError.response) {
        toast.error(axiosError.response.data.error);
      } else {
        toast.error(axiosError.message);
      }
    }
  }, [error]);

  const room = (item: Room) => {
    setSelectedRoom(item);
    return;
  };
  return (
    <main className={classes.main}>
      <Left data={data} loading={isLoading} error={error} room={room} />
      {selectedRoom === null ? <EmptyState /> : <Right room={selectedRoom} />}
    </main>
  );
};

export default Chat;
