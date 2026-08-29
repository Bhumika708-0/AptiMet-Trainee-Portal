export type NotificationItem = {
  id: string;
  label: string;
  text: string;
  time: string;
  tone: 'blue' | 'red' | 'slate';
  unread?: boolean;
};

export const notifications: NotificationItem[] = [
  {
    id: 'n1',
    label: 'System Update',
    text: 'Maintenance Scheduled for Weekend. Portal will undergo routine maintenance from 02:00 to 04:00 IST on Sunday.',
    time: 'Today, 10:30 IST',
    tone: 'blue',
    unread: true,
  },
  {
    id: 'n2',
    label: 'Deadline',
    text: 'Module 2 Synoptic Chart Assignment due Friday 17:00 IST. Please upload your annotated 500 hPa isobaric analysis.',
    time: 'Tomorrow',
    tone: 'red',
    unread: true,
  },
  {
    id: 'n3',
    label: 'New Resource',
    text: 'Q3 High-Resolution Gridded Climate Data archive is now available in the shared repository for quality control exercises.',
    time: 'Yesterday',
    tone: 'slate',
    unread: false,
  },
];
