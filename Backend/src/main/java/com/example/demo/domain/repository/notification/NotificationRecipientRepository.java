package com.example.demo.domain.repository.notification;

import com.example.demo.domain.model.notification.NotificationRecipient;
import com.example.demo.domain.model.notification.NotificationRecipientId;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRecipientRepository extends JpaRepository<NotificationRecipient, NotificationRecipientId> {
    @EntityGraph(attributePaths = {"notification", "member"})
    List<NotificationRecipient> findByNotificationNotificationId(Long notificationId);

    @EntityGraph(attributePaths = {"notification", "member"})
    List<NotificationRecipient> findByMemberMemberId(Long memberId);

    boolean existsByNotificationNotificationId(Long notificationId);

    boolean existsByMemberMemberId(Long memberId);
}
