import React from "react";
import { X } from "lucide-react";
import type { Meeting } from "../types";

interface MeetingDetailsProps {
  meeting: Meeting;
  onClose: () => void;
  onEdit?: (meeting: Meeting) => void;
}

export function MeetingDetails({
  meeting,
  onClose,
  onEdit,
}: MeetingDetailsProps) {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
          <h2 className="text-xl font-semibold">تفاصيل الاجتماع</h2>
        </div>

        <div className="space-y-4 text-right">
          <div>
            <h3 className="text-sm font-medium text-gray-700">العنوان</h3>
            <p className="mt-1 text-lg">{meeting.title}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">
              التاريخ والوقت
            </h3>
            <p className="mt-1">
              {new Date(meeting.date).toLocaleString("en")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">الأولوية</h3>
            <span
              className={`inline-block mt-1 px-2 py-1 rounded text-sm ${
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

          <div>
            <h3 className="text-sm font-medium text-gray-700">الحضور</h3>
            <ul className="mt-1 space-y-2">
              {meeting.participants.map((participant, index) => (
                <li key={index} className="flex justify-end gap-2">
                  <span>{participant.position}</span>
                  <span className="text-gray-500">-</span>
                  <span>{participant.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">ملاحظات</h3>
            {meeting.notes && <p className="mt-1">{meeting.notes}</p>}
          </div>

          {meeting.status === "Completed" && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                مدة الاجتماع
              </h3>
              <p className="mt-1">{meeting.duration} دقيقة</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          {onEdit && meeting.status !== "Completed" && (
            <button
              onClick={() => onEdit(meeting)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              تعديل الاجتماع
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
