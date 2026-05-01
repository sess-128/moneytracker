package ru.rrtyui.moneytracker.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.rrtyui.moneytracker.model.MTUser;
import ru.rrtyui.moneytracker.repository.MTUserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MTUserService {

    private final MTUserRepository userRepository;

    private MTUser save(MTUser user){
        return userRepository.save(user);
    }

    public MTUser create(MTUser user) {
//        if (userRepository.existsByName(user.getUsername())) {
//            throw new RuntimeException("Пользователь с таким именем уже существует");
//        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Пользователь с такой почтой уже существует");
        }

        return save(user);
    }

    public MTUser getByUsername(String username) {
        return userRepository.findByName(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
    }

    public Optional<MTUser> getUserByUsername(String username) {
        return userRepository.findByName(username);
    }
//
//    public UserDetailsService userDetailsService() {
//        return this::getByUsername;
//    }
//
//    public MTUser getCurrentUser() {
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        return getByUsername(username);
//    }
}
