
FROM openjdk:17-jdk-slim

WORKDIR /app


COPY backend/mvnw ./
COPY backend/mvnw.cmd ./
COPY backend/.mvn .mvn
COPY backend/pom.xml ./


RUN chmod +x ./mvnw


RUN ./mvnw dependency:go-offline -B


COPY backend/src ./src


RUN ./mvnw clean package -DskipTests


EXPOSE 8080

RUN mv target/*.jar target/app.jar
CMD ["java", "-jar", "target/app.jar"]
