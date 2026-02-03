import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardContent, Box, useTheme, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';

const CalendarRoot = styled(Card)(({ theme, ownerState }) => ({
  '& .fc': {
    '& .fc-toolbar': {
      padding: theme.spacing(2),
      backgroundColor: ownerState.darkMode 
        ? alpha(theme.palette.background.paper, 0.8)
        : alpha(theme.palette.background.default, 0.8),
      borderRadius: theme.spacing(1),
    },
    '& .fc-button': {
      backgroundColor: theme.palette.primary.main,
      border: 'none',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    '& .fc-daygrid-event': {
      cursor: 'pointer',
      transition: 'all 0.3s',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    },
  },
}));

const MeetingCalendar = ({
  events,
  onEventClick,
  selectedDate,
}) => {
  const theme = useTheme();
  const calendarRef = useRef(null);
  const [calendarType, setCalendarType] = useState('month');
  const [calendarView, setCalendarView] = useState('dayGridMonth');
  const darkMode = theme.palette.mode === 'dark';

  const customButtons = {
    weekButton: {
      text: 'Week',
      click: () => {
        setCalendarView('timeGridWeek');
        setCalendarType('week');
      },
    },
    dayButton: {
      text: 'Day',
      click: () => {
        setCalendarView('timeGridDay');
        setCalendarType('day');
      },
    },
    monthButton: {
      text: 'Month',
      click: () => {
        setCalendarView('dayGridMonth');
        setCalendarType('month');
      },
    },
  };

  const headerToolbar = {
    left: 'today prev,next',
    center: 'title',
    right: 'dayButton,weekButton,monthButton',
  };

  return (
    <CalendarRoot ownerState={{ darkMode }}>
      <CardContent sx={{ p: 2 }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={calendarView}
          initialDate={selectedDate || new Date()}
          headerToolbar={headerToolbar}
          customButtons={customButtons}
          events={events}
          eventClick={onEventClick}
          selectable={false}
          editable={false}
          droppable={false}
          nowIndicator={true}
          height="calc(100vh - 200px)"
          slotLabelFormat={{
            hour: 'numeric',
            minute: '2-digit',
            omitZeroMinute: false,
            meridiem: 'short',
          }}
        />
      </CardContent>
    </CalendarRoot>
  );
};

export default MeetingCalendar;
