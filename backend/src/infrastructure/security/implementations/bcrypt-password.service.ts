import { IPasswordService } from "../interfaces/password-service.interface.js";
import bcrypt from "bcrypt";

export class BcryptPasswordService implements IPasswordService {
  private readonly saltRounds = 10;

  async hash(plainText: string): Promise<string> {
    return await bcrypt.hash(plainText, this.saltRounds);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}