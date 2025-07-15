export type ModalState = {
  add: boolean;
  edit: boolean;
  delete: boolean;
  manualClass: {
    open: boolean;
    enrollment_id: number | null;
    duration: number | null;
    startTime?: string | null;
    endTime?: string | null;
    name?: string | null;
  };
  instantClass: {
    open: boolean;
    enrollment_id: number | null;
  };
};

export type FilterState = {
  currentPage: number;
  rowsPerPage: number;
  dateFilter: string | [string, string] | null;
  selectedTeacher: string;
  selectedStudent: string;
};

export type EnrollmentItem = {
  id: number | string;
  [key: string]: any;
};
