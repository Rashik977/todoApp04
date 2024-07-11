import { getUserQuery, User } from "../interfaces/User";
import * as UserModel from "../model/user";
import bcrypt from "bcrypt";
import { Roles } from "../constants/Roles";
import { permissions } from "../constants/Permissions";
import { BadRequestError, NotFoundError } from "../error/Error";

export const getUsers = (query: getUserQuery) => {
  const users = UserModel.getUsers(query);

  if (!users) throw new NotFoundError("No users found");

  return users;
};

export async function createUser(user: User) {
  const existingUser = await getUserByEmail(user.email);
  if (existingUser) {
    throw new BadRequestError("User already exists");
  }
  const password = await bcrypt.hash(user.password, 10);
  user.password = password;
  user.role = Roles.USER;
  user.permissions = permissions[Roles.USER];
  UserModel.createUser(user);
  return user;
}

export function getUserByEmail(email: string) {
  return UserModel.getUserByEmail(email);
}

// function to update a users
export const updateUsers = async (id: number, users: User) => {
  const usersIndex = UserModel.findUserIndexById(id);

  // Check if users exists
  if (usersIndex === -1) throw new NotFoundError("users not found");

  const password = await bcrypt.hash(users.password, 10);
  users.password = password;

  UserModel.updateUser(id, users, usersIndex);

  return { message: "users updated" };
};

// function to delete a users
export const deleteUsers = (id: number) => {
  const usersIndex = UserModel.findUserIndexById(id);

  // Check if users exists
  if (usersIndex === -1) throw new NotFoundError("users not found");

  // Delete users from userss array
  UserModel.deleteUser(usersIndex);

  return { message: "users deleted" };
};
