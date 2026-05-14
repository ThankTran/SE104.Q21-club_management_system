package com.example.demo.application.service.implement.event;

import com.example.demo.application.dto.request.event.EventRoleRequest;
import com.example.demo.application.dto.response.event.EventRoleResponse;
import com.example.demo.application.mapper.event.EventRoleMapper;
import com.example.demo.domain.repository.event.EventRoleRepository;
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
@CacheConfig(cacheNames = "eventRoles")
public class EventRoleServiceImpl implements com.example.demo.application.service.interfaces.event.EventRoleService {
    private final EventRoleRepository eventRoleRepository;
    private final EventRoleMapper eventRoleMapper;

    public EventRoleServiceImpl(EventRoleRepository eventRoleRepository, EventRoleMapper eventRoleMapper) {
        this.eventRoleRepository = eventRoleRepository;
        this.eventRoleMapper = eventRoleMapper;
    }

    @CacheEvict(allEntries = true)
    public EventRoleResponse create(EventRoleRequest request) {
        return eventRoleMapper.toResponse(eventRoleRepository.save(eventRoleMapper.toEntity(request)));
    }

    @Cacheable(key = "'all'")
    public List<EventRoleResponse> getAll() {
        return eventRoleRepository.findAll().stream().map(eventRoleMapper::toResponse).toList();
    }

    @Cacheable(key = "'name:' + #roleName")
    public EventRoleResponse getByName(String roleName) {
        return eventRoleRepository.findByRoleNameIgnoreCase(roleName).map(eventRoleMapper::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy vai trò sự kiện: " + roleName));
    }

    @Async("applicationTaskExecutor")
    public CompletableFuture<List<EventRoleResponse>> getAllAsync() {
        return CompletableFuture.completedFuture(getAll());
    }
}
