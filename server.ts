import express, { Express } from 'express';// Importa el framework Express y la interfaz Express

import Console from './lib/Console'; // Importa la clase Console desde el módulo lib
import Router from './routes/Routes'; // Importa el módulo Router desde la carpeta routes
import Database from './lib/Database'; // Importa la clase Database desde el módulo lib
import env from './utils/Config'; // Importa el objeto env desde el módulo Config en la carpeta utils

class Server {
  private server: Express; // Instancia de Express para el servidor

  private dbConnection: Database; // Instancia de la clase de base de datos

  private console: Console = new Console('SERVER'); // Instancia de la clase Console con el nombre 'SERVER'

  // Inicializa Express
  // Inicializa la conexión a la base de datos con la configuración del entorno
  constructor() {
    this.server = express();
    this.dbConnection = new Database(env.db);
  }

  private applyMiddleware(): void {
    this.console.success('Applying middleware...'); // Muestra un mensaje en la consola indicando que se están aplicando middlewares
    this.server.use(express.json()); // Utiliza el middleware para procesar datos JSON
  }

  private setupRoutes(): void {
    this.console.success('Setting up routes ...'); // Muestra un mensaje en la consola indicando que se están configurando las rutas
    Router(this.server); // Configura las rutas utilizando el módulo Router
  }

  async init(): Promise<void> {
    try {
      this.console.success('Initializing server...'); // Muestra un mensaje en la consola indicando que se está inicializando el servidor
      this.applyMiddleware(); // Aplica los middlewares
      this.setupRoutes(); // Configura las rutas
      await this.dbConnection.createConnection(); // Crea una conexión a la base de datos
      this.console.success('Server initialized'); // Muestra un mensaje en la consola indicando que el servidor se ha inicializado
      this.server.listen(env.api.port, () => {
        this.console.success(`Server is running on port ${env.api.port}`); // Muestra un mensaje en la consola indicando que el servidor se está ejecutando en un puerto específico
      });
    } catch (e) {
      this.console.error((e as Error).message);
    }
  }
}

const server = new Server(); // Crea una instancia del servidor
server.init(); // Inicializa el servidor
