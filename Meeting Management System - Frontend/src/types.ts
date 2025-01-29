export interface Meeting {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  participants: Array<{
    name: string;
    position: string;
  }>;
  notes: string;
  date: string;
  status: 'Expected' | 'Waiting' | 'Running' | 'Completed' | 'Canceled';
  endTime?: string;
  duration?: number;
}

export interface MeetingCardProps {
  meeting: Meeting;
  onDelete: (id: string) => void;
  onEdit: (meeting: Meeting) => void;
  onStatusChange: (oldMeeting: Meeting, newStatus: Meeting['status']) => void;
}