package com.javamastery.security;

import com.javamastery.entity.User;
import com.javamastery.entity.UserSession;
import com.javamastery.repository.UserRepository;
import com.javamastery.repository.UserSessionRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserSessionRepository userSessionRepository;

    public JwtAuthFilter(JwtService jwtService,
                         UserRepository userRepository,
                         UserSessionRepository userSessionRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.userSessionRepository = userSessionRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);

        try {
            if (jwtService.validateToken(jwt) && SecurityContextHolder.getContext().getAuthentication() == null) {
                UUID sessionId = jwtService.extractSessionId(jwt);
                UUID userId = jwtService.extractUserId(jwt);

                if (sessionId != null) {
                    Optional<UserSession> sessionOpt = userSessionRepository.findById(sessionId);

                    // Check if session exists, is active, and matches user
                    if (sessionOpt.isPresent()) {
                        UserSession session = sessionOpt.get();
                        if (session.isActive() && session.getUser().getId().equals(userId)) {
                            Optional<User> userOpt = userRepository.findById(userId);
                            if (userOpt.isPresent() && userOpt.get().isActive()) {
                                User user = userOpt.get();
                                UserPrincipal principal = new UserPrincipal(user, sessionId);
                                UsernamePasswordAuthenticationToken authToken =
                                        new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
                                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                                SecurityContextHolder.getContext().setAuthentication(authToken);
                            }
                        }
                    }
                }
            }
        } catch (Exception ignored) {
            // Unauthenticated request will be handled by SecurityFilterChain entrypoint
        }

        filterChain.doFilter(request, response);
    }
}
