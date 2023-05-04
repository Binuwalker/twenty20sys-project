import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'; 
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD0IWqGgh35KpIcorkxD8j7gv28sAGnAHY",
  authDomain: "twentytwenty-65acd.firebaseapp.com",
  projectId: "twentytwenty-65acd",
  storageBucket: "twentytwenty-65acd.appspot.com",
  messagingSenderId: "395039107830",
  appId: "1:395039107830:web:f6bfd8b2117e30794b1ad7"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const firebasedb = getFirestore()
