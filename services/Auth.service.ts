/* eslint-disable class-methods-use-this */
import bcrypt from 'bcrypt'; // Importa la librería bcrypt para el hashing de contraseñas
import jwt from 'jsonwebtoken'; // Importa la librería jsonwebtoken para la generación y verificación de tokens
import { getRepository, Repository } from 'typeorm'; // Importa funciones para trabajar con la base de datos utilizando TypeORM
import Auth from '../entities/Auth.entity'; // Importa la entidad Auth
import env from '../utils/Config'; // Importa la configuración del entorno

// Define un tipo para los roles de autenticación
export type AuthRole = 'administrator' | 'user';
class AuthService {
  private static authServiceInstance: AuthService; // Instancia estática de AuthService

  private authRepository: Repository<Auth>; // Repositorio para la entidad Auth

  static async getInstance() {
    if (!AuthService.authServiceInstance) {
      // Si no existe una instancia de AuthService, crea una nueva
      AuthService.authServiceInstance = new AuthService();
      AuthService.authServiceInstance.authRepository = getRepository(Auth);
    }
    // Devuelve la instancia de AuthService
    return AuthService.authServiceInstance;
  }

  verifyToken(token: string) {
    // Verifica y decodifica un token utilizando la clave secreta del entorno
    return jwt.verify(token, env.api.secret);
  }

  generateToken(id: string, role: AuthRole): string {
    return jwt.sign(
      {
        id,
        role,
      },
      env.api.secret,
    ); // Genera un token JWT con la información de identificación y rol
  }

  async userLogin(email: string, password: string) {
    const auth = await this.authRepository.findOne({
      where: {
        user: {
          email,
        },
      },
      relations: ['user'],
    });
    if (!auth) {
      throw new Error('Credentials are not valid');
    }
    const isPasswordValid = await bcrypt.compare(password, auth.password);
    if (!isPasswordValid) {
      throw new Error('Credentials are not valid');
    }
    const token = this.generateToken(auth.user.uuid, 'user');
    return token;
  }

  async adminLogin(email: string, password: string) {
    const auth = await this.authRepository.findOne({
      where: {
        administrator: {
          email,
        },
      },
      relations: ['administrator'],
    });
    if (!auth) {
      throw new Error('Credentials are not valid');
    }
    // Compara la contraseña proporcionada con la contraseña almacenada
    const isPasswordValid = await bcrypt.compare(password, auth.password);
    if (!isPasswordValid) {
      throw new Error('Credentials are not valid');
    }
    // Genera un token para un usuario
    const token = this.generateToken(auth.administrator.id.toString(), 'administrator');
    return token;
  }
}

export default AuthService;
