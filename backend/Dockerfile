FROM eclipse-temurin:21-jdk-alpine

# Установка Maven без лишних зависимостей JDK
ARG MAVEN_VERSION=3.9.6
RUN wget -q "https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz" -O /tmp/maven.tar.gz \
    && tar -xzf /tmp/maven.tar.gz -C /opt/ \
    && ln -s /opt/apache-maven-${MAVEN_VERSION} /opt/maven \
    && rm /tmp/maven.tar.gz

ENV MAVEN_HOME=/opt/maven
ENV PATH=$MAVEN_HOME/bin:$PATH

WORKDIR /app

# 1. Копируем только pom.xml для кеширования зависимостей
COPY pom.xml .

# 2. Качаем зависимости (кешируется, если pom.xml не менялся)
RUN mvn dependency:go-offline -B

# 3. Копируем исходный код
COPY src src

# 4. Собираем проект
RUN mvn package -DskipTests -B

EXPOSE 8080

# Запускаем собранный jar
ENTRYPOINT ["java", "-jar", "target/app.jar"]