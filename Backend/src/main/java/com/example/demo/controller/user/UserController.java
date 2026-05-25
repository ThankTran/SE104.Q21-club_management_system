package com.example.demo.controller.user;

import com.example.demo.application.dto.request.user.AdminUpdateUserRequest;
import com.example.demo.application.dto.request.user.ChangePasswordRequest;
import com.example.demo.application.dto.request.user.CreateUserRequest;
import com.example.demo.application.dto.response.user.UserResponse;
import com.example.demo.application.service.user.interfaces.UserService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        try {
            UserResponse response = userService.createUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<UserResponse> response = userService.getAllUsers();
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.getUserById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/by-member/{memberId}")
    public ResponseEntity<?> getUserByMemberId(@PathVariable Long memberId) {
        try {
            return ResponseEntity.ok(userService.getUserByMemberId(memberId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changeOwnPassword(@PathVariable Long id,
                                               @RequestBody ChangePasswordRequest request) {
        try {
            return ResponseEntity.ok(userService.changePassword(id, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/admin")
    public ResponseEntity<?> updateUserForAdmin(@PathVariable Long id,
                                                @RequestBody AdminUpdateUserRequest request) {
        try {
            return ResponseEntity.ok(userService.updatePasswordForAdmin(id, request.getNewPassword()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}/password-hash")
    public ResponseEntity<?> getPasswordHashForAdmin(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.getPasswordHashForAdmin(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
