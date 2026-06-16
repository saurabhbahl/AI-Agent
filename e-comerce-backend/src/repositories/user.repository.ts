import { FilterQuery, UpdateQuery } from 'mongoose';
import { User, IUser } from '../models/User.model';

export class UserRepository {
  async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async findByEmail(email: string, includePassword = false): Promise<IUser | null> {
    const query = User.findOne({ email: email.toLowerCase() });
    if (includePassword) query.select('+password');
    return query;
  }

  async findAll(
    filter: FilterQuery<IUser>,
    skip: number,
    limit: number,
  ): Promise<{ users: IUser[]; total: number }> {
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);
    return { users, total };
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    return User.create(data);
  }

  async updateById(id: string, data: UpdateQuery<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteById(id: string): Promise<IUser | null> {
    return User.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<IUser> = {}): Promise<number> {
    return User.countDocuments(filter);
  }

  async findByRefreshToken(hashedToken: string): Promise<IUser | null> {
    return User.findOne({
      'refreshTokens.token': hashedToken,
      'refreshTokens.expiresAt': { $gt: new Date() },
    });
  }
}

export const userRepository = new UserRepository();
