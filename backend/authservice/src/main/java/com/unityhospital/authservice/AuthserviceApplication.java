package com.unityhospital.authservice;

import com.unityhospital.authservice.config.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
public class AuthserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthserviceApplication.class, args);
	}

	@Bean
	public FlywayMigrationStrategy flywayMigrationStrategy() {
		return flyway -> {
			flyway.repair();
			flyway.migrate();
		};
	}

}
