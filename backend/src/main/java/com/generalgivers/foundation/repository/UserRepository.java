package com.generalgivers.foundation.repository;

import com.generalgivers.foundation.entity.User;
import com.generalgivers.foundation.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(UserRole role);

    List<User> findByRoleIn(List<UserRole> roles);

    List<User> findByIsActive(Boolean isActive);

    long countByRole(UserRole role);

    long countByIsActive(Boolean isActive);
}
