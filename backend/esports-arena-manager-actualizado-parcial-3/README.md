![Java](https://img.shields.io/badge/Java-25-orange)

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-brightgreen)

![Microservices](https://img.shields.io/badge/Microservices-10-blue)

![JWT](https://img.shields.io/badge/JWT-Authentication-red)

![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-brightgreen)

![OpenFeign](https://img.shields.io/badge/OpenFeign-REST-orange)

![API Gateway](https://img.shields.io/badge/API%20Gateway-Spring%20Cloud-blue)

![Eureka](https://img.shields.io/badge/Eureka-Service%20Discovery-red)

![MySQL](https://img.shields.io/badge/MySQL-Database-blue)

![JUnit](https://img.shields.io/badge/JUnit-5-green)

![Mockito](https://img.shields.io/badge/Mockito-Testing-purple)

![AssertJ](https://img.shields.io/badge/AssertJ-Assertions-success)

![Datafaker](https://img.shields.io/badge/Datafaker-Test%20Data-yellow)

# 🎮 eSports Arena Manager

## 📖 Descripción

**eSports Arena Manager** es una plataforma backend desarrollada utilizando una arquitectura basada en microservicios para la administración de torneos de eSports.

El sistema permite gestionar usuarios, juegos, equipos, torneos, partidas, inscripciones, resultados, rankings, notificaciones y sanciones mediante servicios independientes, favoreciendo la escalabilidad, el desacoplamiento y el mantenimiento del sistema.

Este proyecto fue desarrollado como **Proyecto Final** de la asignatura **Desarrollo de Plataforma Backend**.

---

# 🎯 Objetivo

Desarrollar una plataforma basada en microservicios aplicando buenas prácticas de desarrollo utilizando el ecosistema Spring Boot y Spring Cloud.

---

# 👨‍💻 Integrantes

- Daniel Saa
- Luciano Campos
- Alexis Molina

---

# 🛠 Tecnologías utilizadas

- Java 25
- Spring Boot 4
- Spring Cloud
- Spring Data JPA
- Hibernate
- Spring Validation
- Spring Security
- JWT
- API Gateway
- Netflix Eureka Server
- Spring HATEOAS
- SpringDoc OpenAPI (Swagger)
- OpenFeign
- MySQL
- Maven
- JUnit 5
- Mockito
- AssertJ
- Datafaker
- Git & GitHub

---

# 🏗 Arquitectura

El sistema está compuesto por los siguientes microservicios:

| Microservicio | Función |
|---------------|---------|
| Eureka Server | Registro y descubrimiento de servicios |
| Gateway Service | Punto único de entrada |
| User Service | Gestión de usuarios |
| Game Service | Gestión de juegos |
| Team Service | Gestión de equipos |
| Tournament Service | Gestión de torneos |
| Match Service | Gestión de partidas |
| Registration Service | Gestión de inscripciones |
| Result Service | Gestión de resultados |
| Ranking Service | Gestión de rankings |
| Notification Service | Gestión de notificaciones |
| Sanction Service | Gestión de sanciones |

---



## Arquitectura

- Arquitectura basada en Microservicios
- Spring Cloud
- API Gateway
- Eureka Server
- Descubrimiento automático de servicios

---

## Seguridad

- JWT Authentication
- Login
- Registro de usuarios
- BCrypt Password Encoder
- Spring Security

---

## Persistencia

- MySQL
- Spring Data JPA
- Hibernate
- DTO
- Bean Validation

---

## Documentación

Todos los microservicios cuentan con documentación mediante:

- Swagger UI
- OpenAPI 3

---

## Comunicación entre Microservicios

Se implementó comunicación utilizando **OpenFeign**.

Actualmente:

- Tournament Service → Game Service

---

## HATEOAS

Se implementó una segunda versión (V2) de los controladores utilizando Spring HATEOAS.

Se utilizaron:

- EntityModel
- CollectionModel
- Links Self

Microservicios implementados:

- User
- Game
- Team
- Tournament
- Match
- Registration
- Result
- Ranking
- Notification
- Sanction

---
# ✅ Funcionalidades implementadas

## 🏗 Arquitectura

- ✅ Arquitectura basada en Microservicios
- ✅ Spring Boot 4
- ✅ Spring Cloud
- ✅ API Gateway
- ✅ Eureka Server
- ✅ Descubrimiento automático de servicios

---

## 🔒 Seguridad

- ✅ JWT Authentication
- ✅ Login
- ✅ Registro de usuarios
- ✅ Password encriptado con BCrypt
- ✅ Spring Security
- ✅ Roles de usuario

---

## 💾 Persistencia

- ✅ Spring Data JPA
- ✅ MySQL
- ✅ Repositories por microservicio
- ✅ Entidades independientes
- ✅ DTOs
- ✅ Bean Validation

---

## 📡 APIs

- ✅ CRUD REST
- ✅ Swagger / OpenAPI
- ✅ HATEOAS V2
- ✅ OpenFeign

---

## 🧪 Calidad del software

- ✅ JUnit 5
- ✅ Mockito
- ✅ AssertJ
- ✅ Datafaker

---

## 📚 Documentación

- ✅ Swagger UI
- ✅ GitHub
- ✅ README
# 🧪 Pruebas Unitarias

Las pruebas unitarias fueron desarrolladas utilizando:

- JUnit 5
- Mockito
- AssertJ
- Datafaker

Las pruebas permiten validar la lógica de negocio de cada servicio de manera aislada, utilizando objetos simulados (Mocks) sin depender de una base de datos real.

---

## Microservicios con pruebas implementadas

- User Service
  - UsuarioServiceTest
  - AuthServiceTest

- Tournament Service
  - TorneoServiceTest

- Game Service
  - GameServiceTest

- Team Service
  - TeamServiceTest

- Match Service
  - MatchServiceTest

- Registration Service
  - RegistrationServiceTest

- Result Service
  - ResultServiceTest

- Ranking Service
  - RankingServiceTest

- Notification Service
  - NotificationServiceTest

- Sanction Service
  - SanctionServiceTest

---

## Casos de prueba

Las pruebas unitarias verifican:

- Obtener registros
- Buscar por ID
- Buscar por distintos criterios
- Crear registros
- Actualizar información
- Eliminar registros
- Validar reglas de negocio
- Validar excepciones
- Comunicación entre microservicios utilizando Mockito
- Verificación de respuestas utilizando AssertJ

---

# ▶️ Ejecución

1. Ejecutar Eureka Server.
2. Iniciar MySQL.
3. Ejecutar todos los microservicios.
4. Ejecutar API Gateway.
5. Acceder mediante Gateway.
6. Probar los endpoints utilizando Swagger UI.

---

# 📂 Organización

```text
eureka-server
gateway-service
user-service
game-service
team-service
tournament-service
match-service
registration-service
result-service
ranking-service
notification-service
sanction-service
```

---

# ✅ Características implementadas

| Característica | Estado |
|----------------|:------:|
| Arquitectura de Microservicios | ✅ |
| CRUD REST | ✅ |
| DTO | ✅ |
| Bean Validation | ✅ |
| MySQL | ✅ |
| Spring Data JPA | ✅ |
| Swagger | ✅ |
| HATEOAS | ✅ |
| JWT | ✅ |
| Spring Security | ✅ |
| BCrypt | ✅ |
| OpenFeign | ✅ |
| API Gateway | ✅ |
| Eureka Server | ✅ |
| JUnit 5 | ✅ |
| Mockito | ✅ |
| AssertJ | ✅ |
| Datafaker | ✅ |

---

# 📌 Conclusión

El proyecto permitió implementar una arquitectura moderna basada en microservicios utilizando Spring Boot y Spring Cloud.

Se integraron componentes como API Gateway, Eureka Server, OpenFeign, JWT, Swagger, HATEOAS y pruebas unitarias con JUnit 5, Mockito, AssertJ y Datafaker, logrando una solución desacoplada, escalable y de fácil mantenimiento.

---

# 👨‍💻 Desarrollado por

Daniel Saa

Luciano Campos

Alexis Molina

**DUOC UC**

**Asignatura:** Desarrollo de Plataforma Backend