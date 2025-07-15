import React, { useCallback } from "react";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import Image from "next/image";
import ReplyIcon from "@mui/icons-material/Reply";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ForumIcon from "@mui/icons-material/Forum";
import VisibilityIcon from "@mui/icons-material/Visibility";
import classes from "./messageItem.module.css";
import { MessageData } from "@/types/chat/messages.types";

interface MessageItemProps {
  message: MessageData;
  currentUserId: number;
  onMessageSelect: (message: MessageData, element: HTMLElement) => void;
  onReply: (message: MessageData) => void;
  onShowReactions: (message: MessageData) => void;
  onShowViewers: (message: MessageData) => void;
}

function renderMedia(
  url: string,
  className?: string,
  size: { width?: number; height?: number } = {}
) {
  // Extract file extension
  const ext = url.split(".").pop()?.split("?")[0]?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {
    return (
      <Image
        src={url}
        alt="Media"
        width={size.width || 200}
        height={size.height || 150}
        style={{ objectFit: "cover" }}
        className={className}
      />
    );
  }
  if (["mp4", "webm", "ogg", "mov"].includes(ext)) {
    return (
      <video
        controls
        width={size.width || 200}
        height={size.height || 150}
        className={className}
        style={{ objectFit: "cover" }}
      >
        <source src={url} type={`video/${ext}`} />
        Your browser does not support the video tag.
      </video>
    );
  }
  if (["mp3", "wav", "ogg", "aac"].includes(ext)) {
    return (
      <audio controls className={className}>
        <source src={url} type={`audio/${ext}`} />
        Your browser does not support the audio tag.
      </audio>
    );
  }
  if (ext === "pdf") {
    return (
      <embed
        src={url}
        type="application/pdf"
        width={size.width || 200}
        height={size.height || 150}
        className={className}
      />
    );
  }
  // Default: show download link
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      Download File
    </a>
  );
}

export const MessageItem: React.FC<MessageItemProps> = React.memo(
  ({
    message,
    currentUserId,
    onMessageSelect,
    onReply,
    onShowReactions,
    onShowViewers,
  }) => {
    const isOwnMessage = message?.sender_id === currentUserId;

    const handleMessageClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        const element = e.currentTarget;
        onMessageSelect(message, element);
      },
      [message, onMessageSelect]
    );

    const handleReply = useCallback(() => {
      onReply(message);
    }, [message, onReply]);

    const handleShowReactions = useCallback(() => {
      onShowReactions(message);
    }, [message, onShowReactions]);

    const handleShowViewers = useCallback(() => {
      onShowViewers(message);
    }, [message, onShowViewers]);

    const formatTime = (dateString: string) => {
      return new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <div
        className={`${classes.messageWrapper} ${
          isOwnMessage ? classes.ownMessage : ""
        }`}
      >
        {!isOwnMessage && (
          <Avatar
            src={message.sender.profileImageUrl}
            alt={message.sender.name}
            className={classes.messageAvatar}
          />
        )}

        <div className={classes.messageContent}>
          {/* Replied Message Display */}
          {message.repliedToMessage && (
            <div className={classes.repliedMessage}>
              <div className={classes.repliedMessageContent}>
                <span className={classes.repliedMessageSender}>
                  {message.repliedToMessage.sender?.name || "Unknown"}
                </span>
                <p className={classes.repliedMessageText}>
                  {message.repliedToMessage.message_content}
                </p>
                {message.repliedToMessage.media_url && (
                  <div className={classes.repliedMessageMedia}>
                    {renderMedia(
                      message.repliedToMessage.media_url,
                      classes.mediaImage,
                      { width: 50, height: 50 }
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Message Bubble */}
          <div
            className={`${classes.messageBubble} ${
              isOwnMessage ? classes.ownBubble : ""
            }`}
            onClick={handleMessageClick}
            id={`msg-${message.id}`}
          >
            <div className={classes.messageHeader}>
              {!isOwnMessage && (
                <span className={classes.messageSender}>
                  {message.sender.name}
                </span>
              )}
              <span className={classes.messageTime}>
                {formatTime(message.createdAt)}
              </span>
            </div>

            <p className={classes.messageText}>
              <div
                dangerouslySetInnerHTML={{ __html: message.message_content }}
              ></div>
            </p>

            {/* Media Display */}
            {message.media_url && (
              <div className={classes.messageMedia}>
                {renderMedia(message.media_url, classes.mediaImage)}
              </div>
            )}

            {/* Reactions Display */}
            {message?.reactions?.length > 0 && (
              <div className={classes.reactionsContainer}>
                {message.reactions.map((reaction, index) => (
                  <Tooltip
                    key={index}
                    title={`${reaction.user.name}: ${reaction.reaction_type}`}
                  >
                    <span className={classes.reaction}>
                      {reaction.reaction_type}
                    </span>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>

          {/* Message Actions */}
          <div className={classes.messageActions}>
            <Tooltip title="Add reaction">
              <IconButton
                size="small"
                onClick={handleShowReactions}
                className={classes.actionButton}
              >
                <InsertEmoticonIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Reply">
              <IconButton
                size="small"
                onClick={handleReply}
                className={classes.actionButton}
              >
                <ReplyIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* <Tooltip title="Open thread">
              <IconButton
                size="small"
                onClick={handleOpenThread}
                className={classes.actionButton}
              >
                <ForumIcon fontSize="small" />
              </IconButton>
            </Tooltip> */}

            <Tooltip title="View readers">
              <IconButton
                size="small"
                onClick={handleShowViewers}
                className={classes.actionButton}
              >
                <VisibilityIcon fontSize="small" />
                {message?.views?.length > 0 && (
                  <span className={classes.viewCount}>
                    {message.views.length}
                  </span>
                )}
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
);

MessageItem.displayName = "MessageItem";
