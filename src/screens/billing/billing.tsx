"use client";
import React, { FC, useCallback, useState } from "react";
import classes from "./billing.module.css";
import { toast } from "react-toastify";
import { MyAxiosError } from "@/services/error.type";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useQuery, useMutation } from "@tanstack/react-query";
import BillingTable from "@/components/ui/superAdmin/billing/billing-table/billing";
import {
  getAllBilling,
  createNewBilling,
} from "@/services/dashboard/superAdmin/billing/billing";
import {
  Create_New_Billing_Payload_Type,
  Billing_Api_FilterOptions,
} from "@/services/dashboard/superAdmin/billing/billing.types";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import FilterDropdown from "@/components/global/filter-dropdown/filter-dropdown";
import Button from "@/components/global/button/button";
import AddModal from "@/components/ui/superAdmin/billing/add-modal/add-moadl";
import { generateInvoices } from "@/services/dashboard/superAdmin/invoices/invoices";

const Billing: FC = () => {
  const { token } = useAppSelector((state) => state?.user);
  const { students, teachers } = useAppSelector((state) => state?.usersByGroup);
  const filteredTeachers =
    teachers?.users?.map((item) => JSON.stringify(item)) || [];
  const filteredStudents =
    students?.users?.map((item) => JSON.stringify(item)) || [];
  // states
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  // modal states
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  // pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(50);

  // search users
  const handleTeacherFilter = useCallback((e: any) => {
    setSelectedTeacher(JSON.parse(e.target.value));
  }, []);
  const handleStudentFilter = useCallback((e: any) => {
    setSelectedStudent(JSON.parse(e.target.value));
  }, []);

  //handlers
  // add-user modal  open/false functions
  const handeAddModalClose = useCallback(() => {
    setAddModalOpen(false);
  }, []);
  const handleAddModalOpen = useCallback(() => {
    setAddModalOpen(true);
  }, []);

  // pagination handler
  const handleChangePage = useCallback((e: any, newPage: number) => {
    // console.log(newPage);
    setCurrentPage(newPage);
  }, []);
  const handleChangeRowsPerPage = useCallback((e: any) => {
    // console.log(e?.target?.value);
    setRowsPerPage(e?.target?.value);
  }, []);

  //api calls
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [
      "getAllBillings",
      currentPage,
      rowsPerPage,
      selectedTeacher,
      selectedStudent,
    ],
    queryFn: () => {
      const params: Billing_Api_FilterOptions = {
        page: currentPage,
        limit: rowsPerPage,
      };

      if (selectedStudent) {
        params.user_id = selectedStudent?.id;
      } else if (selectedTeacher) {
        params.user_id = selectedTeacher?.id;
      }
      return getAllBilling(params, { token });
    },
  });

  const handleAddBilling = useMutation({
    mutationFn: (payload: Create_New_Billing_Payload_Type) =>
      createNewBilling(
        {
          token,
        },
        payload
      ),
    onSuccess: (data: any) => {
      if (data.message || data.error) {
        return toast.error(data.message || data.error);
      } else {
        setAddModalOpen(false);
        toast.success("Bill Add Successfully");
        refetch();
      }
    },
    onError: (error) => {
      const axiosError = error as MyAxiosError;
      if (axiosError.response) {
        toast.error(
          axiosError.response.data.error ||
            `${axiosError.response.status} ${axiosError.response.statusText}`
        );
      } else {
        toast.error(axiosError.message);
      }
    },
  });

  const handleGetInvoice = useMutation({
    mutationFn: (id: number) => generateInvoices({ id }, { token }),
    onSuccess: (data: any) => {
      if (data.message) {
        toast.success(data.message);
      } else {
        toast.success("Invoice generate successfully.");
      }
      refetch();
    },
    onError: (error) => {
      const axiosError = error as MyAxiosError;
      if (axiosError.response) {
        toast.error(
          axiosError.response.data.error ||
            `${axiosError.response.status} ${axiosError.response.statusText}`
        );
      } else {
        toast.error(axiosError.message);
      }
    },
  });

  if (error) {
    const axiosError = error as MyAxiosError;
    if (axiosError.response) {
      toast.error(axiosError.response.data.error);
    } else {
      toast.error(axiosError.message);
    }
  }

  return (
    <>
      <main className={classes.main}>
        <div className={classes.section1}>
          <div className={classes.wrapper}>
            <FilterDropdown
              placeholder="Filter Student"
              data={filteredStudents}
              handleChange={handleStudentFilter}
              value={selectedStudent?.name}
              inlineBoxStyles={styles?.dropDropStyles}
              dropDownObject
            />
            <FilterDropdown
              placeholder="Filter Teacher"
              data={filteredTeachers}
              handleChange={handleTeacherFilter}
              value={selectedTeacher?.name}
              inlineBoxStyles={styles?.dropDropStyles}
              dropDownObject
            />
          </div>
          <Button
            text="Add New Billing"
            icon={<AddOutlinedIcon />}
            inlineStyling={styles?.buttonStyles}
            clickFn={handleAddModalOpen}
          />
        </div>
        <BillingTable
          data={data?.data || []}
          isLoading={isLoading}
          currentPage={data?.currentPage ?? 1}
          totalCount={data?.totalCount ?? 0}
          totalPages={data?.totalPages ?? 0}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleGetInvoice={(e: any, id: number) =>
            handleGetInvoice?.mutate(id)
          }
          invoiceLoading={handleGetInvoice?.isPending}
        />
      </main>
      <AddModal
        modalOpen={addModalOpen}
        handleClose={handeAddModalClose}
        heading={`Add Billing`}
        subHeading={`Fill out the form in order to create the billing.`}
        handleAdd={(payload: Create_New_Billing_Payload_Type) =>
          handleAddBilling?.mutate(payload)
        }
        loading={handleAddBilling?.isPending}
        success={handleAddBilling?.isSuccess}
      />
    </>
  );
};

export default Billing;

const styles = {
  dropDropStyles: { width: "calc(100% - 10px)" },
  buttonStyles: {
    width: "max-content",
  },
};
