package com.example.demo.application.service.implement.user;

import com.example.demo.application.dto.request.user.ChangePasswordRequest;
import com.example.demo.application.dto.request.user.CreateUserRequest;
import com.example.demo.application.dto.request.user.LoginRequest;
import com.example.demo.application.dto.response.user.UserPasswordResponse;
import com.example.demo.application.dto.response.user.UserResponse;
import com.example.demo.application.mapper.user.UserMapper;
import com.example.demo.domain.model.member.Member;
import com.example.demo.domain.model.user.User;
import com.example.demo.domain.repository.member.MemberRepository;
import com.example.demo.domain.repository.user.UserRepository;
import com.example.demo.domain.service.user.PasswordHasher;
import com.example.demo.domain.service.user.UserDomainService;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@CacheConfig(cacheNames = "users")
public class UserServiceImpl implements com.example.demo.application.service.interfaces.user.UserService {
    private final UserRepository userRepository;
    private final MemberRepository memberRepository;
    private final UserMapper userMapper;
    private final UserDomainService userDomainService;
    private final PasswordHasher passwordHasher;

    public UserServiceImpl(UserRepository userRepository,
                           MemberRepository memberRepository,
                           UserMapper userMapper,
                           UserDomainService userDomainService,
                           PasswordHasher passwordHasher) {
        this.userRepository = userRepository;
        this.memberRepository = memberRepository;
        this.userMapper = userMapper;
        this.userDomainService = userDomainService;
        this.passwordHasher = passwordHasher;
    }

    @Override
    @CacheEvict(allEntries = true)
    public UserResponse createUser(CreateUserRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Thong tin tao tai khoan khong duoc de trong");
        }
        userDomainService.validateCreateRequest(request.getMemberId(), request.getPassword());

        if (userRepository.existsByMemberMemberId(request.getMemberId())) {
            throw new IllegalArgumentException("Member da co tai khoan");
        }

        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay member voi ID: " + request.getMemberId()));

        User user = User.create(member, passwordHasher.hash(request.getPassword()));

        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public UserResponse login(LoginRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Thong tin dang nhap khong duoc de trong");
        }
        userDomainService.validateLoginRequest(request.getUserId(), request.getMemberId(), request.getPassword());

        User user = resolveUser(request.getUserId(), request.getMemberId());
        userDomainService.verifyLogin(user, request.getPassword());
        return userMapper.toResponse(user);
    }

    @Override
    @Cacheable(key = "'id:' + #userId")
    public UserResponse getUserById(Long userId) {
        return userMapper.toResponse(findUserById(userId));
    }

    @Override
    @Cacheable(key = "'member:' + #memberId")
    public UserResponse getUserByMemberId(Long memberId) {
        return userMapper.toResponse(findUserByMemberId(memberId));
    }

    @Override
    @Cacheable(key = "'all'")
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @Override
    @CacheEvict(allEntries = true)
    public UserResponse changePassword(Long userId, ChangePasswordRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Thong tin doi mat khau khong duoc de trong");
        }
        User user = findUserById(userId);
        userDomainService.validateChangePasswordRequest(
                request.getCurrentPassword(),
                request.getNewPassword());
        userDomainService.verifyLogin(user, request.getCurrentPassword());
        userDomainService.changePassword(user, request.getNewPassword());
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Cacheable(key = "'password:' + #userId")
    public UserPasswordResponse getPasswordHashForAdmin(Long userId) {
        return userMapper.toPasswordResponse(findUserById(userId));
    }

    @Override
    @Async("applicationTaskExecutor")
    public CompletableFuture<UserResponse> getUserByIdAsync(Long userId) {
        return CompletableFuture.completedFuture(getUserById(userId));
    }

    @Override
    @Async("applicationTaskExecutor")
    public CompletableFuture<UserResponse> getUserByMemberIdAsync(Long memberId) {
        return CompletableFuture.completedFuture(getUserByMemberId(memberId));
    }

    private User resolveUser(Long userId, Long memberId) {
        if (userId != null) {
            return findUserById(userId);
        }
        return findUserByMemberId(memberId);
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay user voi ID: " + userId));
    }

    private User findUserByMemberId(Long memberId) {
        return userRepository.findByMemberMemberId(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay tai khoan cua member ID: " + memberId));
    }
}
