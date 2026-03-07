# STEP 1: Build Stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy everything (Simpler for beginners)
COPY . .

# Run the build. We skip 'go-offline' to prevent the SSL handshake error.
# We also use -B (Batch mode) to make the logs cleaner.
RUN mvn clean package -DskipTests -B

# STEP 2: Run Stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
