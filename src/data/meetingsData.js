// Shared meeting data for Dashboard and Conference pages
export const dummyMeetings = [
  {
    id: 1,
    title: 'Team Standup',
    date: '2026-02-03',
    time: '09:00 AM',
    duration: '30 min',
    participants: ['John Doe', 'Sarah Smith', 'Mike Johnson'],
    type: 'daily',
    color: '#4285f4',
    status: 'upcoming',
  },
  {
    id: 2,
    title: 'Product Review',
    date: '2026-02-03',
    time: '02:00 PM',
    duration: '1 hour',
    participants: ['Alice Brown', 'Bob Wilson', 'Carol Davis'],
    type: 'meeting',
    color: '#ea4335',
    status: 'upcoming',
  },
  {
    id: 3,
    title: 'Client Presentation',
    date: '2026-02-05',
    time: '11:00 AM',
    duration: '2 hours',
    participants: ['David Lee', 'Emma White', 'Frank Miller'],
    type: 'presentation',
    color: '#34a853',
    status: 'upcoming',
  },
  {
    id: 4,
    title: 'Sprint Planning',
    date: '2026-02-07',
    time: '10:00 AM',
    duration: '1.5 hours',
    participants: ['Grace Taylor', 'Henry Clark', 'Ivy Martinez'],
    type: 'planning',
    color: '#fbbc04',
    status: 'upcoming',
  },
  {
    id: 5,
    title: 'Design Review',
    date: '2026-02-10',
    time: '03:00 PM',
    duration: '45 min',
    participants: ['Jack Anderson', 'Kate Thompson', 'Leo Garcia'],
    type: 'review',
    color: '#9c27b0',
    status: 'upcoming',
  },
  {
    id: 6,
    title: 'Quarterly Business Review',
    date: '2026-02-15',
    time: '01:00 PM',
    duration: '3 hours',
    participants: ['Mary Rodriguez', 'Nathan King', 'Olivia Wright'],
    type: 'review',
    color: '#ff5722',
    status: 'upcoming',
  },
  {
    id: 7,
    title: 'Training Session',
    date: '2026-02-18',
    time: '10:30 AM',
    duration: '2 hours',
    participants: ['Paul Scott', 'Quinn Adams', 'Rachel Baker'],
    type: 'training',
    color: '#00bcd4',
    status: 'upcoming',
  },
  {
    id: 8,
    title: 'One-on-One Meeting',
    date: '2026-02-20',
    time: '04:00 PM',
    duration: '30 min',
    participants: ['Sam Nelson', 'Tina Carter'],
    type: 'meeting',
    color: '#795548',
    status: 'upcoming',
  },
];

// Helper function to get meetings for a specific date
export const getMeetingsForDate = (date) => {
  if (!date) return [];
  // Format date as YYYY-MM-DD in local timezone
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  return dummyMeetings.filter(meeting => meeting.date === dateStr);
};

// Helper function to get today's meetings
export const getTodaysMeetings = () => {
  const today = new Date(2026, 1, 3); // Feb 3, 2026
  return getMeetingsForDate(today);
};
