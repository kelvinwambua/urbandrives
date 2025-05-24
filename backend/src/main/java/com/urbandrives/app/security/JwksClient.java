package com.urbandrives.app.security;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.OctetKeyPair;

@Component
public class JwksClient {

    private final RestTemplate restTemplate;
    private final String jwksUrl;
    private final Map<String, OctetKeyPair> keyCache = new ConcurrentHashMap<>();

    public JwksClient(@Value("${app.jwt.jwks-url}") String jwksUrl) {
        this.restTemplate = new RestTemplate();
        this.jwksUrl = jwksUrl;
    }

    public OctetKeyPair getJWK(String keyId) {
        if (keyCache.containsKey(keyId)) {
            System.out.println("Using cached JWK for keyId: " + keyId);
            return keyCache.get(keyId);
        }

        try {
            System.out.println("Fetching JWKS from: " + jwksUrl);
            String jwksJson = restTemplate.getForObject(jwksUrl, String.class);
            JWKSet jwkSet = JWKSet.parse(jwksJson);

            OctetKeyPair jwk = (OctetKeyPair) jwkSet.getKeyByKeyId(keyId);
            if (jwk == null) {
                throw new RuntimeException("Unable to find key with ID: " + keyId);
            }

            keyCache.put(keyId, jwk);
            System.out.println("Cached JWK for keyId: " + keyId);

            return jwk;
        } catch (Exception e) {
            System.err.println("Error fetching JWK from JWKS endpoint: " + e.getMessage());
            throw new RuntimeException("Error getting JWK from JWKS endpoint: " + e.getMessage(), e);
        }
    }

    public void clearCache() {
        keyCache.clear();
        System.out.println("JWKS key cache cleared");
    }
}
