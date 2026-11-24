# 🎮 eSports Arena Manager

Sistema de gestión de torneos de eSports desarrollado con **React, Spring Boot y arquitectura de microservicios**.

El proyecto permite gestionar usuarios, juegos, equipos, torneos, partidas, inscripciones, resultados, rankings, notificaciones y sanciones.

---

## 📌 Descripción del proyecto

eSports Arena Manager es una aplicación web diseñada para administrar competiciones de videojuegos mediante una plataforma centralizada.

El sistema utiliza una arquitectura distribuida, donde las funcionalidades están separadas en microservicios independientes que se comunican mediante un API Gateway y Eureka.

## 🛠️ Tecnologías utilizadas

### Frontend
- React
- JavaScript
- Vite
- HTML5
- CSS3

### Backend
- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Maven
- Eureka Server
- Spring Cloud Gateway

### Base de datos
- MySQL

### Herramientas
- Visual Studio Code
- IntelliJ IDEA
- Git
- GitHub

---

## 🏗️ Arquitectura del sistema

El backend está compuesto por 12 aplicaciones:

| Aplicación | Puerto | Función |
|---|---:|---|
| Eureka Service | 8761 | Registro y descubrimiento de servicios |
| Gateway Service | 8080 | Entrada principal de las solicitudes |
| User Service | 8082 | Gestión de usuarios y autenticación |
| Game Service | 8081 | Gestión de videojuegos |
| Tournament Service | 8083 | Gestión de torneos |
| Team Service | 8084 | Gestión de equipos |
| Match Service | 8085 | Gestión de partidas |
| Result Service | 8086 | Gestión de resultados |
| Registration Service | 8087 | Gestión de inscripciones |
| Ranking Service | 8088 | Gestión de rankings |
| Notification Service | 8089 | Gestión de notificaciones |
| Sanction Service | 8090 | Gestión de sanciones |

El frontend se comunica con el backend mediante el Gateway Service, utilizando el puerto 8080.

---

## 📂 Estructura del proyecto

```text
esports-arena-manager-DEFINITIVO/
│
├── backend/
│   └── esports-arena-manager-actualizado-parcial-3/
│       ├── eureka-service/
│       ├── gateway-service/
│       ├── user-service/
│       ├── game-service/
│       ├── tournament-service/
│       ├── team-service/
│       ├── match-service/
│       ├── result-service/
│       ├── registration-service/
│       ├── ranking-service/
│       ├── notification-service/
│       └── sanction-service/
│
├── frontend/
│   └── esports-arena-ep2-mein/
│
└── README.md - database
```

---

## 💻 Requisitos para ejecutar el proyecto

Antes de iniciar, es necesario tener instalado:

- Java (versión compatible con los proyectos Spring Boot).
- Node.js y npm.
- MySQL Server.
- Visual Studio Code o IntelliJ IDEA.
- Git (opcional, para clonar el repositorio).

---

## 📥 Instalación del proyecto

Clonar el repositorio desde GitHub:

```bash
git clone https://github.com/DanielSNZ/esports-arena-manager-final.git
```

Ingresar a la carpeta:

```bash
cd esports-arena-manager-final
```

---

## 🗄️ Configuración de MySQL

El backend utiliza bases de datos independientes para sus microservicios.

Crear las siguientes bases de datos en MySQL:

```sql
CREATE DATABASE user_service_db;
CREATE DATABASE game_service_db;
CREATE DATABASE tournament_service_db;
CREATE DATABASE team_service_db;
CREATE DATABASE match_service_db;
CREATE DATABASE result_service_db;
CREATE DATABASE registration_service_db;
CREATE DATABASE ranking_service_db;
CREATE DATABASE notification_service_db;
CREATE DATABASE sanction_service_db;
```

Configurar las credenciales de conexión en los archivos `application.properties` de cada microservicio.

Ejemplo:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/game_service_db
spring.datasource.username=TU_USUARIO
spring.datasource.password=TU_CONTRASEÑA

spring.jpa.hibernate.ddl-auto=update
```

**Importante:** reemplazar los valores de ejemplo por las credenciales correspondientes al equipo donde se ejecutará el proyecto. No publicar contraseñas reales ni claves JWT.

Hibernate utiliza `ddl-auto=update` para actualizar la estructura de las tablas según las entidades del proyecto.

---

## ⚙️ Configuración y ejecución del backend

Los microservicios deben ejecutarse en terminales independientes.

### 1. Iniciar Eureka Server

Ubicación:

```text
backend/esports-arena-manager-actualizado-parcial-3/eureka-service
```

Ejecutar:

```powershell
.\mvnw.cmd spring-boot:run
```

Panel de Eureka:

http://localhost:8761

### 2. Iniciar los microservicios

Iniciar cada aplicación desde su propia carpeta utilizando:

```powershell
.\mvnw.cmd spring-boot:run
```

Microservicios:

- user-service
- game-service
- tournament-service
- team-service
- match-service
- result-service
- registration-service
- ranking-service
- notification-service
- sanction-service

### 3. Iniciar Gateway Service

Desde la carpeta:

```text
backend/esports-arena-manager-actualizado-parcial-3/gateway-service
```

Ejecutar:

```powershell
.\mvnw.cmd spring-boot:run
```

El Gateway queda disponible en:

http://localhost:8080

---

## 🌐 Ejecución del frontend

Ingresar a la carpeta:

```powershell
cd frontend/esports-arena-ep2-mein
```

Instalar las dependencias:

```powershell
npm install
```

Iniciar el servidor de desarrollo:

```powershell
npm run dev
```

Vite mostrará la dirección local para ingresar a la aplicación, normalmente:

http://localhost:5173

---

## 🔐 Seguridad

El sistema utiliza Spring Security y JWT para la autenticación y autorización de solicitudes.

Las contraseñas de los usuarios se gestionan mediante BCrypt.

Las claves secretas y credenciales de conexión deben configurarse localmente y mantenerse fuera del repositorio público.

---

## 🧪 Construcción del frontend

Para comprobar que el frontend puede compilarse para producción:

```powershell
npm run build
```

El resultado de la compilación se genera en la carpeta `dist`.

---

## 👨‍💻 Autor

**Daniel Saa (DanielSNZ)**

Proyecto académico de desarrollo Full Stack.

Repositorio oficial:

https://github.com/DanielSNZ/esports-arena-manager-final

---

## 📄 Estado del proyecto

Versión publicada en GitHub: `main`.

Proyecto desarrollado con React y Spring Boot utilizando arquitectura de microservicios.

---

## Guía de instalación en otro computador

### 1. Versiones utilizadas en el desarrollo

| Tecnología | Versión |
|---|---|
| Java JDK | 25 |
| Spring Boot (user-service) | 4.0.6 |
| Node.js | 24.22.0 |
| npm | 11.19.1 |
| Vite | 8.3.4 |
| MySQL Server | 8.0.46 |
| Git | 2.56.0 |

Programas recomendados:
- IntelliJ IDEA.
- Visual Studio Code.
- MySQL Workbench.

### 2. Clonar el repositorio

Abrir PowerShell y ejecutar:

```powershell
git clone https://github.com/DanielSNZ/esports-arena-manager-final.git
cd esports-arena-manager-final
```

### 3. Preparar MySQL

Iniciar MySQL Server y abrir MySQL Workbench.

Ejecutar las siguientes consultas:

```sql
CREATE DATABASE IF NOT EXISTS game_service_db;
CREATE DATABASE IF NOT EXISTS user_service_db;
CREATE DATABASE IF NOT EXISTS tournament_service_db;
CREATE DATABASE IF NOT EXISTS team_service_db;
CREATE DATABASE IF NOT EXISTS match_service_db;
CREATE DATABASE IF NOT EXISTS result_service_db;
CREATE DATABASE IF NOT EXISTS registration_service_db;
CREATE DATABASE IF NOT EXISTS ranking_service_db;
CREATE DATABASE IF NOT EXISTS notification_service_db;
CREATE DATABASE IF NOT EXISTS sanction_service_db;
```

### 4. Importar el respaldo de datos

El archivo Dump20261123.sql se entrega por separado
y no está incluido en el repositorio público.

En MySQL Workbench:

1. Seleccionar Server.
2. Seleccionar Data Import.
3. Seleccionar Import from Self-Contained File.
4. Buscar el archivo Dump20261123.sql.
5. Presionar Start Import.
6. Actualizar la sección SCHEMAS.

Esto permite recuperar los datos de demostración
incluidos en el respaldo.

### 5. Configurar el backend

Abrir la siguiente carpeta en IntelliJ IDEA:

backend/esports-arena-manager-actualizado-parcial-3

Configurar Java JDK 25 como SDK del proyecto.

Dentro de cada microservicio, ingresar a:

src/main/resources/

Copiar el archivo application-example.properties
y renombrar la copia como application.properties.

Para gateway-service, copiar application-example.yml
y renombrar la copia como application.yml.

En los servicios que utilizan MySQL, configurar:

```properties
spring.datasource.username=root
spring.datasource.password=TU_PASSWORD_MYSQL
```

La contraseña debe corresponder al servidor MySQL
del computador donde se ejecutará el proyecto.

En user-service, configurar también jwt.secret
con una clave privada nueva de al menos 32 bytes.

No modificar los puertos ni las rutas configuradas
en los archivos de ejemplo.

### 6. Orden de ejecución del backend

Primero iniciar Eureka Server.

Después iniciar los servicios de negocio.

Finalmente iniciar API Gateway.

| Servicio | Puerto |
|---|---|
| eureka-service | 8761 |
| game-service | 8081 |
| user-service | 8082 |
| tournament-service | 8083 |
| team-service | 8084 |
| match-service | 8085 |
| result-service | 8086 |
| registration-service | 8087 |
| ranking-service | 8088 |
| notification-service | 8089 |
| sanction-service | 8090 |
| gateway-service | 8080 |

Cada servicio puede iniciarse desde IntelliJ IDEA
ejecutando su clase principal Application.

También puede iniciarse desde su propia carpeta
utilizando Maven Wrapper:

```powershell
.\mvnw.cmd spring-boot:run
```

Para utilizar este comando, Java debe estar
correctamente configurado en Windows.

Mantener todos los servicios ejecutándose.

Comprobar el registro de los servicios en Eureka:

http://localhost:8761

### 7. Ejecutar el frontend

Abrir una nueva terminal PowerShell desde
la carpeta principal del repositorio.

```powershell
cd frontend/esports-arena-ep2-mein
npm.cmd install
npm.cmd run dev
```

Abrir el navegador en:

http://localhost:5173

Si Vite utiliza otro puerto, abrir la dirección
que indique la terminal.

Mantener la terminal abierta mientras se utiliza
la aplicación.

### 8. Comprobar el funcionamiento

- Registrar un usuario de prueba.
- Iniciar sesión.
- Consultar los torneos.
- Consultar los equipos.
- Revisar las inscripciones.
- Consultar los partidos.
- Revisar los resultados y rankings.

### 9. Solución de errores frecuentes

**Error de conexión a MySQL:**

Comprobar que MySQL Server esté iniciado y que
las credenciales sean correctas.

**Java no se reconoce en PowerShell:**

Configurar JAVA_HOME y PATH o ejecutar los
microservicios directamente desde IntelliJ IDEA
con JDK 25.

**Error al ejecutar npm:**

Utilizar npm.cmd en lugar de npm en PowerShell.

**Error de conexión entre frontend y backend:**

Comprobar que Eureka, API Gateway y los
microservicios correspondientes estén ejecutándose.

**Puerto ocupado:**

Cerrar la aplicación que esté utilizando el puerto
correspondiente antes de iniciar el servicio.

### 10. Consideraciones finales

El repositorio contiene el código fuente del frontend,
backend y archivos de configuración de ejemplo.

Por seguridad, las contraseñas, claves privadas y
el respaldo SQL no están publicados en GitHub.

El proyecto debe configurarse localmente antes
de ejecutarse en un nuevo computador.