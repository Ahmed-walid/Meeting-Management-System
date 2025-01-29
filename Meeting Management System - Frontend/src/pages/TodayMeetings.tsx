import React, { useState } from "react";
import { Plus } from "lucide-react";
import { MeetingCard } from "../components/MeetingCard";
import { MeetingForm } from "../components/MeetingForm";
import { useMeetingSound } from "../hooks/useSound";
import { useMeetingStore } from "../store/meetingStore";
import type { Meeting } from "../types";
import { useEffect } from "react";

export default function TodayMeetings() {
  type MeetingsState = {
    expected: Meeting[];
    waiting: Meeting[];
    running: Meeting[];
  };

  const [meetings, setMeetings] = useState<MeetingsState>({
    expected: [],
    waiting: [],
    running: [],
  });

  const [showForm, setShowForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | undefined>();
  const { playMoveSound, playAddSound } = useMeetingSound();

  const {
    addMeeting,
    updateMeeting,
    deleteMeeting,
    // updateMeetingStatus,
    getTodayMeetings,
    loadTodayMeetings,
  } = useMeetingStore();

  useEffect(() => {
    const fetchMeetings = async () => {
      await loadTodayMeetings();
      updateMeetings();
    };

    fetchMeetings();
  }, []);

  const updateMeetings = () => {
    setMeetings({
      expected: getTodayMeetings("Expected"),
      waiting: getTodayMeetings("Waiting"),
      running: getTodayMeetings("Running"),
    });
  };

  const handleAddMeeting = async (
    meetingData: Omit<Meeting, "id" | "status">
  ) => {
    const newMeeting: Meeting = {
      ...meetingData,
      id: "",
      status: "Expected",
    };

    try {
      await addMeeting(newMeeting);
    } catch (error) {
      console.error("Failed to add meeting", error);
    }

    setShowForm(false);
    updateMeetings();
    playAddSound();
  };

  const handleDeleteMeeting = async (id: string) => {
    try {
      await deleteMeeting(id);
    } catch (error) {
      console.error("Failed to delete meeting", error);
    }
    updateMeetings();
    playMoveSound();
  };

  const handleEditMeeting = async (
    meetingData: Omit<Meeting, "id" | "status">
  ) => {
    if (!editingMeeting) return;

    if (new Date(meetingData.date) > new Date()) {
      editingMeeting.status = "Expected";
    }

    const updatedMeeting = {
      ...editingMeeting,
      ...meetingData,
    };
    try {
      await updateMeeting(updatedMeeting);
    } catch (error) {
      console.log("Failed to update meeting", error);
    }
    setEditingMeeting(undefined);
    updateMeetings();
  };

  const handleStatusChange = async (
    oldMeeting: Meeting,
    newStatus: Meeting["status"]
  ) => {
    // updateMeetingStatus(id, newStatus);

    const newMeeting = {
      ...oldMeeting,
      status: newStatus,
    };

    try {
      await updateMeeting(newMeeting);
    } catch (error) {
      console.log("Failed to update meeting", error);
    }

    updateMeetings();
    playMoveSound();
  };

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
          <h3 className="text-lg font-medium mb-4 text-right">
            الاجتماعات المتوقعة اليوم
          </h3>
          <div className="space-y-4">
            {meetings.expected.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onDelete={handleDeleteMeeting}
                onEdit={setEditingMeeting}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>

        {/* Two Column Layout for Waiting and In Meeting */}
        <div className="w-2/3 grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium mb-4 text-right">
              في قائمة الانتظار
            </h3>
            <div className="space-y-4">
              {meetings.waiting.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onDelete={handleDeleteMeeting}
                  onEdit={setEditingMeeting}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium mb-4 text-right">
              في اجتماع مع المدير
            </h3>
            <div className="space-y-4">
              {meetings.running.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onDelete={handleDeleteMeeting}
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
