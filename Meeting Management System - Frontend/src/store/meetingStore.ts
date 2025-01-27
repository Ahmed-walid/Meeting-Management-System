import { create } from "zustand";
import type { Meeting } from "../types";

interface MeetingState {
	meetings: Meeting[];
	currentPage: number;
	itemsPerPage: number;
	addMeeting: (meeting: Meeting) => void;
	updateMeeting: (meeting: Meeting) => void;
	deleteMeeting: (id: string) => void;
	updateMeetingStatus: (id: string, status: Meeting["status"]) => void;
	setCurrentPage: (page: number) => void;
	getTodayMeetings: (status: Meeting["status"]) => Meeting[];
	getScheduledMeetings: () => Meeting[];
	getCompletedMeetings: () => Meeting[];
	getPaginatedCompletedMeetings: () => {
		meetings: Meeting[];
		totalPages: number;
		currentPage: number;
	};
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

const isFuture = (date: string) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);
	const meetingDate = new Date(date);
	return meetingDate >= tomorrow;
};

export const useMeetingStore = create<MeetingState>((set, get) => ({
	meetings: [],
	currentPage: 1,
	itemsPerPage: 5,

	addMeeting: (meeting) =>
		set((state) => ({
			meetings: [...state.meetings, meeting],
		})),

	updateMeeting: (updatedMeeting) =>
		set((state) => ({
			meetings: state.meetings.map((meeting) =>
				meeting.id === updatedMeeting.id ? updatedMeeting : meeting
			),
		})),

	deleteMeeting: async (id) => {
	
    await fetch(`http://localhost:3010/meetings/${id}`,{
      method:'DELETE',
      headers:{
        "Content-Type": "application/json"
      }
    });

    console.log("Meeting with id:" + id + " is DELETED");

    return set((state) => ({
		  	meetings: state.meetings.filter((meeting) => meeting.id !== id),
		  }))
  
  },

	updateMeetingStatus: (id, status) =>
		set((state) => ({
			meetings: state.meetings.map((meeting) =>
				meeting.id === id
					? {
							...meeting,
							status,
							...(status === "Completed"
								? {
										endTime: new Date().toISOString(),
										duration: Math.round(
											(Date.now() - new Date(meeting.date).getTime()) / 60000
										),
								  }
								: {}),
					  }
					: meeting
			),
		})),

	setCurrentPage: (page) => set({ currentPage: page }),

	getTodayMeetings: (status) => {
		const state = get();
		return state.meetings.filter(
			(meeting) => meeting.status === status && isToday(meeting.date)
		);
	},

	getScheduledMeetings: () => {
		const state = get();
		return state.meetings.filter(
			(meeting) => meeting.status === "Expected" && isFuture(meeting.date)
		);
	},

	getCompletedMeetings: () => {
		const state = get();
		return state.meetings
			.filter((meeting) => meeting.status === "Completed")
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	},

	getPaginatedCompletedMeetings: () => {
		const state = get();
		const completedMeetings = state.getCompletedMeetings();
		const totalPages = Math.ceil(completedMeetings.length / state.itemsPerPage);
		const start = (state.currentPage - 1) * state.itemsPerPage;
		const end = start + state.itemsPerPage;

		return {
			meetings: completedMeetings.slice(start, end),
			totalPages,
			currentPage: state.currentPage,
		};
	},
}));
