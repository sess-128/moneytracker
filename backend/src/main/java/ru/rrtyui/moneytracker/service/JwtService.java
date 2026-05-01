//package ru.rrtyui.moneytracker.service;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.io.Decoders;
//import io.jsonwebtoken.security.Keys;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Service;
//import ru.rrtyui.moneytracker.model.MTUser;
//
//import javax.crypto.SecretKey;
//import java.util.Date;
//import java.util.HashMap;
//import java.util.Map;
//import java.util.function.Function;
//
//@Slf4j
//@Service
//public class JwtService {
//
//    private static final long EXPIRATION_TIME_FOR_TOKEN = 10000 * 60 * 24;
//
//    @Value("${token.signing.key}")
//    private String jwtSigningKey;
//
//    public String extractUserName(String token) {
//        try {
//            return extractClaim(token, Claims::getSubject);
//        } catch (Exception e) {
//            log.error("Failed to extract username from token", e);
//            return null;
//        }
//    }
//
//    public String generateToken(UserDetails userDetails) {
//        Map<String, Object> claims = new HashMap<>();
//        if (userDetails instanceof MTUser customUserDetails) {
//            claims.put("id", customUserDetails.getId());
//            claims.put("email", customUserDetails.getEmail());
//            claims.put("role", customUserDetails.getRole());
//        }
//
//        return generateToken(claims, userDetails);
//    }
//
//    public boolean isTokenValid(String token, UserDetails details) {
//        try {
//            final String userName = extractUserName(token);
//            boolean isValid = userName.equals(details.getUsername()) && !isTokenExpired(token);
//            if (!isValid) {
//                log.warn("Token invalid for user: {}", userName);
//            }
//            return isValid;
//        } catch (Exception e) {
//            log.error("Token validation failed", e);
//            return false;
//        }
//    }
//
//    private boolean isTokenExpired(String token) {
//        return extractExpiration(token).before(new Date());
//    }
//
//    private Date extractExpiration(String token) {
//        return extractClaim(token, Claims::getExpiration);
//    }
//
//    private String generateToken(Map<String, Object> claims, UserDetails userDetails) {
//        return Jwts.builder()
//                .claims(claims).subject(userDetails.getUsername())
//                .issuedAt(new Date(System.currentTimeMillis()))
//                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME_FOR_TOKEN))
//                .signWith(getSigningKey()).compact();
//    }
//
//    private <T> T extractClaim(String token, Function<Claims, T> claimsResolvers) {
//        Claims claims = extractAllClaims(token);
//        return claimsResolvers.apply(claims);
//    }
//
//    private Claims extractAllClaims(String token) {
//        return Jwts.parser()
//                .verifyWith(getSigningKey())
//                .build()
//                .parseSignedClaims(token)
//                .getPayload();
//    }
//
//    private SecretKey getSigningKey() {
//        byte[] keyBytes = Decoders.BASE64.decode(jwtSigningKey);
//        return Keys.hmacShaKeyFor(keyBytes);
//    }
//}
