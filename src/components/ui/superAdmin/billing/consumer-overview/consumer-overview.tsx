import React, { FC, memo } from "react";
import classes from "./consumer-overview.module.css";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import FilterDropdown from "@/components/global/filter-dropdown/filter-dropdown";
import Table from "./table/table";
import { Invoice } from "@/services/dashboard/superAdmin/invoices/invoices.types";
import LoadingBox from "@/components/global/loading-box/loading-box";

interface ConsumerOverviewProps {
  invoice: Invoice[];
  handlePaidModal: (id?: number, amount?: number) => void;
  handleDeleteModal: (id?: number) => void;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  handleChangePage?: (event: React.ChangeEvent<unknown>, page: number) => void;
  handleChangeRowsPerPage?: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  rowsPerPage?: number;
  handleStudentFilter: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  filterValue: string;
  loading?: boolean;
}

const ConsumerOverview: FC<ConsumerOverviewProps> = ({
  invoice,
  handlePaidModal,
  handleDeleteModal,
  totalPages,
  totalCount,
  handleChangePage,
  handleChangeRowsPerPage,
  rowsPerPage,
  currentPage,
  handleStudentFilter,
  filterValue,
  loading,
}) => {
  const { students } = useAppSelector((state) => state?.usersByGroup);
  const filteredStudents =
    students?.users?.map((item: any) => JSON.stringify(item)) || [];

  return (
    <main className={classes.consumerOverviewContainer}>
      {loading ? (
        <LoadingBox />
      ) : (
        <>
          <header className={classes.header}>
            <p className={classes.heading}>Consumer Overview</p>
            <FilterDropdown
              placeholder="Filter Student"
              data={filteredStudents}
              handleChange={handleStudentFilter}
              value={filterValue}
              inlineBoxStyles={styles.dropDownStyles}
              dropDownObject
            />
          </header>
          <Table
            invoice={invoice || []}
            handlePaidModal={handlePaidModal}
            handleDeleteModal={handleDeleteModal}
            currentPage={currentPage}
            totalCount={totalCount}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </>
      )}
    </main>
  );
};

export default memo(ConsumerOverview);

const styles = {
  dropDownStyles: { width: "20%" },
};
