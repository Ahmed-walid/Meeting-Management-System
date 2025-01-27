import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMeetingStore } from "../store/meetingStore";
import { MeetingDetails } from "../components/MeetingDetails";
import type { Meeting } from "../types";

export default function CompletedMeetings() {
	const [selectedMeeting, setSelectedMeeting] = useState<Meeting | undefined>();
	const { getPaginatedCompletedMeetings, setCurrentPage } = useMeetingStore();

	const { meetings, totalPages, currentPage } = getPaginatedCompletedMeetings();

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	return (
		<div className="max-w-7xl mx-auto">
			<h2 className="text-2xl font-bold text-gray-900 mb-6">
				الاجتماعات المنتهية
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
									المدة
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
							{meetings.map((meeting) => (
								<tr key={meeting.id}>
									<td className="px-6 py-4 whitespace-nowrap text-right">
										{meeting.title}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right">
										{new Date(meeting.date).toLocaleString("en")}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right">
										{meeting.duration} دقيقة
									</td>
									<td className="px-6 py-4 text-right">{meeting.notes}</td>
									<td className="px-6 py-4 whitespace-nowrap text-right">
										<button
											onClick={() => setSelectedMeeting(meeting)}
											className="text-blue-600 hover:text-blue-900"
										>
											عرض التفاصيل
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{totalPages > 1 && (
						<div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
							<div className="flex flex-1 justify-between sm:hidden">
								<button
									onClick={() => paginate(Math.max(1, currentPage - 1))}
									disabled={currentPage === 1}
									className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									السابق
								</button>
								<button
									onClick={() =>
										paginate(Math.min(totalPages, currentPage + 1))
									}
									disabled={currentPage === totalPages}
									className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									التالي
								</button>
							</div>
							<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
								<div>
									<p className="text-sm text-gray-700">
										عرض{" "}
										<span className="font-medium">
											{(currentPage - 1) * 5 + 1}
										</span>{" "}
										إلى{" "}
										<span className="font-medium">
											{Math.min(currentPage * 5, meetings.length)}
										</span>{" "}
										من <span className="font-medium">{meetings.length}</span>{" "}
										نتيجة
									</p>
								</div>
								<div>
									<nav
										className="isolate inline-flex -space-x-px rounded-md shadow-sm"
										aria-label="Pagination"
									>
										<button
											onClick={() =>
												paginate(Math.min(totalPages, currentPage + 1))
											}
											disabled={currentPage === totalPages}
											className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											<span className="sr-only">التالي</span>
											<ChevronLeft className="h-5 w-5" aria-hidden="true" />
										</button>
										{[...Array(totalPages)].map((_, index) => (
											<button
												key={index + 1}
												onClick={() => paginate(index + 1)}
												className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
													currentPage === index + 1
														? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
														: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
												}`}
											>
												{index + 1}
											</button>
										))}
										<button
											onClick={() => paginate(Math.max(1, currentPage - 1))}
											disabled={currentPage === 1}
											className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											<span className="sr-only">السابق</span>
											<ChevronRight className="h-5 w-5" aria-hidden="true" />
										</button>
									</nav>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{selectedMeeting && (
				<MeetingDetails
					meeting={selectedMeeting}
					onClose={() => setSelectedMeeting(undefined)}
				/>
			)}
		</div>
	);
}
