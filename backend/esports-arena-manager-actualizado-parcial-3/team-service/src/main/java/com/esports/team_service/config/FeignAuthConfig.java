package com.esports.team_service.config;

import feign.RequestInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignAuthConfig {

    @Bean
    public RequestInterceptor authInterceptor() {
        return template -> {
            var atributos = RequestContextHolder.getRequestAttributes();

            if (atributos instanceof ServletRequestAttributes servlet) {
                HttpServletRequest request = servlet.getRequest();

                String authorization = request.getHeader("Authorization");

                if (authorization != null &&
                        authorization.startsWith("Bearer ")) {
                    template.header("Authorization", authorization);
                }
            }
        };
    }
}
