package com.javamastery.controller;

import com.javamastery.dto.ApiResponse;
import com.javamastery.entity.LearningMaterial;
import com.javamastery.security.UserPrincipal;
import com.javamastery.service.MaterialService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/materials")
public class MaterialController {

    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllMaterials() {
        List<Map<String, Object>> materials = materialService.getAllMaterials();
        return ResponseEntity.ok(ApiResponse.ok(materials));
    }

    @PostMapping("/{materialId}/download")
    public ResponseEntity<ApiResponse<LearningMaterial>> registerDownload(
            @PathVariable Long materialId,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = (principal != null) ? principal.getId() : null;
        LearningMaterial material = materialService.registerDownload(materialId, userId);
        return ResponseEntity.ok(ApiResponse.ok("Download registered", material));
    }
}
