import React, { useState } from "react";
import { useMeetingStore } from "../store/meetingStore";
import { MeetingDetails } from "../components/MeetingDetails";
import { MeetingForm } from "../components/MeetingForm";
import type { Meeting } from "../types";

export default function ScheduledMeetings() {
	const [selectedMeeting, setSelectedMeeting] = useState<Meeting | undefined>();
	const [editingMeeting, setEditingMeeting] = useState<Meeting | undefined>();
	const { getScheduledMeetings, updateMeeting } = useMeetingStore();
	const scheduledMeetings = getScheduledMeetings();

	const handleEditMeeting = (meetingData: Omit<Meeting, "id" | "status">) => {
		if (!editingMeeting) return;

		const updatedMeeting = {
			...editingMeeting,
			...meetingData,
		};
		updateMeeting(updatedMeeting);
		setEditingMeeting(undefined);
	};

	return (
		<div className="max-w-7xl mx-auto">
			<h2 className="text-2xl font-bold text-gray-900 mb-6">
				الاجتماعات المجدولة
			</h2>
			<div className="bg-white rounded-lg shadow p-6">
				<div className="overflow-x-auto">
					<table className="min-w-full">
						<thead>
							<tr className="bg-gray-50">
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
									العنوان
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
									التاريخ
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
									الأولوية
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
									ملاحظات
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
									إجراءات
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{scheduledMeetings.map((meeting) => (
								<tr key={meeting.id}>
									<td className="px-6 py-4 whitespace-nowrap text-right">
										{meeting.title}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right">
										{new Date(meeting.date).toLocaleString("en")}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right">
										<span
											className={`px-2 py-1 rounded text-sm ${
												meeting.priority === "High"
													? "bg-red-100 text-red-800"
													: meeting.priority === "Medium"
													? "bg-yellow-100 text-yellow-800"
													: "bg-green-100 text-green-800"
											}`}
										>
											{meeting.priority === "High"
												? "عالية"
												: meeting.priority === "Medium"
												? "متوسطة"
												: "منخفضة"}
										</span>
									</td>
									<td className="px-6 py-4 text-right">{meeting.notes}</td>
									<td className="px-6 py-4 whitespace-nowrap text-right">
										<button
											onClick={() => setSelectedMeeting(meeting)}
											className="text-blue-600 hover:text-blue-900 ml-4"
										>
											عرض التفاصيل
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{selectedMeeting && (
				<MeetingDetails
					meeting={selectedMeeting}
					onClose={() => setSelectedMeeting(undefined)}
					onEdit={setEditingMeeting}
				/>
			)}

			{editingMeeting && (
				<MeetingForm
					meeting={editingMeeting}
					onSubmit={handleEditMeeting}
					onClose={() => setEditingMeeting(undefined)}
				/>
			)}
		</div>
	);
}
