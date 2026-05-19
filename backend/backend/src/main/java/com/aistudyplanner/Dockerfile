FROM maven:3.9.6-eclipse-temurin-21

WORKDIR /app

COPY . .

RUN mvn clean package

EXPOSE 7000

CMD ["java", "-jar", "target/backend-1.0-SNAPSHOT.jar"]