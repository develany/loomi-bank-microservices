import { User } from "../entities/User";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll?(page?: number, limit?: number): Promise<[User[], number]>;
  updateUser(id: string, data: Partial<User>): Promise<User | null>;
  updateProfilePicture(
    id: string,
    profilePicture: string
  ): Promise<User | null>;
}
