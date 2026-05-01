//package ru.rrtyui.moneytracker.service;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//import ru.rrtyui.moneytracker.dto.mtuser.JwtAuthentificationResponse;
//import ru.rrtyui.moneytracker.dto.mtuser.SignInRequest;
//import ru.rrtyui.moneytracker.dto.mtuser.SignUpRequest;
//import ru.rrtyui.moneytracker.model.MTUser;
//import ru.rrtyui.moneytracker.model.Role;
//
//@Service
//@RequiredArgsConstructor
//public class AuthenticationService {
//
//    private final MTUserService userService;
//    private final JwtService jwtService;
//    private final PasswordEncoder passwordEncoder;
//    private final AuthenticationManager authenticationManager;
//
//    public JwtAuthentificationResponse signUp(SignUpRequest request) {
//        var user = MTUser.builder()
//                .name(request.getName())
//                .email(request.getEmail())
//                .password(passwordEncoder.encode(request.getPassword()))
//                .role(Role.ROLE_USER)
//                .build();
//
//        userService.create(user);
//
//        var jwt = jwtService.generateToken(user);
//        return new JwtAuthentificationResponse(jwt);
//    }
//
//    public JwtAuthentificationResponse signIn(SignInRequest request) {
//        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
//                request.getName(),
//                request.getPassword()));
//
//        var user = userService
//                .userDetailsService()
//                .loadUserByUsername(request.getName());
//
//        var jwt = jwtService.generateToken(user);
//        return new JwtAuthentificationResponse(jwt);
//    }
//}
