package ru.rrtyui.moneytracker.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ru.rrtyui.moneytracker.model.MTUser;
import ru.rrtyui.moneytracker.repository.MTUserRepository;

@Service
@RequiredArgsConstructor
public class MTUserService {

    private final MTUserRepository userRepository;

    private MTUser save(MTUser user){
        return userRepository.save(user);
    }

    public MTUser create(MTUser user) {
        if (userRepository.existsByName(user.getUsername())) {
            throw new RuntimeException("Пользователь с таким именем уже существует");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Пользователь с такой почтой уже существует");
        }

        return save(user);
    }

    public MTUser getByUsername(String username) {
        return userRepository.findByName(username)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));
    }

    public UserDetailsService userDetailsService() {
        return this::getByUsername;
    }

    public MTUser getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return getByUsername(username);
    }
}
