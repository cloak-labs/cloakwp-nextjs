import { getCMSInstanceAsync } from "cloakwp/cms";

export async function verifyUserAuthStatus(req, res) {
  const wp = await getCMSInstanceAsync();
  const wpClient = wp.client();
  const wpCookie = req.headers.cookie || ""; // Get the WordPress cookies from the client-side request

  wpClient.setHeaders("Cookie", wpCookie); // include cookies in `isLoggedIn` request we make below
  const isLoggedIn = await wpClient.isLoggedIn();

  res.json(isLoggedIn);
}
