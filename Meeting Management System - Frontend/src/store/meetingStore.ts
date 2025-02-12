import { create } from "zustand";
import type { Meeting } from "../types";

interface MeetingState {
  todayMeetings: Meeting[];
  completedMeetings: Meeting[];
  scheduledMeetings: Meeting[];
  totalCompletedMeetingsPages: number;
  currentPage: number;
  itemsPerPage: number;
  addMeeting: (meeting: Meeting) => Promise<void>;
  updateMeeting: (meeting: Meeting) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;
  setCurrentPage: (page: number) => Promise<void>;
  getTodayMeetings: (status: Meeting["status"]) => Meeting[];
  getScheduledMeetings: () => Meeting[];
  getPaginatedCompletedMeetings: () => {
    meetings: Meeting[];
    totalPages: number;
    currentPage: number;
  };
  loadTodayMeetings: () => Promise<void>;
  loadScheduledMeetings: () => Promise<void>;
  loadCompletedMeetings: (page: number) => Promise<void>;
}

const isToday = (date: string) => {
  const today = new Date();
  const meetingDate = new Date(date);
  return (
    meetingDate.getDate() === today.getDate() &&
    meetingDate.getMonth() === today.getMonth() &&
    meetingDate.getFullYear() === today.getFullYear()
  );
};

// const isFuture = (date: string) => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const tomorrow = new Date(today);
//   tomorrow.setDate(tomorrow.getDate() + 1);
//   const meetingDate = new Date(date);
//   return meetingDate >= tomorrow;
// };

const removeMeeting = (id: string, meetingsArr: Meeting[]): Meeting[] => {
  return meetingsArr.filter((meeting) => meeting.id !== id);
};

const sortMeetings = (meetingsArr: Meeting[]): Meeting[] => {
  return meetingsArr.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

export const useMeetingStore = create<MeetingState>((set, get) => ({
  todayMeetings: [],
  completedMeetings: [],
  scheduledMeetings: [],
  currentPage: 1,
  itemsPerPage: 5,
  totalCompletedMeetingsPages: 0,

  loadTodayMeetings: async () => {
    try {
      const response = await fetch("http://localhost:3010/meetings/today", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        console.log(" Failed to load meetings");
        return;
      }

      const meetings = await response.json();

      console.log(meetings);
      console.log("Meetings are loaded");

      return set({ todayMeetings: sortMeetings(meetings) });
    } catch (error) {
      console.log("Failed to load meetings", error);
      return;
    }
  },

  loadScheduledMeetings: async () => {
    try {
      const response = await fetch("http://localhost:3010/meetings/scheduled", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        console.log("Failed to load meetings");
        return;
      }

      const meetings = await response.json();
      console.log(meetings);
      console.log("Meetings are loaded");

      return set({ scheduledMeetings: sortMeetings(meetings) });
    } catch (error) {
      console.log("Failed to load meetings", error);
      return;
    }
  },

  loadCompletedMeetings: async (page: number) => {
    try {
      const response = await fetch("http://localhost:3010/meetings/completed?page=" + page, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        console.log("Failed to load meetings");
        return;
      }

      const data = await response.json();
	  const meetings = data.meetings;

      console.log(meetings);
      console.log("Meetings are loaded");

      return set({ completedMeetings:  sortMeetings(meetings) , totalCompletedMeetingsPages: data.totalPages });
    } catch (error) {
      console.log("Failed to load meetings", error);
    }
  },

  addMeeting: async (meeting) => {
    try {
      const response = await fetch("http://localhost:3010/meetings", {
        method: "POST",
        body: JSON.stringify(meeting),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 201) {
        console.log("Failed to add meeting");
        return;
      }

      const newMeeting = await response.json();
      console.log(newMeeting);
      console.log("Meeting is added");

      return set((state) => {
        if (isToday(meeting.date)) {
          return {
            todayMeetings: [...state.todayMeetings, newMeeting],
          };
        } else {
          return {
            scheduledMeetings: [...state.scheduledMeetings, newMeeting],
          };
        }
      });
    } catch (error) {
      console.log("Failed to add meeting", error);  
      throw error;
    }
  },

  updateMeeting: async (updatedMeeting) => {
    try {
      const response = await fetch(`http://localhost:3010/meetings/`, {
        method: "PATCH",
        body: JSON.stringify(updatedMeeting),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        console.log("Failed to update meeting");
        return;
      }

      console.log("Meeting is updated");

	set((state) => ({
		todayMeetings: removeMeeting(updatedMeeting.id, state.todayMeetings),
		scheduledMeetings: removeMeeting(updatedMeeting.id, state.scheduledMeetings),
		completedMeetings: removeMeeting(updatedMeeting.id, state.completedMeetings),
	  }));

      if (updatedMeeting.status === "Canceled") {
        return;
      }

      if (updatedMeeting.status === "Completed") {
        return set((state) => ({
          completedMeetings: sortMeetings([
            ...state.completedMeetings,
            updatedMeeting,
          ]),
        }));
      }

      if (isToday(updatedMeeting.date)) {
        return set((state) => ({
          todayMeetings: sortMeetings([...state.todayMeetings, updatedMeeting]),
        }));
      }

      updatedMeeting.status = "Expected";
      return set((state) => ({
        scheduledMeetings: sortMeetings([
          ...state.scheduledMeetings,
          updatedMeeting,
        ]),
      }));

    } catch (error) {
      console.log("Failed to update meeting", error);
      return;
    }
  },

  deleteMeeting: async (id) => {
    try {
      const response = await fetch(`http://localhost:3010/meetings/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200 && response.status !== 404) {
        console.log("Failed to delete meeting");
        return;
      }

      console.log("Meeting with id:" + id + " is DELETED");

      return set((state) => ({
        todayMeetings: removeMeeting(id, state.todayMeetings),
        scheduledMeetings: removeMeeting(id, state.scheduledMeetings),
      }));
    } catch (error) {
      console.log("Failed to delete meeting", error);
      return;
    }
  },

  setCurrentPage: async (page) => {

	await get().loadCompletedMeetings(page);

	return set({ currentPage: page })
  },

  getTodayMeetings: (status) => {
    return get().todayMeetings.filter((meeting) => meeting.status === status);
  },

  getScheduledMeetings: () => {
    return get().scheduledMeetings;
  },

  getPaginatedCompletedMeetings: () => {
    const state = get();
    return {
      meetings: sortMeetings(state.completedMeetings),
      totalPages: state.totalCompletedMeetingsPages,
      currentPage: state.currentPage,
    };
  },
}));
