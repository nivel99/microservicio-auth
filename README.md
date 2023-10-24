# Desfibriladores
Desfibriladores es una aplicación basada en microservicios.
Este proyecto esta basado en el stack PERN (Postgres, Express, ReactJs, NodeJs) usando TypeScript.
## Requirements
- Node Js 14.XX
- Docker

Este proyecto utiliza Docker para controlar toda la arquitectura del software.
Primero que nada necesitas configurar todas las variables de entorno, crea el archivo `.env` en el directorio raiz.
> En este repositorio puede encontrar un archivo `.env.example` que contiene todas las variables de entorno necesarias para este proyecto.

## Ejecute este proyecto
Primero necesitas usar `docker-compose` para configurar el servicio de base de datos Postgres con este comando:
```
docker-compose up -d db
```
Luego puedes instalar todas las dependencias del proyecto:
```
npm i
```
Ahora puedes ejecutar tu proyecto en un entorno de desarrollo:
```
npm run start:dev
```
```
para ejecutar el proyecto
npm run start:dev