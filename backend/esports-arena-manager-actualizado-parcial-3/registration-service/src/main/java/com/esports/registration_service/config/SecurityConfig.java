package com.esports.registration_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
public class SecurityConfig {

    @Value("${jwt.secret}")
    private String secret;

    // VALIDACIÓN DEL TOKEN JWT

    @Bean
    public JwtDecoder jwtDecoder() {

        SecretKey clave = new SecretKeySpec(
                secret.getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
        );

        return NimbusJwtDecoder.withSecretKey(clave)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
    }

    // OBTENER LOS ROLES DEL TOKEN

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {

        JwtGrantedAuthoritiesConverter authorities =
                new JwtGrantedAuthoritiesConverter();

        authorities.setAuthoritiesClaimName("roles");
        authorities.setAuthorityPrefix("");

        JwtAuthenticationConverter converter =
                new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(authorities);

        return converter;
    }

    // CONFIGURACIÓN DE PERMISOS

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            JwtAuthenticationConverter converter) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // Permitir Swagger
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/docs/**"
                        ).permitAll()

                        // Consultar inscripciones
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/inscripciones/**",
                                "/api/v2/inscripciones/**"
                        ).permitAll()

                        // Registrar inscripciones
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/inscripciones/**",
                                "/api/v2/inscripciones/**"
                        ).hasAnyAuthority("USER", "JUGADOR")

                        // Actualizar inscripciones
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/v1/inscripciones/**",
                                "/api/v2/inscripciones/**"
                        ).hasAnyAuthority("ORGANIZADOR", "ADMIN")

                        // Eliminar inscripciones
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/v1/inscripciones/**",
                                "/api/v2/inscripciones/**"
                        ).hasAuthority("ADMIN")

                        .anyRequest().denyAll()
                )

                .sessionManagement(sm -> sm.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS
                ))

                .oauth2ResourceServer(oauth -> oauth.jwt(
                        jwt -> jwt.jwtAuthenticationConverter(converter)
                ));

        return http.build();
    }
}