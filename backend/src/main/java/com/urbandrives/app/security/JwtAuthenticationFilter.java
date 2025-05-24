package com.urbandrives.app.security;

import java.io.IOException;
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
            throw new Exception("Invalid issuer");
        }

        // Verify expiration
        if (claims.getExpirationTime() != null &&
            claims.getExpirationTime().getTime() < System.currentTimeMillis()) {
            throw new Exception("Token expired");
        }

        // Extract user information
        return UserPrincipal.builder()
            .id(claims.getSubject())
            .email(claims.getStringClaim("email"))
            .name(claims.getStringClaim("name"))
            .image(claims.getStringClaim("image"))
            .emailVerified(claims.getBooleanClaim("emailVerified"))
            .roles(extractRoles(claims))
            .build();
    }

    private List<String> extractRoles(JWTClaimsSet claims) {
        try {
            return claims.getStringListClaim("roles");
        } catch (Exception e) {
            System.out.println("No roles found in token, using default role");
            return List.of("USER");
        }
    }
}
