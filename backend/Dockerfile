# Build stage (JDK 21)
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /workspace

# copy pom first to take advantage of layer caching
COPY pom.xml ./

# copy source
COPY src ./src

RUN mvn -B -DskipTests package

# Runtime stage (JRE 21)
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# copy built jar
COPY --from=builder /workspace/target/*.jar app.jar

ENV JAVA_OPTS=""

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dspring.profiles.active=prod -jar /app/app.jar"]
