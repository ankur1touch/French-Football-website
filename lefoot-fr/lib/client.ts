import axios from "axios";

// Use relative URLs in the browser so API calls always hit the same
// origin as the page (avoids hangs when dev runs on 3001/3002 but
// NEXT_PUBLIC_SITE_URL points to 3000).
const axiosClient = axios.create({
  baseURL: typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_SITE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
