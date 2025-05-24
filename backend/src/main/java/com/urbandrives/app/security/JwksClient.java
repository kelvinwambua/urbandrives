package com.urbandrives.app.security;

import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.OctetKeyPair;

@Component
public class JwksClient {

    private final RestTemplate restTemplate;
    private final String jwksUrl;
    private final Map<String, PublicKey> keyCache = new HashMap<>();

    public JwksClient() {
        this.restTemplate = new RestTemplate();
        this.jwksUrl = "http://localhost:3000/api/auth/jwks";
    }

    public PublicKey getPublicKey(String keyId) {
        if (keyCache.containsKey(keyId)) {
            return keyCache.get(keyId);
        }

        try {
            String jwksJson = restTemplate.getForObject(jwksUrl, String.class);
            JWKSet jwkSet = JWKSet.parse(jwksJson);

            OctetKeyPair jwk = (OctetKeyPair) jwkSet.getKeyByKeyId(keyId);
            if (jwk == null) {
                throw new RuntimeException("Unable to find key with ID: " + keyId);
            }


            byte[] publicKeyBytes = jwk.getDecodedX();


            PublicKey publicKey = KeyFactory.getInstance("Ed25519").generatePublic(
                new X509EncodedKeySpec(publicKeyBytes)
            );

            keyCache.put(keyId, publicKey);
            return publicKey;
        } catch (Exception e) {
            throw new RuntimeException("Error getting public key from JWKS endpoint: " + e.getMessage(), e);
        }
    }
}
