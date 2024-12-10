import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
// import { role, announcementsData } from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Announcement, Class, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

// type announcements = {
//   id: number;
//   title: string;
//   class: string;
//   date: string;
// };

type AnnouncementList = Announcement & { class: Class };

const { userId, sessionClaims } = await auth();
const role = (sessionClaims?.metadata as { role?: string })?.role;
const currentUserId = userId;

const columns = [
  {
    header: "Title",
    accessor: "title",
    className: "md:table-cell",
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
  ...(role === "admin"
    ? [
        {
          header: "Actions",
          accessor: "actions",
        },
      ]
    : []),
];

const renderRow = (item: AnnouncementList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight"
  >
    <td className="flex items-center gap-4 p-4">{item.title}</td>
    <td className="md:table-cell">{item.class?.name || "-"}</td>
    <td className="hidden md:table-cell">
      {new Intl.DateTimeFormat("en-us").format(item.date)}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {/* <Link href={`/list/announcements/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blueSky">
            <Image src="/view.png" alt="" width={16} height={16} />
          </button>
        </Link> */}
        {/* <button className="w-7 h-7 flex items-center justify-center rounded-full bg-purple">
          <Image src="/delete.png" alt="" width={16} height={16} />
        </button> */}
        {role === "admin" && (
          <>
            <FormModal table="announcement" type="update" data={item} />
            <FormModal table="announcement" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);
const AnnouncementListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // console.log(searchParams)
  const { page, ...queryParams } = searchParams;

  // URL PARAMS CONDITION

  const query: Prisma.AnnouncementWhereInput = {};

  // Method for preventing direct query
  // need define who has the authority to acces those query
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined)
        switch (key) {
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
            query.title = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
    }
  }

  // ROLE CONDITIONS v2.0
  const roleConditions = {
    teacher: { lessons: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { id: currentUserId! } } },
    parent: { students: { some: { parentId: currentUserId! } } },
  };

  query.OR = [
    { classId: null },
    {
      class: roleConditions[role as keyof typeof roleConditions] || {},
    },
  ];

  const p = page ? parseInt(page) : 1;

  const [data, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.announcement.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
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
            {role === "admin" && (
              <FormModal table="announcement" type="create" />
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

export default AnnouncementListPage;
