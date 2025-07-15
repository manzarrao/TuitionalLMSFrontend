importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyBV5yq-wNjDBr6mxgLKoh5g6pxFSmhIOuU",
  authDomain: "tuitional-ai.firebaseapp.com",
  projectId: "tuitional-ai",
  storageBucket: "tuitional-ai.appspot.com",
  messagingSenderId: "471214477690",
  appId: "1:471214477690:web:8b97eb01740586fc9086c3",
  measurementId: "G-QKD913QPV6",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
