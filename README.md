<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Ejecutar en desarrollo

1. Clonar el repostorio
2. Ejecutar
```
pnpm i
```
3. Tener nest cli instalado
```
npm i -g @nestjs/cli
```
4. Levantar la base de datos
```
docker-compose up -d
```
5. Clonar el archivo __.env.template__ y renombrar la copia a __.env__
6. Llenar las variables de entornos definidas en el __.env__
7. Ejecutar la app con el comando
```
pnpm start:dev
```
8. Reconstruir los datos de la base de datos con la semilla
```
localhost:3000/api/v2/seed
```

## Stack usado
* MongoDB
* Nest
## License

Nest is [MIT licensed](LICENSE).
