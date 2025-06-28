
FROM openjdk:17-jdk-slim

WORKDIR /app


COPY mvnw ./
COPY mvnw.cmd ./
COPY .mvn .mvn
COPY pom.xml ./


RUN chmod +x ./mvnw


RUN ./mvnw dependency:go-offline -B


COPY src ./src


RUN ./mvnw clean package -DskipTests


EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/*.jar"]
