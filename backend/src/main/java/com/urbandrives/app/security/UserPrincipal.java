package com.urbandrives.app.security;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserPrincipal {
    private String id;
    private String email;
    private String name;
    private String image;
    private Boolean emailVerified;
    private List<String> roles;
    private Date createdAt;
    private Date updatedAt;
    private Boolean banned;
    private String banReason;
    private Date banExpires;
}
