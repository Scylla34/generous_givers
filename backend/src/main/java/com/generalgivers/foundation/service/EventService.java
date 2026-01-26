package com.generalgivers.foundation.service;

import com.generalgivers.foundation.dto.event.EventRequest;
import com.generalgivers.foundation.dto.event.EventResponse;
import com.generalgivers.foundation.entity.Event;
import com.generalgivers.foundation.entity.NotificationType;
import com.generalgivers.foundation.entity.User;
import com.generalgivers.foundation.exception.ResourceNotFoundException;
import com.generalgivers.foundation.repository.EventRepository;
import com.generalgivers.foundation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getEventsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return eventRepository.findEventsBetweenDates(startDate, endDate).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return mapToResponse(event);
    }

    @Transactional
    public EventResponse createEvent(EventRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .startDateTime(request.getStartDateTime())
                .endDateTime(request.getEndDateTime())
                .colorCategory(request.getColorCategory() != null ? request.getColorCategory() : "blue")
                .reminderMinutes(request.getReminderMinutes() != null ? request.getReminderMinutes() : 15)
                .createdBy(user)
                .build();

        event = eventRepository.save(event);
        log.info("Created event: {} by user: {}", event.getTitle(), userEmail);

        notificationService.createGlobalNotification(
                "New Event Created",
                String.format("Event '%s' has been scheduled for %s", event.getTitle(), 
                        event.getStartDateTime().toLocalDate()),
                NotificationType.EVENT_CREATED
        );

        return mapToResponse(event);
    }

    @Transactional
    public EventResponse updateEvent(UUID id, EventRequest request, String userEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartDateTime(request.getStartDateTime());
        event.setEndDateTime(request.getEndDateTime());
        event.setColorCategory(request.getColorCategory() != null ? request.getColorCategory() : event.getColorCategory());
        event.setReminderMinutes(request.getReminderMinutes() != null ? request.getReminderMinutes() : event.getReminderMinutes());
        event.setReminderSent(false); // Reset reminder if time changed

        event = eventRepository.save(event);
        log.info("Updated event: {} by user: {}", event.getTitle(), userEmail);

        notificationService.createGlobalNotification(
                "Event Updated",
                String.format("Event '%s' has been updated", event.getTitle()),
                NotificationType.EVENT_UPDATED
        );

        return mapToResponse(event);
    }

    @Transactional
    public void deleteEvent(UUID id, String userEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        String eventTitle = event.getTitle();
        eventRepository.delete(event);
        log.info("Deleted event: {} by user: {}", eventTitle, userEmail);

        notificationService.createGlobalNotification(
                "Event Deleted",
                String.format("Event '%s' has been deleted", eventTitle),
                NotificationType.EVENT_DELETED
        );
    }

    @Scheduled(fixedRate = 300000) // Run every 5 minutes
    @Transactional
    public void sendEventReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime reminderTime = now.plusHours(1); // Check for events in next hour

        List<Event> eventsNeedingReminders = eventRepository.findEventsNeedingReminders(now, reminderTime);

        for (Event event : eventsNeedingReminders) {
            long minutesUntilEvent = java.time.Duration.between(now, event.getStartDateTime()).toMinutes();
            
            if (minutesUntilEvent <= event.getReminderMinutes()) {
                notificationService.createGlobalNotification(
                        "Event Reminder",
                        String.format("Event '%s' starts in %d minutes", event.getTitle(), minutesUntilEvent),
                        NotificationType.EVENT_REMINDER
                );

                event.setReminderSent(true);
                eventRepository.save(event);
                log.info("Sent reminder for event: {}", event.getTitle());
            }
        }
    }

    private EventResponse mapToResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .startDateTime(event.getStartDateTime())
                .endDateTime(event.getEndDateTime())
                .colorCategory(event.getColorCategory())
                .reminderMinutes(event.getReminderMinutes())
                .reminderSent(event.getReminderSent())
                .createdById(event.getCreatedBy().getId())
                .createdByName(event.getCreatedBy().getName())
                .createdAt(event.getCreatedAt())
                .build();
    }
}