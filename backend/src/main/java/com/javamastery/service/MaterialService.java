package com.javamastery.service;

import com.javamastery.entity.LearningMaterial;
import com.javamastery.entity.StudentActivity;
import com.javamastery.entity.User;
import com.javamastery.exception.ResourceNotFoundException;
import com.javamastery.repository.LearningMaterialRepository;
import com.javamastery.repository.StudentActivityRepository;
import com.javamastery.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class MaterialService {

    private final LearningMaterialRepository materialRepository;
    private final StudentActivityRepository studentActivityRepository;
    private final UserRepository userRepository;

    public MaterialService(LearningMaterialRepository materialRepository,
                           StudentActivityRepository studentActivityRepository,
                           UserRepository userRepository) {
        this.materialRepository = materialRepository;
        this.studentActivityRepository = studentActivityRepository;
        this.userRepository = userRepository;
    }

    public List<Map<String, Object>> getAllMaterials() {
        List<LearningMaterial> materials = materialRepository.findAllByOrderByUploadedAtDesc();
        List<Map<String, Object>> result = new ArrayList<>();
        for (LearningMaterial m : materials) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", m.getId());
            map.put("title", m.getTitle());
            map.put("pdfUrl", m.getPdfUrl());
            map.put("fileSizeBytes", m.getFileSizeBytes());
            map.put("version", m.getVersion());
            map.put("downloadCount", m.getDownloadCount());
            map.put("uploadedAt", m.getUploadedAt());
            map.put("topicTitle", m.getTopic().getTitle());
            map.put("topicSlug", m.getTopic().getSlug());
            map.put("moduleTitle", m.getTopic().getModule().getTitle());
            result.add(map);
        }
        return result;
    }

    @Transactional
    public LearningMaterial registerDownload(Long materialId, UUID userId) {
        LearningMaterial material = materialRepository.findById(materialId)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found"));

        material.setDownloadCount(material.getDownloadCount() + 1);
        LearningMaterial updated = materialRepository.save(material);

        if (userId != null) {
            userRepository.findById(userId).ifPresent(user -> {
                studentActivityRepository.save(new StudentActivity(user, "PDF_DOWNLOAD",
                        "{\"materialId\":" + material.getId() + ",\"title\":\"" + material.getTitle() + "\"}"));
            });
        }

        return updated;
    }
}
