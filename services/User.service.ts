import bcrypt from 'bcrypt'; // Importa la librería bcrypt para el hashing de contraseñas
import { getRepository, Repository } from 'typeorm'; // Importa funciones para trabajar con la base de datos utilizando TypeORM
import User from '../entities/User.entity'; // Importa la entidad User

class UserService {
  private static userServiceInstance: UserService; // Instancia estática de UserService

  private userRepository: Repository<User>; // Repositorio para la entidad User

  static async getInstance() {
    if (!UserService.userServiceInstance) {
      // Si no existe una instancia de UserService, crea una nueva
      UserService.userServiceInstance = new UserService();
      UserService.userServiceInstance.userRepository = getRepository(User);
    }
    return UserService.userServiceInstance; // Devuelve la instancia de UserService
  }

  async getAll(): Promise<User[]> {
    return this.userRepository.find({
      
    });
  }

  async getOne(uuid: string): Promise<User> {
    const user = await this.userRepository.findOne({
      
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async create(
    name: string,
    lastName: string,
    email: string,
    phone: string,
    organization: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10); // Genera un hash de la contraseña
    const user = this.userRepository.create({
      email,
      name,
      lastName,
      phone,
      organization,
      auth: {
        password: hashedPassword, // Asigna la contraseña hasheada a la entidad User
      },
    });
    return this.userRepository.save(user); // Guarda el nuevo usuario en la base de datos
  }

  async update(
    uuid: string,
    email?: string,
    name?: string,
    lastName?: string,
    phone?: string,
    organization?: string,
    password?: string,
  ): Promise<User> {
    if (!email && !name && !lastName && !phone && !organization && !password) {
      throw new Error('Nothing to update');
    }

    const user = await this.getOne(uuid);

    if (!user) {
      throw new Error('User not found');
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.auth.password = hashedPassword; // Actualiza la contraseña si se proporciona
    }

    user.name = name || user.name;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.organization = organization || user.organization;

    return this.userRepository.save(user); // Guarda los cambios en la entidad User
  }

  async delete(uuid: string): Promise<User> {
    const user = await this.getOne(uuid);
    if (!user) {
      throw new Error('User not found');
    }
    return this.userRepository.remove(user); // Elimina el usuario de la base de datos
  }
}

export default UserService; // Exporta la clase UserService
