package com.example.demo.application.service.notification.interfaces;

import com.example.demo.domain.model.member.Member;
import java.util.Collection;

public interface NotificationDispatchService {
    void toManagers(String title, String content, String targetType, Member sender);

    void toApprovedActiveMembers(String title, String content, String targetType, Member sender);

    void toMembers(Collection<Member> members, String title, String content, String targetType, Member sender);

    void toManagersAndMembers(Collection<Member> members, String title, String content, String targetType, Member sender);
}
