/* eslint-disable max-len */
import bcrypt from 'bcrypt';
import { getRepository, Repository } from 'typeorm';
import Administrator from '../entities/Administrator.entity';

class AdministratorService {
  private static administratorServiceInstance: AdministratorService;

  private administratorRepository: Repository<Administrator>;

  // Obtener una instancia única del servicio de administradores.
  static async getInstance() {
    if (!AdministratorService.administratorServiceInstance) {
      AdministratorService.administratorServiceInstance = new AdministratorService();
      AdministratorService.administratorServiceInstance.administratorRepository = getRepository(
        Administrator,
      );
    }
    return AdministratorService.administratorServiceInstance;
  }

  // Obtener todos los administradores con relaciones a autenticación y cursos.
  async getAll(): Promise<Administrator[]> {
    return this.administratorRepository.find({
      
    });
  }

  // Obtener un administrador por su ID con relaciones a autenticación y cursos.
  async getOne(id: number): Promise<Administrator> {
    const administrator = await this.administratorRepository.findOne({
      
    });
    if (!administrator) {
      throw new Error('Administrator not found');
    }
    return administrator;
  }

  // Crear un nuevo administrador con nombre, apellido, email y contraseña.
  async create(
    name: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<Administrator> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const administrator = this.administratorRepository.create({
      name,
      lastName,
      email,
      auth: {
        password: hashedPassword,
      },
    });
    return this.administratorRepository.save(administrator);
  }

  // Actualizar un administrador por su ID con nombre, apellido, email o contraseña.
  async update(
    id: number,
    name?: string,
    lastName?: string,
    email?: string,
    password?: string,
  ): Promise<Administrator> {
    if (!name && !lastName && !email && !password) {
      throw new Error('No data to update');
    }

    const administrator = await this.getOne(id);

    if (!administrator) {
      throw new Error('Administrator not found');
    }
    administrator.name = name || administrator.name;
    administrator.lastName = lastName || administrator.lastName;
    administrator.email = email || administrator.email;
    administrator.auth.password = password || administrator.auth.password;
    return this.administratorRepository.save(administrator);
  }

  // Eliminar un administrador por su ID.
  async delete(id: number): Promise<Administrator> {
    const administrator = await this.getOne(id);
    if (!administrator) {
      throw new Error('Administrator not found');
    }
    return this.administratorRepository.remove(administrator);
  }
}

export default AdministratorService;
