import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import SocketManager from "@/utils/socket/socket";
import { chatKeys } from "@/services/chat/chat.hooks";
import { MessageData } from "@/types/chat/messages.types";

interface UseSocketProps {
  userId: number;
  token?: string;
  roomId?: number;
  enabled?: boolean;
  sender_id?: number;
}

export const useSocket = ({
  userId,
  token,
  roomId,
  enabled = true,
  sender_id,
}: UseSocketProps) => {
  const queryClient = useQueryClient();
  const socketManager = useRef<SocketManager>(SocketManager.getInstance());
  const currentRoomId = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !userId) return;

    // Connect to socket
    const socket = socketManager.current.connect(userId, token);
    console.log("Socket connected:", socket.id);
    console.log(
      "Socket connection status:",
      socketManager.current.isConnected()
    );
    // Join room if roomId is provided
    if (roomId && roomId !== currentRoomId.current) {
      // Leave previous room if exists
      if (currentRoomId.current) {
        socketManager.current.leaveRoom(currentRoomId.current);
      }

      // Join new room
      socketManager.current.joinRoom(roomId);
      currentRoomId.current = roomId;
    }

    // Set up event listeners
    const handleNewMessage = (data: any) => {
      console.log("handleNewMessage triggered with data:", data);
      console.log("Current room ID:", roomId);
      console.log("Message room ID:", data.room_id || data.roomId);

      let messageData: Partial<MessageData> = data;

      // Transform incoming data if necessary
      console.log("Transforming message data to match MessageData interface");
      messageData = {
        ...data,
        room_id: data?.room_id || roomId,
        message_content: data.message || data.message_content,
        id: data.id || Date.now(),
        sender_id: data.sender_id || userId,
        message_type: data.messageType || data.message_type || "text",
        createdAt: data.createdAt || new Date().toISOString(),
        sender: data.sender || { id: userId, name: "You" },
        reactions: data.reactions || [],
        views: data.views || [],
        replied_to_id: data.replied_to_id || data.repliedToId,
        repliedToMessage: data.repliedToMessage || undefined,
        // Ensure mediaUrl is correctly set
        media_url: data.mediaUrl || data.media_url || undefined,
      };
      console.log("Transformed message data:", messageData);

      console.log(
        "Attempting to update cache for roomId:",
        messageData.room_id || roomId
      );

      queryClient.setQueryData(["roomMessages", roomId], (oldData: any) => {
        console.log("Old data in cache:", oldData);

        // Ensure consistent structure: { data: [...] }
        if (oldData && !Array.isArray(oldData)) {
          console.log("Initializing cache with new message.");
          const updatedData = [...(oldData || []), messageData];
          console.log("Updated cache with new message:1", updatedData);
          return updatedData;
        }

        // const messageExists = oldData.some(
        //   (msg: MessageData) => msg.id === messageData.id
        // );
        // if (messageExists) {
        //   console.log("Message already exists in cache:", messageData);
        //   return oldData; // Return existing cache without changes
        // }

        // Add new message to the cache
        const updatedData = [...oldData, messageData] as MessageData[];
        console.log("Updated cache with new message:2", updatedData);
        return updatedData; // Return the updated structure
      });

      console.log(
        "Invalidating query for room:",
        messageData.room_id || roomId
      );
      // queryClient.invalidateQueries({
      //   queryKey: ["roomMessages", roomId],
      // });
    };

    const handleMessageUpdate = (data: MessageData) => {
      console.log("Message updated:", data);

      // Update the specific message in cache
      queryClient.setQueryData(
        chatKeys.messagesForRoom(data.room_id || roomId!),
        (oldData: any) => {
          if (!oldData?.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((msg: MessageData) =>
              msg.id === data.id ? { ...msg, ...data } : msg
            ),
          };
        }
      );
    };

    const handleMessageDelete = (data: {
      messageId: number;
      roomId: number;
    }) => {
      console.log("Message deleted:", data);

      // Remove message from cache
      queryClient.setQueryData(
        chatKeys.messagesForRoom(data.roomId),
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter(
              (msg: MessageData) => msg.id !== data.messageId
            ),
          };
        }
      );
    };

    const handleReactionAdded = (data: {
      messageId: number;
      reaction: any;
      roomId: number;
    }) => {
      console.log("Reaction added:", data);

      // Update message reactions in cache
      queryClient.setQueryData(
        chatKeys.messagesForRoom(data.roomId),
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return oldData.data.map((msg: MessageData) =>
            msg.id === data.messageId
              ? {
                  ...msg,
                  reactions: [...(msg.reactions || []), data.reaction],
                }
              : msg
          );
        }
      );

      // Invalidate reactions query
      queryClient.invalidateQueries({
        queryKey: chatKeys.reactionsForMessage(data.messageId),
      });
    };

    const handleReactionRemoved = (data: {
      messageId: number;
      userId: number;
      roomId: number;
    }) => {
      console.log("Reaction removed:", data);

      // Remove reaction from cache
      queryClient.setQueryData(
        chatKeys.messagesForRoom(data.roomId),
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((msg: MessageData) =>
              msg.id === data.messageId
                ? {
                    ...msg,
                    reactions:
                      msg.reactions?.filter(
                        (reaction) => reaction.user.id !== data.userId
                      ) || [],
                  }
                : msg
            ),
          };
        }
      );

      // Invalidate reactions query
      queryClient.invalidateQueries({
        queryKey: chatKeys.reactionsForMessage(data.messageId),
      });
    };

    // Register event listeners
    socketManager.current.onNewMessage(handleNewMessage);
    socketManager.current.onMessageUpdate(handleMessageUpdate);
    socketManager.current.onMessageDelete(handleMessageDelete);
    socketManager.current.onReactionAdded(handleReactionAdded);
    socketManager.current.onReactionRemoved(handleReactionRemoved);

    // Cleanup function
    return () => {
      // Remove event listeners
      socketManager.current.removeListeners("new_message");
      socketManager.current.removeListeners("message_updated");
      socketManager.current.removeListeners("message_deleted");
      socketManager.current.removeListeners("reaction_added");
      socketManager.current.removeListeners("reaction_removed");

      // Leave room if exists
      if (currentRoomId.current) {
        socketManager.current.leaveRoom(currentRoomId.current);
        currentRoomId.current = null;
      }
    };
  }, [userId, token, roomId, enabled, queryClient]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      socketManager.current.disconnect();
    };
  }, []);

  return {
    socket: socketManager.current.getSocket(),
    isConnected: socketManager.current.isConnected(),
    sendMessage: (data: {
      room_id: number;
      message: string;
      messageType?: string;
      replied_to_id?: number;
      mediaUrl?: string;
      sender_id: number;
      repliedToMessage?: MessageData;
      reactions?: any[];
      views?: any[];
    }) => socketManager.current.sendMessage(data),
    emitTyping: (roomId: number) => socketManager.current.emitTyping(roomId),
    emitStoppedTyping: (roomId: number) =>
      socketManager.current.emitStoppedTyping(roomId),
    joinRoom: (roomId: number) => socketManager.current.joinRoom(roomId),
    leaveRoom: (roomId: number) => socketManager.current.leaveRoom(roomId),
  };
};
