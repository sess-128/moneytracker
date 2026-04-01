package ru.rrtyui.moneytracker.dto.mtuser;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Schema(description = "Запрос на аутентификацию")
public class SignInRequest {

    @Schema(description = "Имя пользователя", example = "Андрей")
    @Size(min = 2, max = 50, message = "Имя пользователя должно содержать от 2 до 50 символов")
    @NotBlank(message = "Имя пользователя не должно быть пустым")
    private String name;

    @Schema(description = "Пароль пользователя", example = "12345678")
    @Size(min = 8,max = 255, message = "Длина пароля должна быть от 8 до 255 символов")
    @NotBlank(message = "Пароль не может быть пустыми")
    private String password;

}
