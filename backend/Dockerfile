# Replaced single-stage image with multi-stage Maven build for smaller runtime image
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /workspace
# copy pom and wrapper first to take advantage of layer caching
COPY pom.xml mvnw* ./
COPY .mvn .mvn
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# copy built jar (assumes a single jar in target produced by Spring Boot Maven plugin)
COPY --from=builder /workspace/target/*.jar app.jar
ENV JAVA_OPTS=""
# Let Render (or other platforms) set PORT; app.yml will default to 8080 if not provided
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dspring.profiles.active=prod -jar /app/app.jar"]
