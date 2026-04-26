package ru.rrtyui.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.client.oidc.web.server.logout.OidcClientInitiatedServerLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestCustomizers;
import org.springframework.security.oauth2.client.web.server.DefaultServerOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.server.ServerOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.server.ServerOAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.client.web.server.WebSessionServerOAuth2AuthorizedClientRepository;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.logout.DelegatingServerLogoutHandler;
import org.springframework.security.web.server.authentication.logout.HeaderWriterServerLogoutHandler;
import org.springframework.security.web.server.authentication.logout.SecurityContextServerLogoutHandler;
import org.springframework.security.web.server.authentication.logout.ServerLogoutHandler;
import org.springframework.security.web.server.authentication.logout.ServerLogoutSuccessHandler;
import org.springframework.security.web.server.authentication.logout.WebSessionServerLogoutHandler;
import org.springframework.security.web.server.header.ClearSiteDataServerHttpHeadersWriter;
import org.springframework.session.data.redis.config.annotation.web.server.EnableRedisWebSession;

import java.net.URI;

@Configuration
@EnableWebFluxSecurity
@EnableRedisWebSession
public class SecurityConfig {

    @Bean
    SecurityWebFilterChain securityFilterChain(ServerHttpSecurity http,
                                               ServerOAuth2AuthorizationRequestResolver resolver,
                                               ServerOAuth2AuthorizedClientRepository oAuth2AuthorizedClientRepository,
                                               ServerLogoutSuccessHandler logoutSuccessHandler,
                                               ServerLogoutHandler logoutHandler) {
        return http
                .authorizeExchange(
                        authorizeExchange ->
                                authorizeExchange.pathMatchers(
                                                "/actuator/**",
                                                "/access-token/**",
                                                "/id-token"
                                        )
                                        .permitAll()
                                        .anyExchange()
                                        .authenticated()
                )
                .oauth2Login(oAuth2Login ->
                        oAuth2Login.authorizationRequestResolver(resolver)
                                .authorizedClientRepository(oAuth2AuthorizedClientRepository)
                )
                .logout(logout -> logout
                        .logoutSuccessHandler(logoutSuccessHandler)
                        .logoutHandler(logoutHandler)
                )
                .csrf(Customizer.withDefaults())
                .build();
    }

    @Bean
    ServerOAuth2AuthorizationRequestResolver resolver(ReactiveClientRegistrationRepository clientRegistrationRepository) {
        var authorizationRequestResolver = new DefaultServerOAuth2AuthorizationRequestResolver(clientRegistrationRepository);
        authorizationRequestResolver.setAuthorizationRequestCustomizer(OAuth2AuthorizationRequestCustomizers.withPkce());

        return authorizationRequestResolver;
    }

    @Bean
    ServerOAuth2AuthorizedClientRepository oAuth2AuthorizedClientRepository() {
        return new WebSessionServerOAuth2AuthorizedClientRepository();
    }

    @Bean
    ServerLogoutSuccessHandler logoutSuccessHandler(ReactiveClientRegistrationRepository clientRegistrationRepository) {
        var oidcClientInitiatedServerLogoutSuccessHandler = new OidcClientInitiatedServerLogoutSuccessHandler(clientRegistrationRepository);
//        oidcClientInitiatedServerLogoutSuccessHandler.setLogoutSuccessUrl(URI.create("{baseUrl}/test"));
        return oidcClientInitiatedServerLogoutSuccessHandler;
    }

    @Bean
    ServerLogoutHandler logoutHandler() {
        return new DelegatingServerLogoutHandler(
                new SecurityContextServerLogoutHandler(),
                new WebSessionServerLogoutHandler(),
                new HeaderWriterServerLogoutHandler(
                        new ClearSiteDataServerHttpHeadersWriter(ClearSiteDataServerHttpHeadersWriter.Directive.COOKIES)
                )
        );
    }
}
