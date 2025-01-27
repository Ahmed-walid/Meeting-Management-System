import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Meeting } from "../types";

interface MeetingFormProps {
	meeting?: Meeting;
	onSubmit: (meeting: Omit<Meeting, "id" | "status">) => void;
	onClose: () => void;
}

export function MeetingForm({ meeting, onSubmit, onClose }: MeetingFormProps) {
	const getCurrentDateTime = () => {
		const now = new Date();
		// Format: YYYY-MM-DDTHH:MM
		const year = now.getFullYear();
		const month = now.getMonth() + 1;
		const day = now.getDate();
		const hours = now.getHours();
		const minutes = now.getMinutes();
		return `${year}-${month.toString().padStart(2, "0")}-${day
			.toString()
			.padStart(2, "0")}T${hours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}`;
	};

	const [formData, setFormData] = useState({
		title: "",
		priority: "Medium" as Meeting["priority"],
		date: getCurrentDateTime(),
		notes: "",
		participants: [{ name: "", position: "" }],
	});

	useEffect(() => {
		if (meeting) {
			setFormData({
				title: meeting.title,
				priority: meeting.priority,
				date: meeting.date,
				notes: meeting.notes,
				participants: meeting.participants,
			});
		}
	}, [meeting]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	const handleAttendeeChange = (
		index: number,
		field: "name" | "position",
		value: string
	) => {
		const newAttendees = [...formData.participants];
		newAttendees[index] = { ...newAttendees[index], [field]: value };
		setFormData({ ...formData, participants: newAttendees });
	};

	const addAttendee = () => {
		setFormData({
			...formData,
			participants: [...formData.participants, { name: "", position: "" }],
		});
	};

	const removeAttendee = (index: number) => {
		const newAttendees = formData.participants.filter((_, i) => i !== index);
		setFormData({ ...formData, participants: newAttendees });
	};

	// const getPriorityText = (priority: string) => {
	//   switch (priority) {
	//     case 'High':
	//       return 'عالية';
	//     case 'Medium':
	//       return 'متوسطة';
	//     case 'Low':
	//       return 'منخفضة';
	//     default:
	//       return priority;
	//   }
	// };

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">
						{meeting ? "تعديل الاجتماع" : "اجتماع جديد"}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
					>
						<X size={24} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							العنوان
						</label>
						<input
							type="text"
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							الأولوية
						</label>
						<select
							value={formData.priority}
							onChange={(e) =>
								setFormData({
									...formData,
									priority: e.target.value as Meeting["priority"],
								})
							}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						>
							<option value="High">عالية</option>
							<option value="Medium">متوسطة</option>
							<option value="Low">منخفضة</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							التاريخ والوقت
						</label>
						<input
							type="datetime-local"
							value={formData.date}
							onChange={(e) =>
								setFormData({ ...formData, date: e.target.value })
							}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							ملاحظات
						</label>
						<textarea
							value={formData.notes}
							onChange={(e) =>
								setFormData({ ...formData, notes: e.target.value })
							}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							rows={3}
						/>
					</div>

					<div>
						<div className="flex justify-between items-center mb-2">
							<label className="block text-sm font-medium text-gray-700">
								الحضور
							</label>
							<button
								type="button"
								onClick={addAttendee}
								className="text-sm text-blue-600 hover:text-blue-700"
							>
								إضافة حضور
							</button>
						</div>
						{formData.participants.map((participant, index) => (
							<div key={index} className="flex gap-2 mb-2">
								<input
									type="text"
									placeholder="المنصب"
									value={participant.position}
									onChange={(e) =>
										handleAttendeeChange(index, "position", e.target.value)
									}
									className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									required
								/>

								<input
									type="text"
									placeholder="الاسم"
									value={participant.name}
									onChange={(e) =>
										handleAttendeeChange(index, "name", e.target.value)
									}
									className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									required
								/>

								{formData.participants.length > 1 && (
									<button
										type="button"
										onClick={() => removeAttendee(index)}
										className="text-red-600 hover:text-red-700"
									>
										<X size={20} />
									</button>
								)}
							</div>
						))}
					</div>

					<div className="flex justify-end space-x-2">
						<button
							type="submit"
							className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md ml-2"
						>
							{meeting ? "تحديث" : "إنشاء"}
						</button>
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
						>
							إلغاء
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
