export type OngoingClasses_Params_Type = {
  student_id?: string;
  tutor_id?: string;
};

export type Tutor = {
  id: number;
  name: string;
  email: string;
  profileImageUrl: string;
  country_code: string;
};

export type Student = {
  id: number;
  name: string;
  email: string;
  profileImageUrl: string;
  country_code: string;
};

export type Subject = {
  id: number;
  name: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type Curriculum = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type Grade = {
  id: number;
  name: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type Enrollment = {
  id: number;
  tutor_id: number;
  status: number;
  on_break: number;
  subject_id: number;
  board_id: number | null;
  curriculum_id: number;
  grade_id: number;
  hourly_rate: number;
  request_rate: number;
  group_id: string;
  tutor_hourly_rate: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  enrollment_id: number | null;
  tutor: Tutor;
  subject: Subject;
  board: unknown | null; // Define type if board structure is known
  curriculum: Curriculum;
  grade: Grade;
};

export type TeacherSchedule = {
  id: number;
  day_of_week: string;
  start_time: string;
  session_duration: number;
  status: boolean;
  slots: string;
  is_booked: boolean;
  tutor_id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ClassSchedule = {
  id: number;
  status: boolean;
  enrollment_id: number;
  teacher_schedule_id: number;
  meetLink: string;
  meetSpace: string;
  isCancelled: boolean | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  enrollment: Enrollment;
  teacherSchedule: TeacherSchedule;
};

export type ClassScheduleWithStudents = {
  classSchedule: ClassSchedule;
  students: Student[];
};

export type OngoingClasses_Response_Type = ClassScheduleWithStudents[];
