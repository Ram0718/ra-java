package com.javamastery.controller;

import com.javamastery.dto.ApiResponse;
import com.javamastery.dto.DashboardStatsDto;
import com.javamastery.security.UserPrincipal;
import com.javamastery.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardSummary(
            @AuthenticationPrincipal UserPrincipal principal) {
        DashboardStatsDto stats = dashboardService.calculateStudentDashboard(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
