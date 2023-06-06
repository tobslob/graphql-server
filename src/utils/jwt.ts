import config from "config";
import Jwt from "jsonwebtoken";

const publicKey = Buffer.from(
  config.get<string>("publicKey"),
  "base64"
).toString("ascii");

const privateKey = Buffer.from(
  config.get<string>("privateKey"),
  "base64"
).toString("ascii");

export function signJwt(object: Object, options?: Jwt.SignOptions | undefined) {
  return Jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
    allowInsecureKeySizes: true,
  });
}

export function verifyJwt<T>(token: string): T | null {
  try {
    return Jwt.verify(token, publicKey) as T;
  } catch (e) {
    return null;
  }
}
