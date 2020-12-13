import { NextFunction, Request, Response } from "express/lib/express";
import { User } from "./model/User";

export const AuthenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization;
  if (authToken == null) return;

  const decodedToken = authToken.split(" ")[1];
  const authData = decodedToken.split(":");
  const uuid = authData[0];

  // const user = this.users.find(user => user.id == authData[0]);
  if (uuid == null) return;

  return {
    user: new User(uuid),
  };
};
