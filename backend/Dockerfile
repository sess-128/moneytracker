FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x mvnw
# Скачиваем зависимости
RUN ./mvnw dependency:go-offline -B

COPY src src
# Собираем проект
RUN ./mvnw package -DskipTests -B

EXPOSE 8080

# ИСПРАВЛЕНО: Явно указываем имя файла, которое мы задали в pom.xml
ENTRYPOINT ["java", "-jar", "target/app.jar"]