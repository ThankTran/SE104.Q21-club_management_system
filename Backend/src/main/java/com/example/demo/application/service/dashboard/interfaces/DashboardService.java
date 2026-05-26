package com.example.demo.application.service.dashboard.interfaces;

import java.util.List;
import java.util.Map;

public interface DashboardService {
    Map<String, Object> getOverview();

    List<Map<String, Object>> getStats();

    List<Map<String, Object>> getNotifications();
}
