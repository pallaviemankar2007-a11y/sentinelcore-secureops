package com.sentinelcore.infrastructure_monitoring.repository;

import com.sentinelcore.infrastructure_monitoring.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Is line ko add karein:
    Optional<User> findByUsername(String username);

}