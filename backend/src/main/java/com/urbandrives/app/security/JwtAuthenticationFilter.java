
package com.urbandrives.app.security;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final String jwksUrl;

    public JwtAuthenticationFilter(String jwksUrl) {
        this.jwksUrl = jwksUrl;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("No Bearer token found");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        System.out.println("Processing token: " + token.substring(0, Math.min(20, token.length())) + "...");

        try {
            DecodedJWT jwt = JWT.decode(token);
            String kid = jwt.getKeyId();
            System.out.println("Token kid: " + kid);

            String issuer = jwt.getIssuer();
            System.out.println("Token issuer: " + issuer);

            
            if (jwt.getSignature() == null || jwt.getSignature().isEmpty()) {
                System.out.println("Invalid token signature");
                throw new JWTVerificationException("Invalid token signature");
            }

            
            if (!"http://localhost:3000".equals(issuer)) {
                System.out.println("Invalid issuer: " + issuer + ", expected: http://localhost:3000");
                throw new JWTVerificationException("Invalid issuer");
            }

         
            if (jwt.getExpiresAt() != null && jwt.getExpiresAt().getTime() < System.currentTimeMillis()) {
                System.out.println("Token expired");
                throw new JWTVerificationException("Token expired");
            }


            System.out.println("Assuming EdDSA algorithm for Ed25519 key");

            
            String username = jwt.getSubject();
            System.out.println("Authenticated user: " + username);

            
            List<String> roles = null;
            try {
                roles = jwt.getClaim("roles").asList(String.class);
                System.out.println("Roles: " + (roles != null ? roles : "none"));
            } catch (Exception e) {
                System.out.println("No roles found in token");
            }

            List<SimpleGrantedAuthority> authorities = roles != null ?
                roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList()) :
                List.of();

            UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(username, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println("Authentication successful!");

        } catch (JWTVerificationException e) {
            System.out.println("JWT Verification error: " + e.getMessage());
            SecurityContextHolder.clearContext();
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e.getMessage());
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
