import jwt from "jsonwebtoken";
export const deleteAuthorizationCookie = (res) => {
  res.clearCookie("token");
};
export const getAuthorizationToken = (req) => {
  return req.cookies.token;
};
export const isAuthorizationTokenValid = (token) => {
  try {
    const verification = jwt.verify(token, process.env.JWT_SECRET);
    return verification.userId;
  } catch (error) {
    return false;
  }
};
export const generateAndSetAuthorizationCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};
