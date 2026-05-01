//package ru.rrtyui.moneytracker.controller;
//
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import ru.rrtyui.moneytracker.dto.mtuser.JwtAuthentificationResponse;
//import ru.rrtyui.moneytracker.dto.mtuser.SignInRequest;
//import ru.rrtyui.moneytracker.dto.mtuser.SignUpRequest;
//import ru.rrtyui.moneytracker.service.AuthenticationService;
//
//@RestController
//@RequestMapping("/api/auth")
//@RequiredArgsConstructor
//@Tag(name = "Аутентификация")
//public class AuthController {
//
//    private final AuthenticationService authenticationService;
//
//    @Operation(summary = "Регистрация пользователя")
//    @PostMapping("/sign-up")
//    public JwtAuthentificationResponse signUp(@RequestBody @Valid SignUpRequest request) {
//        return authenticationService.signUp(request);
//    }
//
//    @Operation(summary = "Авторизация пользователя")
//    @PostMapping("/sign-in")
//    public JwtAuthentificationResponse signIn(@RequestBody @Valid SignInRequest request) {
//        return authenticationService.signIn(request);
//    }
//}
