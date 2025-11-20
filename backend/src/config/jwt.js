import jwt from "jsonwebtoken";

const SECRET = "desafio_soulCode";

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "30d" });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
