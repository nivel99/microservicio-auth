/* eslint-disable import/prefer-default-export */
import { NextFunction, Request, Response as ExpressResponse } from 'express';
import { AnyObjectSchema } from 'yup';

import Response from '../lib/Response';

// Middleware de validación que toma un esquema Yup y un objeto de respuesta personalizado.
export const validationMiddleware = (schema: AnyObjectSchema, response: Response) => async (
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    // Valida el cuerpo de la solicitud utilizando el esquema Yup proporcionado.
    await schema.validate({
      body: req.body,
    });

    // Si la validación es exitosa, pasa al siguiente middleware o controlador.
    next();
    return;
  } catch (error) {
    // En caso de error de validación, registra el mensaje de error en la consola.
    console.error((error as Error)?.message);

    // Utiliza el objeto de respuesta personalizado para enviar una respuesta de error con el mensaje.
    response.error(res, (error as Error)?.message, 400);
  }
};
