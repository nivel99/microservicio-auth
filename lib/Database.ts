import { ConnectionOptions, Connection, createConnection } from 'typeorm';

import Console from './Console';

class Database {
  private options: ConnectionOptions;
  private console: Console;

  // El constructor recibe las opciones de configuración de la base de datos.
  constructor(options: ConnectionOptions) {
    this.options = options;
    this.console = new Console('DB');
  }

  // Este método crea una conexión a la base de datos y devuelve la conexión establecida.
  async createConnection(): Promise<Connection | null> {
    try {
      this.console.success('Connecting to database ...');
      // Configura y crea la conexión utilizando las opciones proporcionadas.
      const connection = await createConnection({
        ...this.options,
        entities: [`${__dirname}/../entities/*.${process.env.NODE_ENV === 'production' ? 'js' : 'ts'}`],
        synchronize: true,
      });
      this.console.success('Connected to database');
      return connection;
    } catch (e) {
      // En caso de error al conectar, registra el mensaje de error en la consola.
      this.console.error((e as Error).message);

      // Realiza un nuevo intento de conexión después de 5 segundos (intento de reconexión).
      setTimeout(() => this.createConnection(), 5000);
      return null; // Retorna null para indicar que no se pudo establecer la conexión.
    }
  }
}

export default Database;
