import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { MeetingCard } from '../components/MeetingCard';
import { MeetingForm } from '../components/MeetingForm';
import { useMeetingSound } from '../hooks/useSound';
import { useMeetingStore } from '../store/meetingStore';
import type { Meeting } from '../types';

export default function TodayMeetings() {
  const [showForm, setShowForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | undefined>();
  const { playMoveSound, playAddSound } = useMeetingSound();

  const {
    addMeeting,
    updateMeeting,
    deleteMeeting,
    updateMeetingStatus,
    getTodayMeetings
  } = useMeetingStore();

  const handleAddMeeting = (meetingData: Omit<Meeting, 'id' | 'status'>) => {
    const newMeeting: Meeting = {
      ...meetingData,
      id: '',
      status: 'Expected'
    };
    addMeeting(newMeeting);

    console.log(meetingData);
    
    fetch("http://localhost:3010/meetings",{
      method:'POST',
      body: JSON.stringify(
        meetingData
      ),
      headers: {
				"Content-Type": "application/json"
      }
    })

    setShowForm(false);
    playAddSound();
  };

  const handleEditMeeting = (meetingData: Omit<Meeting, 'id' | 'status'>) => {
    if (!editingMeeting) return;
    
    const updatedMeeting = {
      ...editingMeeting,
      ...meetingData
    };
    updateMeeting(updatedMeeting);
    setEditingMeeting(undefined);
  };

  const handleStatusChange = (id: string, newStatus: Meeting['status']) => {
    updateMeetingStatus(id, newStatus);
    playMoveSound();
  };

  const expectedMeetings = getTodayMeetings('Expected');
  const waitingMeetings = getTodayMeetings('Waiting');
  const inMeetingMeetings = getTodayMeetings('Running');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={20} className="ml-2" />
          اجتماع جديد
        </button>
      </div>

      <div className="flex gap-6">
        {/* Expected Meetings - Full Height Column */}
        <div className="w-1/3 bg-white rounded-lg shadow-lg p-6 min-h-[calc(100vh-12rem)]">
          <h3 className="text-lg font-medium mb-4 text-right">الاجتماعات المتوقعة اليوم</h3>
          <div className="space-y-4">
            {expectedMeetings.map(meeting => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onDelete={deleteMeeting}
                onEdit={setEditingMeeting}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>

        {/* Two Column Layout for Waiting and In Meeting */}
        <div className="w-2/3 grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium mb-4 text-right">في قائمة الانتظار</h3>
            <div className="space-y-4">
              {waitingMeetings.map(meeting => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onDelete={deleteMeeting}
                  onEdit={setEditingMeeting}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium mb-4 text-right">في اجتماع مع المدير</h3>
            <div className="space-y-4">
              {inMeetingMeetings.map(meeting => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onDelete={deleteMeeting}
                  onEdit={setEditingMeeting}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {(showForm || editingMeeting) && (
        <MeetingForm
          meeting={editingMeeting}
          onSubmit={editingMeeting ? handleEditMeeting : handleAddMeeting}
          onClose={() => {
            setShowForm(false);
            setEditingMeeting(undefined);
          }}
        />
      )}
    </div>
  );
}