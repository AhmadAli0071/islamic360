import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyB8H4XNnWBAi1DIoc9GieF2D85KdZMRihQ",
  authDomain: "islamic360-87d75.firebaseapp.com",
  projectId: "islamic360-87d75",
  storageBucket: "islamic360-87d75.firebasestorage.app",
  messagingSenderId: "616701463239",
  appId: "1:616701463239:web:c81fcbb523531d7f04cce2",
  measurementId: "G-1Y4NL9MP1G"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export default app;
