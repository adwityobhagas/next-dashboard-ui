"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
// Temporary Data
// const events = [
//   {
//     id: 1,
//     title: "Lorem ipsum dolor",
//     time: "12:00 PM - 2:00 PM",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//   },
//   {
//     id: 2,
//     title: "Lorem ipsum dolor",
//     time: "12:00 PM - 2:00 PM",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//   },
//   {
//     id: 3,
//     title: "Lorem ipsum dolor",
//     time: "12:00 PM - 2:00 PM",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//   },
// ];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const router = useRouter();

  useEffect(() => {
    if (value instanceof Date) {
      router.push(`?date=${value.toLocaleDateString('en-US')}`);
    }
  }, [value, router]);
  return <Calendar onChange={onChange} value={value}/>;

  // {events.map((event) => (
  //   <div
  //     className="p-5 rounded-md border-2 border-gray-300 border-t-4 odd:border-t-blueSky even:border-t-purple"
  //     key={event.id}
  //   >
  //     <div className="flex items-center justify-between">
  //       <h1 className="font-semibold text-gray-600">{event.title}</h1>
  //       <span className="text-gray-300 text-xs">{event.time}</span>
  //     </div>
  //     <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
  //   </div>
  // ))}
};

export default EventCalendar;
