/**
 * Firebase Configuration - Math RPG
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project (e.g., "math-rpg")
 * 3. Enable Authentication → Google sign-in
 * 4. Create Realtime Database → start in test mode
 * 5. Project Settings → Your apps → Add Web app
 * 6. Copy the config values below
 * 
 * IMPORTANT: Add your Google account to authorized domains in Firebase Console
 * (Authentication → Settings → Authorized domains)
 */
const FirebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Export for use in index.html
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FirebaseConfig;
}
