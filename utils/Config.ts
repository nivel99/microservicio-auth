import dotenv from 'dotenv'; // Importa la librería dotenv para la configuración de variables de entorno
import { ConnectionOptions } from 'typeorm'; // Importa la interfaz ConnectionOptions de TypeORM

dotenv.config(); // Carga las variables de entorno desde un archivo .env

// Define un tipo para las variables de entorno
type EnvVariables = {
  db: ConnectionOptions; // Opciones de conexión a la base de datos
  api: {
    port: number; // Puerto en el que el servidor API se ejecutará
    secret: string; // Clave secreta para autenticación o propósitos de seguridad
  };
}

// Configuración de las variables de entorno
const env: EnvVariables = {
  db: {
    type: process.env.DB_DIALECT as 'postgres', // Tipo de base de datos (en este caso, postgres)
    host: process.env.DB_HOST, // Host de la base de datos
    port: Number(process.env.DB_PORT), // Puerto de la base de datos
    username: process.env.DB_USERNAME, // Nombre de usuario para la base de datos
    password: process.env.DB_PASSWORD, // Contraseña para la base de datos
    database: process.env.DB_DATABASE, // Nombre de la base de datos
  },
  api: {
    port: Number(process.env.API_PORT), // Puerto en el que el servidor API se ejecutará
    secret: process.env.API_SECRET || '', // Clave secreta para autenticación o una cadena vacía si no se proporciona
  },
};

export default env; // Exporta las variables de entorno configuradas
