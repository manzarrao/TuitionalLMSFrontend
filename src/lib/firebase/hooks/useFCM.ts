import { useState, useEffect } from "react";
import { messaging } from "../index";
import { toast } from "react-toastify";
import { MessagePayload, onMessage } from "firebase/messaging";
import useFCMToken from "./useFCMToken";

const useFCM = () => {
  const fcmToken = useFCMToken();
  const [messages, setMessages] = useState<MessagePayload[]>([]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const fcmmessaging = messaging();
      const unsubscribe = onMessage(fcmmessaging, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload]);
        toast(payload.notification?.title + ": " + payload.notification?.body);
      });
      return () => unsubscribe();
    }
  }, [fcmToken]);
  return { fcmToken, messages };
};

export default useFCM;
