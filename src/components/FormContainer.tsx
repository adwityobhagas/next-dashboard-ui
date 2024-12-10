import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};
  const { userId, sessionClaims } = await auth();
  const role = (
    sessionClaims?.metadata as {
      role?: "admin" | "teacher" | "student" | "parent";
    }
  )?.role;
  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: {
            id: true,
            name: true,
            surName: true,
          },
        });
        relatedData = { teachers: subjectTeachers };
        break;
      case "class":
        const classGrades = await prisma.grade.findMany({
          select: {
            id: true,
            level: true,
          },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: {
            id: true,
            name: true,
            surName: true,
          },
        });
        relatedData = { grades: classGrades, teachers: classTeachers };
        break;
      case "teacher":
        const teacherSubject = await prisma.subject.findMany({
          select: {
            id: true,
            name: true,
          },
        });
        relatedData = { subjects: teacherSubject };
        break;
      case "student":
        const studentGrades = await prisma.grade.findMany({
          select: {
            id: true,
            level: true,
          },
        });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        relatedData = { classes: studentClasses, grades: studentGrades };
        break;
      case "exam":
        const examLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: userId! } : {}),
          },
          select: {
            id: true,
            name: true,
          },
        });
        relatedData = { lessons: examLessons };
        break;

      case "assignment":
        const assignmentLesson = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: userId! } : {}),
          },
          select: {
            id: true,
            name: true,
          },
        });
        const assignmentSubject = await prisma.subject.findMany({
          where: {
            teachers: {
              some: {
                id: userId!,
              },
            },
          },
          select: {
            id: true,
            name: true,
          },
        });
        const assigmentClass = await prisma.class.findMany({
          where: {
            ...(role === "teacher" ? { supervisorId: userId! } : {}),
          },
          select: {
            id: true,
            name: true,
          },
        });
        relatedData = {
          assignments: assignmentLesson,
          subjects: assignmentSubject,
          classes: assigmentClass,
        };
        break;
        
      case "result":
        const resultAssignment = await prisma.assignment.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: userId! } : {}),
          },
          select: {
            id: true,
            name: true,
          },
        });
        const resultExam = await prisma.subject.findMany({
          where: {
            teachers: {
              some: {
                id: userId!,
              },
            },
          },
          select: {
            id: true,
            name: true,
          },
        });
        relatedData = {
          assignments: resultAssignment,
          exam: resultExam,
        };
        break;

      default:
        break;
    }
  }
  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
