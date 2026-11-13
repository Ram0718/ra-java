package com.javamastery.controller;

import com.javamastery.dto.*;
import com.javamastery.security.UserPrincipal;
import com.javamastery.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(@RequestBody AuthRequest request,
                                                                HttpServletRequest servletRequest) {
        String clientIp = servletRequest.getRemoteAddr();
        AuthResponse response = authService.authenticateGoogleUser(request, clientIp);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/admin-login")
    public ResponseEntity<ApiResponse<AuthResponse>> adminLogin(@RequestBody AdminLoginRequest request,
                                                               HttpServletRequest servletRequest) {
        String clientIp = servletRequest.getRemoteAddr();
        AuthResponse response = authService.authenticateAdmin(request, clientIp);
        return ResponseEntity.ok(ApiResponse.ok("Admin login successful", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal != null) {
            authService.logout(principal.getSessionId());
        }
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated", "UNAUTHORIZED"));
        }
        UserDto userDto = authService.getCurrentUserDto(principal);
        return ResponseEntity.ok(ApiResponse.ok(userDto));
    }
}
