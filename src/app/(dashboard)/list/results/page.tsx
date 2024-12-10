import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

// type results = {
//   id: number;
//   subject: string;
//   class: string;
//   teacher: string;
//   student: string;
//   date: string;
//   type: "exam" | "assignment ";
//   score: number;
// };

const { userId, sessionClaims } = await auth();
const role = (sessionClaims?.metadata as { role?: string })?.role;
const currentUserId = userId;

type ResultList = {
  id: number;
  title: string;
  studentName: string;
  studentSurName: string;
  teacherName: string;
  teacherSurName: string;
  score: number;
  className: string;
  startTime: Date;
};

const columns = [
  {
    header: "Title",
    accessor: "title",
    className: "md:table-cell",
  },
  {
    header: "Student",
    accessor: "student",
    className: "hidden md:table-cell lg:table-cell",
  },
  {
    header: "Score",
    accessor: "score",
    className: "hidden md:table-cell lg:table-cell",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell lg:table-cell",
  },
  {
    header: "Class",
    accessor: "class",
    className: "md:table-cell lg:table-cell",
  },
  {
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell lg:table-cell",
  },
  ...(role === "admin" || role === "teacher"
    ? [
        {
          header: "Actions",
          accessor: "actions",
        },
      ]
    : []),
];

const renderRow = (item: ResultList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight"
  >
    <td className="flex items-center gap-4 p-4">{item.title}</td>
    <td className="md:table-cell">
      {item.studentName + " " + item.studentSurName}
    </td>
    <td className="hidden md:table-cell">{item.score}</td>
    <td className="hidden md:table-cell">
      {item.teacherName + " " + item.teacherSurName}
    </td>
    <td className="hidden md:table-cell">{item.className}</td>
    <td className="hidden md:table-cell">
      {new Intl.DateTimeFormat("en-us").format(item.startTime)}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {/* <Link href={`/list/results/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blueSky">
            <Image src="/view.png" alt="" width={16} height={16} />
          </button>
        </Link> */}
        {/* <button className="w-7 h-7 flex items-center justify-center rounded-full bg-purple">
            <Image src="/delete.png" alt="" width={16} height={16} />
          </button> */}
        {(role === "admin" || role === "teacher") && (
          <>
            <FormModal table="result" type="update" data={item} />
            <FormModal table="result" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

const ResultListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // console.log(searchParams)
  const { page, ...queryParams } = searchParams;

  // URL PARAMS CONDITION

  const query: Prisma.ResultWhereInput = {};

  // Method for preventing direct query
  // need define who has the authority to acces those query
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined)
        switch (key) {
          case "studentId":
            query.studentId = value;
            break;
          case "search":
            // query.name = { contains: value, mode: "insensitive" };
            // query.OR = [
            //   { subject: { name: { contains: value, mode: "insensitive" } } },
            //   { teacher: { name: { contains: value, mode: "insensitive" } } },
            //   {
            //     teacher: { surName: { contains: value, mode: "insensitive" } },
            //   },
            //   { name: { contains: value, mode: "insensitive" } },
            // ];
            query.OR = [
              {
                exam: { title: { contains: value, mode: "insensitive" } },
                student: {
                  name: { contains: value, mode: "insensitive" },
                },
              },
            ];
            break;
          default:
            break;
        }
    }
  }

  // ROLE CONDITIONS
  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.OR = [
        { exam: { lesson: { teacherId: currentUserId! } } },
        { assignment: { lesson: { teacherId: currentUserId! } } },
      ];
      break;
    case "student":
      query.studentId = currentUserId!;
      break;
    case "parent":
      query.student = {
        parentId: currentUserId!,
      };
      break;
    default:
      break;
  }

  const p = page ? parseInt(page) : 1;

  const [dataRes, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: { select: { name: true, surName: true } },
        exam: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surName: true } },
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surName: true } },
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.result.count({ where: query }),
  ]);

  const data = dataRes.map((item) => {
    const assestment = item.exam || item.assignment;

    if (!assestment) return null;

    const isExam = "startTime" in assestment;

    return {
      id: item.id,
      title: assestment.title,
      studentName: item.student.name,
      studentSurName: item.student.surName,
      teacherName: assestment.lesson.teacher.name,
      teacherSurName: assestment.lesson.teacher.surName,
      score: item.score,
      className: assestment.lesson.class.name,
      startTime: isExam ? assestment.startTime : assestment.startDate,
    };
  });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
                <Image src="/plus.png" alt="" width={14} height={14} />
              </button> */}
            {(role === "admin" || role === "teacher") && (
              <FormModal table="result" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ResultListPage;
