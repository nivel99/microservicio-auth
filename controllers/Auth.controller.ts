import express from 'express';

import Console from '../lib/Console';
import Response from '../lib/Response';
import AuthService from '../services/Auth.service';

const router = express.Router();

const apiConsole = new Console('AUTH-CONTROLLER');
const response = new Response();

/**
 * Ruta para el inicio de sesión de usuario.
 * @api {POST}/auth/user Login user
 * @apiName loginUser
 * @apiGroup Auth
 * @apiPermission any
 */
router.post('/user', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Verificar si se proporcionaron el email y la contraseña.
    if (!email || !password) {
      return response.error(res, 'Email and password are required');
    }
    // Obtener una instancia del servicio de autenticación.
    const authService = await AuthService.getInstance();
    // Intentar realizar el inicio de sesión del usuario.
    const token = await authService.userLogin(email, password);
    // Establecer el token como una cookie en la respuesta.
    res.cookie('token', token);
    // Enviar una respuesta exitosa con el token.
    return response.success(res, token);
  } catch (error) {
    apiConsole.error((error as Error)?.message);
    return response.error(res, (error as Error)?.message);
  }
});

/**
 * Ruta para el inicio de sesión de administrador.
 * @api {POST}/auth/user Login administrator
 * @apiName loginUser
 * @apiGroup Auth
 * @apiPermission any
 */
router.post('/administrator', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Verificar si se proporcionaron el email y la contraseña.
    if (!email || !password) {
      return response.error(res, 'Email and password are required');
    }
    // Obtener una instancia del servicio de autenticación.
    const authService = await AuthService.getInstance();
    // Intentar realizar el inicio de sesión del administrador.
    const token = await authService.adminLogin(email, password);
    // Establecer el token como una cookie en la respuesta.
    res.cookie('token', token);
    // Enviar una respuesta exitosa con el token.
    return response.success(res, token);
  } catch (error) {
    // En caso de error, registrar el error en la consola y enviar una respuesta de error.
    apiConsole.error((error as Error)?.message);
    return response.error(res, (error as Error)?.message);
  }
});

export default router;
