package com.generalgivers.foundation.repository;

import com.generalgivers.foundation.entity.ModuleType;
import com.generalgivers.foundation.entity.Upload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UploadRepository extends JpaRepository<Upload, UUID> {

    List<Upload> findByModuleTypeAndModuleIdOrderByCreatedAtDesc(ModuleType moduleType, UUID moduleId);

    List<Upload> findByModuleTypeOrderByCreatedAtDesc(ModuleType moduleType);

    List<Upload> findByUploadedByIdOrderByCreatedAtDesc(UUID userId);

    void deleteByModuleTypeAndModuleId(ModuleType moduleType, UUID moduleId);
}
