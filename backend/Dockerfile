# Build stage
FROM eclipse-temurin:21-jdk-alpine as build

ARG MAVEN_VERSION=3.9.6

# Устанавливаем Maven
RUN wget -q "https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz" -O /tmp/maven.tar.gz \
    && tar -xzf /tmp/maven.tar.gz -C /opt/ \
    && ln -s /opt/apache-maven-${MAVEN_VERSION} /opt/maven \
    && rm /tmp/maven.tar.gz

ENV MAVEN_HOME=/opt/maven
ENV PATH=$MAVEN_HOME/bin:$PATH

WORKDIR /app

# Копируем только pom.xml для кеширования зависимостей
COPY pom.xml .

# Скачиваем зависимости (слой кешируется при неизменном pom.xml)
RUN mvn dependency:go-offline -B \
    && mvn dependency:resolve -B \
    && mvn dependency:purge-local-repository -DmanualInclude=true -DactTransitively=false -B || true

# Копируем исходный код и собираем приложение
COPY src src

RUN mvn package -DskipTests -B -Dmaven.test.skip=true

# Production stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Копируем только собранный jar-файл
COPY --from=build /app/target/app.jar .

# Создаём пользователя для безопасности
RUN addgroup -g 1001 -S appgroup && adduser -u 1001 -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]