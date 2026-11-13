# ==============================================================================
# RA-Java Root Dockerfile for Railway Deployments
# Builds backend from repository root with Eclipse Temurin JDK 21
# ==============================================================================

# Stage 1: Build Spring Boot JAR
FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /build

RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

COPY backend/pom.xml .
COPY backend/src ./src

RUN mvn clean package -DskipTests

# Stage 2: Production Runtime with JDK 21
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app

COPY --from=builder /build/target/*.jar app.jar
RUN mkdir -p /app/data

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
