package ru.rrtyui.moneytracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.rrtyui.moneytracker.model.MTUser;

import java.util.Optional;

public interface MTUserRepository extends JpaRepository<MTUser, Long> {
    Optional<MTUser> findByName(String name);
    boolean existsByName(String name);
    boolean existsByEmail(String email);
}
