/* eslint-disable import/prefer-default-export */
import { NextFunction, Response as ExpressResponse, Request } from 'express';
import Response from '../lib/Response'; // Importa una clase Response personalizada
import AdministratorService from '../services/Administrator.service'; // Importa el servicio AdministratorService
import AuthService, { AuthRole } from '../services/Auth.service'; // Importa el servicio AuthService y el tipo AuthRole
import UserService from '../services/User.service'; // Importa el servicio UserService

// Middleware de autenticación
export const authMiddleware = (
  role: AuthRole | AuthRole[], // Especifica un rol o un conjunto de roles permitidos
  response: Response, // Instancia de la clase Response personalizada
  includeData: boolean = false, // Indica si se deben incluir datos adicionales en la solicitud
) => async (
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      // Si no se proporciona autorización, devuelve un error no autorizado
      return response.error(res, 'Unauthorized', 401);
    }
    const token = authorization.split(' ')[1];
    // Obtiene una instancia del servicio de autenticación
    const authService = await AuthService.getInstance();
    // Verifica y decodifica el token
    const payload = authService.verifyToken(token) as any;
    if (!payload) {
      // Si el token no es válido, devuelve un error no autorizado
      return response.error(res, 'Unauthorized', 401);
    }
    if (role === 'administrator' && payload.role === 'administrator') {
      if (includeData) {
        // Obtiene una instancia del servicio de administrador
        const administratorService = await AdministratorService.getInstance();
        // Obtiene los datos del administrador
        const administrator = await administratorService.getOne(payload.id);
        // Almacena los datos del administrador en la solicitud
        req.body.administrator = administrator;
      }
      return next();
    }

    if (role === 'user' && payload.role === 'user') {
      if (includeData) {
        // Obtiene una instancia del servicio de usuario
        const userService = await UserService.getInstance();
        // Obtiene los datos del usuario
        const user = await userService.getOne(payload.id);
        // Almacena los datos del usuario en la solicitud
        req.body.user = user;
      }
      return next();
    }

    if (Array.isArray(role)) {
      const isAuthorized = role.includes(payload.role);
      if (!isAuthorized) {
        // Si el rol no está autorizado, devuelve un error no autorizado
        return response.error(res, 'Unauthorized', 401);
      }
      await Promise.all(role.map(async (r) => {
        if (r === payload.role) {
          if (r === 'administrator' && includeData) {
            // Obtiene una instancia del servicio de administrador
            const administratorService = await AdministratorService.getInstance();
            // Obtiene los datos del administrador
            const administrator = await administratorService.getOne(payload.id);
            // Almacena los datos del administrador en la solicitud
            req.body.administrator = administrator;
          }
          if (r === 'user' && includeData) {
            const userService = await UserService.getInstance();
            const user = await userService.getOne(payload.id);
            req.body.user = user;
          }
        }
      }));
      return next();
    }
    // Si no se cumplen las condiciones anteriores, devuelve un error no autorizado
    return response.error(res, 'Unauthorized', 401);
  } catch (e) {
    console.error(e);
    response.error(res, 'Unauthorized', 401);
    return null;
  }
};
