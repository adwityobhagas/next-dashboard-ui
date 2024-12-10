import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  teachers: z.array(z.string()), // For add teacherId
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade id is required!" }),
  supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" })
    .optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First Name is required!" }),
  surName: z.string().min(1, { message: "Sur Name is required!" }),
  phone: z.string().optional(),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z
    .string()
    .min(2, { message: "Blood Type is required!" })
    .max(2, { message: "Blood Type must be at most 2 characters long!" }),
  birthday: z.coerce.date({ message: "Birthday date is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  subjects: z.array(z.string()).optional(), // Store subjectId
});

export type TeacherSchema = z.infer<typeof teacherSchema>;


export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" })
    .optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First Name is required!" }),
  surName: z.string().min(1, { message: "Sur Name is required!" }),
  phone: z.string().optional(),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z
    .string()
    .min(2, { message: "Blood Type is required!" })
    .max(2, { message: "Blood Type must be at most 2 characters long!" }),
  birthday: z.coerce.date({ message: "Birthday date is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  gradeId: z.coerce.number().min(1, {message:"Grade is required!"}),
  parentId: z.string().min(1, {message:"Parent Id is required!"}),
  classId: z.coerce.number().min(1, {message:"Class is required!"})
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Exam title is required!" }),
  startTime: z.coerce.date({message: "Start time is required!"}),
  endTime: z.coerce.date({message: "End time is required!"}),
  lessonId: z.coerce.number({message: "Lesson is required!"}),
});

export type ExamSchema = z.infer<typeof examSchema>;

export const assignmentSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Exam title is required!" }),
  startDate: z.coerce.date({message: "Start date is required!"}),
  dueDate: z.coerce.date({message: "End date is required!"}),
  lessonId: z.coerce.number({message: "Lesson is required!"}),
  subjectId: z.coerce.number({message: "Subject is required!"}),
  classId: z.coerce.number({message: "Class is required!"}),
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>;

export const resultSchema = z.object({
  id: z.coerce.number().optional(),
  score: z.coerce.number({message: "Score is required!"}),
  examId: z.coerce.number().optional(),
  assignmentId: z.coerce.number().optional(),
  classId: z.coerce.number({message: "Class is required!"}),
  studentId: z.coerce.string({message: "Student is required!"}),
});

export type ResultSchema = z.infer<typeof resultSchema>;