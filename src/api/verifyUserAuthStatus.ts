import { getCMSInstance } from "cloakwp";

export async function verifyUserAuthStatus(req, res) {
  const wp = getCMSInstance().client();
  const wpCookie = req.headers.cookie || ""; // Get the WordPress cookies from the client-side request

  wp.setHeaders("Cookie", wpCookie); // include cookies in `isLoggedIn` request we make below
  const isLoggedIn = await wp.isLoggedIn();

  res.json(isLoggedIn);
}
