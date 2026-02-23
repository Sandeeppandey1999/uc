import React, { useRef } from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

const MeetingCalendar = ({ 
  meetings, 
  onDateClick, 
  onEventClick, 
  onEventDrop,
  onEventResize,
  view = 'dayGridMonth'
}) => {
  const theme = useTheme();
  const calendarRef = useRef(null);
  
  const events = meetings.map(meeting => {
    // Get today's date (without time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Parse meeting dates
    const meetingStartDate = new Date(meeting.meetingScheduledDate);
    meetingStartDate.setHours(0, 0, 0, 0);
    
    const meetingEndDate = new Date(meeting.scheduledToDate || meeting.meetingScheduledDate);
    meetingEndDate.setHours(23, 59, 59, 999);
    
    // Determine color based on date with vibrant colors
    let backgroundColor, borderColor, textColor, classNames;
    
    if (meetingStartDate <= today && today <= meetingEndDate) {
      // Today's meeting - Vibrant Green
      backgroundColor = '#10b981'; // Emerald green
      borderColor = '#059669';
      textColor = '#ffffff';
      classNames = ['meeting-today'];
    } else if (meetingEndDate < today) {
      // Past meeting - Vibrant Red
      backgroundColor = '#ef4444'; // Red
      borderColor = '#dc2626';
      textColor = '#ffffff';
      classNames = ['meeting-past'];
    } else {
      // Future meeting - Vibrant Blue
      backgroundColor = '#3b82f6'; // Blue
      borderColor = '#2563eb';
      textColor = '#ffffff';
      classNames = ['meeting-future'];
    }
    
    // Build start and end date-time
    const startDateTime = `${meeting.meetingScheduledDate}T${meeting.fromTime}`;
    // For multi-day events, use the scheduledToDate with toTime
    const endDate = meeting.scheduledToDate || meeting.meetingScheduledDate;
    const endDateTime = `${endDate}T${meeting.toTime}`;
    
    return {
      id: meeting.id,
      title: meeting.roomName,
      start: startDateTime,
      end: endDateTime,
      backgroundColor,
      borderColor,
      textColor,
      classNames,
      extendedProps: {
        ...meeting,
      },
    };
  });

  const handleDateClick = (info) => {
    // Fix: Use the actual clicked date, not the previous day
    const clickedDate = new Date(info.dateStr || info.date);
    onDateClick && onDateClick(clickedDate);
  };

  const handleEventClick = (info) => {
    onEventClick && onEventClick(info.event.extendedProps);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const buildUpdatedMeeting = (info) => {
    const currentView = info.view?.type;
    const start = info.event.start;
    const end = info.event.end || start;
    const originalMeeting = info.event.extendedProps;

    if (!start) {
      return originalMeeting;
    }

    // Day view: update only times, keep original scheduled dates
    if (currentView === 'timeGridDay') {
      return {
        ...originalMeeting,
        meetingScheduledDate: originalMeeting.meetingScheduledDate,
        scheduledToDate: originalMeeting.scheduledToDate || originalMeeting.meetingScheduledDate,
        fromTime: formatTime(start),
        toTime: formatTime(end),
      };
    }

    // Month/other views: update both dates and times from dragged event position
    return {
      ...originalMeeting,
      meetingScheduledDate: formatDate(start),
      scheduledToDate: formatDate(end),
      fromTime: formatTime(start),
      toTime: formatTime(end),
    };
  };

  const handleEventDrop = (info) => {
    const updatedMeeting = buildUpdatedMeeting(info);
    onEventDrop && onEventDrop(updatedMeeting);
  };

  const handleEventResize = (info) => {
    const updatedMeeting = buildUpdatedMeeting(info);
    onEventResize && onEventResize(updatedMeeting);
  };

  return (
    <Box
      sx={{
        '& .fc': {
          fontFamily: theme.typography.fontFamily,
          fontSize: '0.95rem',
        },
        // Table borders with gradient effect
        '& .fc-theme-standard td, & .fc-theme-standard th': {
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          transition: 'all 0.2s ease',
        },
        '& .fc-theme-standard .fc-scrollgrid': {
          border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderRadius: '12px',
          overflow: 'hidden',
        },
        // Enhanced toolbar buttons
        '& .fc-toolbar': {
          marginBottom: '1.5rem',
          gap: '1rem',
        },
        '& .fc-button': {
          backgroundColor: theme.palette.primary.main,
          border: 'none',
          textTransform: 'capitalize',
          fontWeight: '600',
          fontSize: '0.9rem',
          padding: '8px 16px',
          borderRadius: '8px',
          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.25)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            transform: 'translateY(-2px)',
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.35)}`,
          },
          '&:disabled': {
            backgroundColor: alpha(theme.palette.action.disabled, 0.12),
            boxShadow: 'none',
          },
          '&:focus': {
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
          },
        },
        '& .fc-button-active': {
          backgroundColor: `${theme.palette.primary.dark} !important`,
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)} !important`,
          transform: 'scale(1.05)',
        },
        '& .fc-button-group': {
          boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.08)}`,
          borderRadius: '8px',
          overflow: 'hidden',
        },
        // Title styling
        '& .fc-toolbar-title': {
          fontSize: '1.75rem',
          fontWeight: '800',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px',
        },
        // Today cell with animation
        '& .fc-daygrid-day.fc-day-today': {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            border: `2px solid ${theme.palette.primary.main}`,
            borderRadius: '4px',
            pointerEvents: 'none',
            animation: 'pulse 2s ease-in-out infinite',
          },
          '@keyframes pulse': {
            '0%, 100%': {
              opacity: 0.5,
            },
            '50%': {
              opacity: 1,
            },
          },
        },
        // Today date number
        '& .fc-day-today .fc-daygrid-day-number': {
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '800',
          fontSize: '0.95rem',
          margin: '4px',
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
        },
        // Column headers
        '& .fc-col-header-cell': {
          background: theme.palette.mode === 'dark' 
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.grey[900], 0.9)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.15)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
          fontWeight: '700',
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          padding: '18px 8px',
          color: theme.palette.primary.main,
          borderBottom: `3px solid ${theme.palette.primary.main}`,
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          },
        },
        // Day cells hover effect
        '& .fc-daygrid-day': {
          transition: 'all 0.2s ease',
          minHeight: '120px',
          border: `2px solid ${alpha(theme.palette.divider, 0.3)} !important`,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            cursor: 'pointer',
            borderColor: `${theme.palette.primary.main} !important`,
            transform: 'scale(1.01)',
          },
        },
        // Day numbers
        '& .fc-daygrid-day-number': {
          padding: '10px',
          fontSize: '1rem',
          fontWeight: '700',
          color: theme.palette.text.primary,
          transition: 'all 0.2s ease',
          '&:hover': {
            color: theme.palette.primary.main,
            transform: 'scale(1.15)',
          },
        },
        // Time grid slots
        '& .fc-timegrid-slot': {
          height: '60px',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.02),
          },
        },
        '& .fc-timegrid-slot-label': {
          fontWeight: '500',
          fontSize: '0.85rem',
          color: theme.palette.text.secondary,
        },
        // Now indicator (current time line)
        '& .fc-timegrid-now-indicator-line': {
          borderColor: theme.palette.error.main,
          borderWidth: '2px',
          borderStyle: 'solid',
        },
        '& .fc-timegrid-now-indicator-arrow': {
          borderColor: theme.palette.error.main,
          borderWidth: '6px',
        },
        // Events with enhanced styling
        '& .fc-event': {
          cursor: 'pointer',
          border: 'none !important',
          borderRadius: '6px',
          padding: '6px 10px',
          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.15)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'visible',
          fontWeight: '600',
          '&:hover': {
            filter: 'brightness(1.1)',
            transform: 'translateY(-2px)',
            boxShadow: `0 6px 16px ${alpha(theme.palette.common.black, 0.25)}`,
            zIndex: 10,
          },
        },
        // Force consistent colors for all event segments
        '& .fc-event-main': {
          color: 'inherit !important',
        },
        '& .fc-daygrid-event': {
          borderRadius: '6px',
          marginBottom: '2px',
        },
        // Multi-day event styling - ensure color consistency
        '& .fc-daygrid-event-harness': {
          '& .fc-event': {
            borderRadius: '6px',
          },
        },
        // Force solid background color for all multi-day event segments
        '& .fc-daygrid-block-event': {
          borderRadius: '6px !important',
          '&.meeting-today': {
            backgroundColor: '#10b981 !important',
            borderColor: '#059669 !important',
            color: '#ffffff !important',
          },
          '&.meeting-past': {
            backgroundColor: '#ef4444 !important',
            borderColor: '#dc2626 !important',
            color: '#ffffff !important',
          },
          '&.meeting-future': {
            backgroundColor: '#3b82f6 !important',
            borderColor: '#2563eb !important',
            color: '#ffffff !important',
          },
        },
        // First day of multi-day event
        '& .fc-daygrid-block-event:not(.fc-event-end)': {
          borderTopRightRadius: '6px',
          borderBottomRightRadius: '6px',
        },
        // Last day of multi-day event
        '& .fc-daygrid-block-event:not(.fc-event-start)': {
          borderTopLeftRadius: '6px',
          borderBottomLeftRadius: '6px',
        },
        // Middle days of multi-day event
        '& .fc-daygrid-block-event:not(.fc-event-start):not(.fc-event-end)': {
          borderRadius: '6px',
        },
        // Today's meeting - Green with glow
        '& .meeting-today': {
          boxShadow: `0 3px 10px ${alpha('#10b981', 0.4)}, 0 0 20px ${alpha('#10b981', 0.2)}`,
          '&:hover': {
            boxShadow: `0 8px 20px ${alpha('#10b981', 0.5)}, 0 0 30px ${alpha('#10b981', 0.3)}`,
          },
        },
        // Past meeting - Red with subtle opacity
        '& .meeting-past': {
          opacity: 0.85,
          boxShadow: `0 3px 10px ${alpha('#ef4444', 0.3)}`,
          '&:hover': {
            opacity: 1,
            boxShadow: `0 8px 20px ${alpha('#ef4444', 0.4)}`,
          },
        },
        // Future meeting - Blue with glow
        '& .meeting-future': {
          boxShadow: `0 3px 10px ${alpha('#3b82f6', 0.4)}, 0 0 20px ${alpha('#3b82f6', 0.2)}`,
          '&:hover': {
            boxShadow: `0 8px 20px ${alpha('#3b82f6', 0.5)}, 0 0 30px ${alpha('#3b82f6', 0.3)}`,
          },
        },
    
        '& .fc-event-title': {
          fontWeight: '700',
          fontSize: '0.85rem',
          textShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.2)}`,
        },
        '& .fc-event-time': {
          fontWeight: '600',
          fontSize: '0.75rem',
          opacity: 0.95,
        },
   
        '& .fc-daygrid-event-dot': {
          borderColor: 'currentColor',
          borderWidth: '3px',
        },
        // List view styling
        '& .fc-list': {
          border: 'none',
        },
        '& .fc-list-event': {
          transition: 'all 0.2s ease',
          '&:hover td': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          },
        },
        '& .fc-list-event-dot': {
          borderWidth: '6px',
          borderRadius: '50%',
        },
        '& .fc-list-day-cushion': {
          backgroundColor: theme.palette.mode === 'dark'
            ? alpha(theme.palette.primary.main, 0.15)
            : alpha(theme.palette.primary.main, 0.1),
          fontWeight: '700',
          fontSize: '0.95rem',
          padding: '12px 16px',
          color: theme.palette.primary.main,
        },
        // More link (when too many events)
        '& .fc-daygrid-more-link': {
          color: theme.palette.primary.main,
          fontWeight: '700',
          fontSize: '0.8rem',
          padding: '2px 6px',
          borderRadius: '4px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.15),
            transform: 'scale(1.05)',
          },
        },
        // Popover for more events
        '& .fc-popover': {
          borderRadius: '12px',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 12px 32px ${alpha(theme.palette.common.black, 0.2)}`,
          backgroundColor: theme.palette.background.paper,
        },
        '& .fc-popover-header': {
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          padding: '12px 16px',
          fontWeight: '700',
          borderRadius: '12px 12px 0 0',
        },
        // Week numbers
        '& .fc-daygrid-week-number': {
          backgroundColor: alpha(theme.palette.secondary.main, 0.1),
          color: theme.palette.secondary.main,
          fontWeight: '700',
          borderRadius: '6px',
          padding: '4px 8px',
        },
        // Scrollbars
        '& .fc-scroller': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: alpha(theme.palette.divider, 0.05),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.primary.main, 0.3),
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.5),
            },
          },
        },
        // Empty cells
        '& .fc-daygrid-day-bg': {
          transition: 'background-color 0.2s ease',
        },
        // Weekend styling
        '& .fc-day-sat, & .fc-day-sun': {
          backgroundColor: theme.palette.mode === 'dark'
            ? alpha(theme.palette.warning.main, 0.03)
            : alpha(theme.palette.warning.main, 0.02),
        },
      }}
    >
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={view}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        }}
        events={events}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        height="auto"
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={false}
        nowIndicator={true}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: 'short',
        }}
      />
    </Box>
  );
};

export default MeetingCalendar;
