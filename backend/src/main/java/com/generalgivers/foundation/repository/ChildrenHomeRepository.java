package com.generalgivers.foundation.repository;

import com.generalgivers.foundation.entity.ChildrenHome;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChildrenHomeRepository extends JpaRepository<ChildrenHome, UUID> {

    List<ChildrenHome> findByNameContainingIgnoreCase(String name);

    List<ChildrenHome> findByLocation(String location);
}
