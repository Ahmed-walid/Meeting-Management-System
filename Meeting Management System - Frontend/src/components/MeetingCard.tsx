import React from "react";
import { Clock } from "lucide-react";
import type { MeetingCardProps } from "../types";

export function MeetingCard({
	meeting,
	onDelete,
	onEdit,
	onStatusChange,
}: MeetingCardProps) {

  
	const getPriorityText = (priority: string) => {
		switch (priority) {
			case "High":
				return "عالية";
			case "Medium":
				return "متوسطة";
			case "Low":
				return "منخفضة";
			default:
				return priority;
		}
	};

	const getButtons = () => {
		switch (meeting.status) {
			case "Expected":
				return (
					<>
						<button
							onClick={() => onDelete(meeting.id)}
							className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md ml-2"
						>
							إلغاء الاجتماع
						</button>
						<button
							onClick={() => onEdit(meeting)}
							className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md ml-2"
						>
							تعديل الاجتماع
						</button>
						<button
							onClick={() => onStatusChange(meeting, "Waiting")}
							className="px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md"
						>
							حضر الآن
						</button>
					</>
				);
			case "Waiting":
				return (
					<>
						<button
							onClick={() => onDelete(meeting.id)}
							className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md ml-2"
						>
							إلغاء الاجتماع
						</button>
						<button
							onClick={() => onEdit(meeting)}
							className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md ml-2"
						>
							تعديل الاجتماع
						</button>
						<button
							onClick={() => onStatusChange(meeting, "Running")}
							className="px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md"
						>
							سماح بالدخول
						</button>
					</>
				);
			case "Running":
				return (
					<button
						onClick={() => onStatusChange(meeting, "Completed")}
						className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
					>
						إنهاء الاجتماع
					</button>
				);
			default:
				return null;
		}
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow-md mb-4">
			<div className="flex justify-between items-start mb-3">
				<h3 className="text-lg font-semibold">{meeting.title}</h3>
				<span
					className={`px-2 py-1 rounded text-sm ${
						meeting.priority === "High"
							? "bg-red-100 text-red-800"
							: meeting.priority === "Medium"
							? "bg-yellow-100 text-yellow-800"
							: "bg-green-100 text-green-800"
					}`}
				>
					{getPriorityText(meeting.priority)}
				</span>
			</div>

			<div className="space-y-2">
				<div className="flex items-center text-gray-600">
					<Clock size={16} className="ml-2" />
					{new Date(meeting.date).toLocaleString("en")}
				</div>

				<div className="text-sm text-gray-600">
					<strong>الحضور:</strong>
					<ul className="mr-4 text-lg">
						{meeting.participants.map((participant, index) => (
							<li key={index}>
								{participant.position} - {participant.name}
							</li>
						))}
					</ul>
				</div>

				{meeting.notes && (
					<div className="text-sm text-gray-600">
						<strong>ملاحظات:</strong>
						<p className="mr-4">{meeting.notes}</p>
					</div>
				)}
			</div>

			<div className="mt-4 flex justify-end">{getButtons()}</div>
		</div>
	);
}
