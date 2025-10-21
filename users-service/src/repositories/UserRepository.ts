import { Repository, DataSource } from "typeorm";
import { User } from "../entities/User";
import { IUserRepository } from "../interfaces/IUserRepository";

export class UserRepository
  extends Repository<User>
  implements IUserRepository
{
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<User | null> {
    return this.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<[User[], number]> {
    return this.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    await this.update(id, data);
    return this.findById(id);
  }

  async updateProfilePicture(
    id: string,
    profilePicture: string
  ): Promise<User | null> {
    await this.update(id, { profilePicture });
    return this.findById(id);
  }
}
