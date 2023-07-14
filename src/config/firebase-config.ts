// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCi0D-Xdh7YkM_SO-i77Dw1KGB--6_Spj0",
  authDomain: "react-shop-engine.firebaseapp.com",
  projectId: "react-shop-engine",
  storageBucket: "react-shop-engine.appspot.com",
  messagingSenderId: "912544228299",
  appId: "1:912544228299:web:535c9a0fba1fd71d4dcc4e"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);

export default appFirebase;