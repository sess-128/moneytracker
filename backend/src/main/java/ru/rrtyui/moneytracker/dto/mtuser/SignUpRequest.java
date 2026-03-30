package ru.rrtyui.moneytracker.dto.mtuser;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Schema(description = "Запрос на создание пользователя")
public class SignUpRequest {

    @Schema(description = "Имя пользователя", example = "Андрей")
    @Size(min = 2, max = 50, message = "Имя пользователя должно содержать от 2 до 50 символов")
    @NotBlank(message = "Имя пользователя не должно быть пустым")
    private String name;

    @Schema(description = "Адрес электронной почты пользователя", example = "gaysex@hot.com")
    @Size(min = 6, max = 255, message = "Адрес электронной почты должен содержать от 6 до 255 символов")
    @NotBlank(message = "Адрес электронной почты не должен быть пустым")
    @Email(message = "Почта должны быть в формате твой_адрес@ящик.ку")
    private String email;

    @Schema(description = "Пароль пользователя", example = "12345678")
    @Size(max = 255, message = "Длина пароля должна быть не более 255 символов")
    private String password;

}
