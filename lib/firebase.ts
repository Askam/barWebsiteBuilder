import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { type Auth } from "firebase/auth";
import { type Firestore } from "firebase/firestore";
import { type FirebaseStorage } from "firebase/storage";

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

function getApp(): FirebaseApp {
  if (_app) return _app;
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  _app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
  return _app;
}

export function getAuthInstance(): Auth {
  if (_auth) return _auth;
  const { getAuth } = require("firebase/auth");
  _auth = getAuth(getApp());
  return _auth!;
}

export function getDbInstance(): Firestore {
  if (_db) return _db;
  const { getFirestore } = require("firebase/firestore");
  _db = getFirestore(getApp());
  return _db!;
}

export function getStorageInstance(): FirebaseStorage {
  if (_storage) return _storage;
  const { getStorage } = require("firebase/storage");
  _storage = getStorage(getApp());
  return _storage!;
}

export { getApp };
