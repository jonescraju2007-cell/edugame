// config.js
// Detect backend URL automatically

let BACKEND_URL = "";

// If running locally, use localhost
if (window.location.hostname === "localhost") {
  BACKEND_URL = "http://localhost:3000";
} else {
  // Otherwise, use the Railway app URL
  BACKEND_URL = "https://edugame-production.up.railway.app";
}

export { BACKEND_URL };

