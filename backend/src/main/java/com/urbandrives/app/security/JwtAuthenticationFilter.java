package com.urbandrives.app.security;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.Ed25519Verifier;
import com.nimbusds.jose.jwk.OctetKeyPair;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwksClient jwksClient;
    private final String expectedIssuer;

    public JwtAuthenticationFilter(JwksClient jwksClient, @Value("${app.jwt.issuer}") String expectedIssuer) {
        this.jwksClient = jwksClient;
        this.expectedIssuer = expectedIssuer;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("No Bearer token found in request");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            UserPrincipal userPrincipal = validateAndParseToken(token);

            List<SimpleGrantedAuthority> authorities = userPrincipal.getRoles() != null ?
                userPrincipal.getRoles().stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .collect(Collectors.toList()) :
                List.of(new SimpleGrantedAuthority("ROLE_USER"));

            UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userPrincipal, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println("Authentication successful for user: " + userPrincipal.getEmail());

        } catch (Exception e) {
            System.out.println("JWT verification failed: " + e.getMessage());
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private UserPrincipal validateAndParseToken(String token) throws Exception {
        SignedJWT signedJWT = SignedJWT.parse(token);

        String keyId = signedJWT.getHeader().getKeyID();
        if (keyId == null) {
            throw new Exception("Token missing key ID");
        }

        // Get the JWK for verification
        OctetKeyPair jwk = jwksClient.getJWK(keyId);

        // Create verifier
        JWSVerifier verifier = new Ed25519Verifier(jwk);

        // Verify signature
        if (!signedJWT.verify(verifier)) {
            throw new Exception("Invalid token signature");
        }

        JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

        // Verify issuer
        if (!expectedIssuer.equals(claims.getIssuer())) {
            throw new Exception("Invalid issuer: expected " + expectedIssuer + " but got " + claims.getIssuer());
        }

        // Verify expiration
        if (claims.getExpirationTime() != null &&
            claims.getExpirationTime().getTime() < System.currentTimeMillis()) {
            throw new Exception("Token expired");
        }

        // Check if user is banned - handle null properly
        Boolean banned = getBooleanClaimSafe(claims, "banned");
        if (Boolean.TRUE.equals(banned)) { // Only check if explicitly true
            Date banExpires = getDateClaimSafe(claims, "banExpires");
            if (banExpires == null || banExpires.getTime() > System.currentTimeMillis()) {
                throw new Exception("User is banned");
            }
        }

        // Extract user information
        return UserPrincipal.builder()
            .id(claims.getSubject())
            .email(claims.getStringClaim("email"))
            .name(claims.getStringClaim("name"))
            .image(claims.getStringClaim("image"))
            .emailVerified(getBooleanClaimSafe(claims, "emailVerified"))
            .roles(extractRoles(claims))
            .createdAt(getDateClaimSafe(claims, "createdAt"))
            .updatedAt(getDateClaimSafe(claims, "updatedAt"))
            .banned(banned)
            .banReason(claims.getStringClaim("banReason"))
            .banExpires(getDateClaimSafe(claims, "banExpires"))
            .build();
    }

    // Updated helper method to properly handle null values
    private Boolean getBooleanClaimSafe(JWTClaimsSet claims, String claimName) {
        try {
            Object claimValue = claims.getClaim(claimName);
            if (claimValue == null) {
                return null; // Explicitly return null for null values
            }

            if (claimValue instanceof Boolean) {
                return (Boolean) claimValue;
            }

            if (claimValue instanceof String) {
                String stringValue = (String) claimValue;
                if ("null".equalsIgnoreCase(stringValue)) {
                    return null;
                }
                return Boolean.parseBoolean(stringValue);
            }

            return null;
        } catch (Exception e) {
            System.out.println("Error parsing boolean claim '" + claimName + "': " + e.getMessage());
            return null;
        }
    }

    private Date getDateClaimSafe(JWTClaimsSet claims, String claimName) {
        try {
            Object claimValue = claims.getClaim(claimName);
            if (claimValue == null) {
                return null;
            }


            if (claimValue instanceof Date) {
                return (Date) claimValue;
            }


            if (claimValue instanceof String) {
                String dateString = (String) claimValue;
                if ("null".equalsIgnoreCase(dateString)) {
                    return null;
                }
                return Date.from(java.time.Instant.parse(dateString));
            }


            if (claimValue instanceof Number) {
                return new Date(((Number) claimValue).longValue() * 1000);
            }

            return null;
        } catch (Exception e) {
            System.out.println("Error parsing date claim '" + claimName + "': " + e.getMessage());
            return null;
        }
    }
    private List<String> extractRoles(JWTClaimsSet claims) {
        try {

            List<String> rolesList = claims.getStringListClaim("roles");
            if (rolesList != null && !rolesList.isEmpty()) {
                return rolesList;
            }


            String singleRole = claims.getStringClaim("role");
            if (singleRole != null) {
                return List.of(singleRole.toUpperCase());
            }


            System.out.println("No roles found in token, using default role");
            return List.of("USER");
        } catch (Exception e) {
            System.out.println("Error extracting roles from token: " + e.getMessage());
            return List.of("USER");
        }
    }
}
