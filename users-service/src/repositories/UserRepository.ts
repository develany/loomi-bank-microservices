import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/User';

export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async findById(id: string): Promise<User | null> {
        return this.findOne({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.findOne({ where: { email } });
    }

    async updateUser(id: string, data: Partial<User>): Promise<User | null> {
        await this.update(id, data);
        return this.findById(id);
    }

    async updateProfilePicture(id: string, profilePicture: string): Promise<User | null> {
        await this.update(id, { profilePicture });
        return this.findById(id);
    }
}