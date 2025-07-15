import React, { FC, useCallback, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { useQuery, useMutation } from "@tanstack/react-query";
import classes from "./invoices.module.css";
import { MyAxiosError } from "@/services/error.type";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import TeacherDashboardCard from "@/components/ui/teacher/dashboard-card/dashboard-card";
import ConsumerOverview from "@/components/ui/superAdmin/billing/consumer-overview/consumer-overview";
import DoughnutChart from "@/components/global/charts/doughnut-chart/doughnut-chart";
import BarCharts from "@/components/global/charts/bar-chart/bar-chart";
import UpdateBalanceModal from "@/components/ui/superAdmin/invoices/updateBalance-modal/updateBalance-modal";
import GenerateInvoiceModal from "@/components/ui/superAdmin/invoices/generateInvoice-modal/generateInvoice-modal";
import GenerateInvoiceForParentModal from "@/components/ui/superAdmin/invoices/manualPayment-modal/manualPayment-modal";
import DeleteModal from "@/components/ui/superAdmin/enrollment/delete-modal/delete-modal";
import LoadingBox from "@/components/global/loading-box/loading-box";
import ErrorBox from "@/components/global/error-box/error-box";
import {
  getAllInvoices,
  generateNewInvoice,
  generateInvoiceForParent,
  updateInvoiceStatus,
  deleteInvoice,
} from "@/services/dashboard/superAdmin/invoices/invoices";
import {
  Generate_New_Invoice_Api_Payload,
  Generate_Invoice_For_Parent_Api_Payload_Type,
} from "@/services/dashboard/superAdmin/invoices/invoices.types";
import { getInvoicesCountsAnalytics } from "@/services/dashboard/superAdmin/analytics/analytics";
import { Height, Padding } from "@mui/icons-material";

interface PaidModalState {
  id?: number | null;
  amount?: number | null;
  open?: boolean;
}

interface DeleteModalState {
  id?: number | null;
  open?: boolean;
}

const Invoices: FC = () => {
  const { token } = useAppSelector((state) => state?.user);
  // filter states
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  // pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(50);
  // modal states
  const [generateInvoiceModalOpen, setGenerateInvoiceModalOpen] =
    useState(false);
  const [generateInvoiceForParentModal, setGenerateInvoiceForParentModalOpen] =
    useState(false);
  const [updateBalanceModal, setUpdateBalanceModal] = useState<PaidModalState>({
    id: null,
    amount: null,
    open: false,
  });
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    id: null,
    open: false,
  });
  // general functions
  const calculateTotalPaid = (data: any): number => {
    return data?.reduce(
      (total: number, item: any) => total + item.total_paid,
      0
    );
  };
  // pagination handler
  const handleChangePage = useCallback((e: any, newPage: number) => {
    setCurrentPage(newPage);
  }, []);
  const handleChangeRowsPerPage = useCallback((e: any) => {
    setRowsPerPage(e?.target?.value);
  }, []);
  // user filter
  const handleStudentFilter = useCallback(
    (e: any) => setSelectedStudent(JSON.parse(e.target.value)),
    []
  );
  // generate new invoice modal open/close functions
  const handleGenerateInvoiceModalOpen = useCallback(() => {
    setGenerateInvoiceModalOpen(true);
  }, []);
  const handleGenerateInvoiceModalClose = useCallback(() => {
    setGenerateInvoiceModalOpen(false);
  }, []);
  // manual invoice for parent modal open/close functions
  const handleGenerateInvoiceForParentModalOpen = useCallback(() => {
    setGenerateInvoiceForParentModalOpen(true);
  }, []);
  const handleGenerateInvoiceForParentModalClose = useCallback(() => {
    setGenerateInvoiceForParentModalOpen(false);
  }, []);
  // paid modal open/close functions
  const handleUpdateBalanceModalOpen = useCallback(
    (id?: number, amount?: number) => {
      setUpdateBalanceModal({ id: id, amount: amount, open: true });
    },
    []
  );
  const handleUpdateBalanceModalClose = useCallback(() => {
    setUpdateBalanceModal({ id: null, amount: null, open: false });
  }, []);
  // delte modal open/close functions
  const handleDeleteModalOpen = useCallback((id?: number) => {
    setDeleteModal({
      id: id,
      open: true,
    });
  }, []);
  const handleDeleteModalClose = useCallback(() => {
    setDeleteModal({
      id: null,
      open: false,
    });
  }, []);

  const {
    data,
    error: getAllInvoicesError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getAllInvoices", currentPage, rowsPerPage, selectedStudent],
    queryFn: () =>
      getAllInvoices(
        {
          limit: rowsPerPage,
          page: currentPage,
          user_id: selectedStudent?.id,
        },
        { token }
      ),
  });

  const {
    data: getInvoicesCountsAnalyticsData,
    error: getInvoicesCountsAnalyticsError,
    isLoading: getInvoicesCountsAnalyticsLoading,
  } = useQuery({
    queryKey: ["getInvoicesCountsAnalytics"],
    queryFn: () =>
      getInvoicesCountsAnalytics(
        {
          year: moment().year(),
        },
        { token }
      ),
  });

  // generate invoice
  const handleGenerateNewInvoice = useMutation({
    mutationFn: (payload: Generate_New_Invoice_Api_Payload) => {
      return generateNewInvoice({ token }, payload);
    },
    onSuccess: (data: any) => {
      if (data.message) {
        toast.success(data.message);
      } else {
        toast.success("Invoice generated successfully.");
      }
      refetch();
      setGenerateInvoiceModalOpen(false);
    },
    onError: (error) => {
      const axiosError = error as MyAxiosError;
      if (axiosError?.response) {
        toast.error(
          axiosError?.response?.data?.message
            ? axiosError.response.data.message
            : axiosError.response.data?.error
            ? axiosError.response.data.error
            : `${axiosError.response.status} ${axiosError.response.statusText}`
        );
      } else {
        toast.error(axiosError.message);
      }
    },
  });

  // generate invoice for parent
  const handleGenerateInvoiceForParent = useMutation({
    mutationFn: (payload: Generate_Invoice_For_Parent_Api_Payload_Type) => {
      return generateInvoiceForParent({ token }, payload);
    },
    onSuccess: (data: any) => {
      if (data.message) {
        toast.success(data.message);
      } else {
        toast.success("Invoice generated successfully.");
      }
      refetch();
      setGenerateInvoiceForParentModalOpen(false);
    },
    onError: (error) => {
      const axiosError = error as MyAxiosError;
      if (axiosError?.response) {
        toast.error(
          axiosError?.response?.data?.message
            ? axiosError.response.data.message
            : axiosError.response.data?.error
            ? axiosError.response.data.error
            : `${axiosError.response.status} ${axiosError.response.statusText}`
        );
      } else {
        toast.error(axiosError.message);
      }
    },
  });

  // update invoice
  const handleInvoiceStatusUpdate = useMutation({
    mutationFn: (payload: { status: "PAID"; amount_paid: number }) => {
      const invoiceId =
        updateBalanceModal?.id !== undefined ? updateBalanceModal.id : null;
      return updateInvoiceStatus(invoiceId, { token }, payload);
    },
    onSuccess: (data: any) => {
      if (data.message) {
        toast.success(data.message);
      } else {
        toast.success("Invoice status changed successfully.");
      }
      refetch();
      setUpdateBalanceModal({
        id: null,
        amount: null,
        open: false,
      });
    },
    onError: (error) => {
      const axiosError = error as MyAxiosError;
      if (axiosError?.response) {
        toast.error(
          axiosError?.response?.data?.message
            ? axiosError.response.data.message
            : axiosError.response.data?.error
            ? axiosError.response.data.error
            : `${axiosError.response.status} ${axiosError.response.statusText}`
        );
      } else {
        toast.error(axiosError.message);
      }
    },
  });

  // delete invoice
  const handleDeleteInvoice = useMutation({
    mutationFn: (id: number) => deleteInvoice(id, { token }),
    onSuccess: (data: any) => {
      if (data.message) {
        toast.success(data.message);
      } else {
        toast.success("Invoice delete successfully.");
      }
      refetch();
      setDeleteModal({
        id: null,
        open: false,
      });
    },
    onError: (error) => {
      const axiosError = error as MyAxiosError;
      if (axiosError?.response) {
        toast.error(
          axiosError?.response?.data?.message
            ? axiosError.response.data.message
            : axiosError.response.data?.error
            ? axiosError.response.data.error
            : `${axiosError.response.status} ${axiosError.response.statusText}`
        );
      } else {
        toast.error(axiosError.message);
      }
    },
  });

  if (getAllInvoicesError || getInvoicesCountsAnalyticsError) {
    const axiosError =
      (getAllInvoicesError as MyAxiosError) ||
      (getInvoicesCountsAnalyticsError as MyAxiosError);
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
          {getInvoicesCountsAnalyticsLoading ? (
            <LoadingBox
              inlineStyling={{
                height: "calc(20vh + 2.2vh + 10px)",
              }}
            />
          ) : !getInvoicesCountsAnalyticsData ||
            Object.keys(getInvoicesCountsAnalyticsData).length === 0 ? (
            <ErrorBox
              inlineStyling={{
                height: "calc(20vh + 2.2vh + 10px)",
              }}
            />
          ) : (
            <>
              {/* Cards Section */}
              <div className={classes.cardsSection}>
                {[
                  {
                    text: "Total Revenue",
                    number:
                      calculateTotalPaid(
                        getInvoicesCountsAnalyticsData?.result
                      ) || 0,
                  },
                  {
                    text: "Total Overdue",
                    number: getInvoicesCountsAnalyticsData?.overdue || 0,
                  },
                  {
                    text: "Pending Invoices",
                    number: getInvoicesCountsAnalyticsData?.pending || 0,
                  },
                  {
                    text: "Total Paid",
                    number: getInvoicesCountsAnalyticsData?.paid || 0,
                  },
                ].map(({ text, number }) => (
                  <TeacherDashboardCard
                    key={text}
                    text={text}
                    number={number}
                    inlineStyling={styles.card}
                    loading={getInvoicesCountsAnalyticsLoading}
                  />
                ))}
              </div>

              {/* Bar Chart */}
              <BarCharts
                inlineStyles={{
                  flexGrow: 1,
                  height: "100%",
                  maxHeight: "100%",
                }}
                heading="Cashflow"
                data={getInvoicesCountsAnalyticsData?.result || []}
              />

              {/* Graph Section */}
              <div className={classes.graphSection}>
                <div>
                  {/* Doughnut Chart */}
                  <DoughnutChart
                    paid={getInvoicesCountsAnalyticsData?.paid || 0}
                    pending={getInvoicesCountsAnalyticsData?.pending || 0}
                    overDue={getInvoicesCountsAnalyticsData?.overdue || 0}
                  />

                  {/* Icons Section */}
                  <div className={classes.graphSectionIcons}>
                    {[
                      AddIcon,
                      PaymentOutlinedIcon,
                      RemoveRedEyeOutlinedIcon,
                      FileUploadOutlinedIcon,
                    ].map((Icon, index) => (
                      <div
                        key={index}
                        className={classes.icon}
                        onClick={
                          Icon === AddIcon
                            ? handleGenerateInvoiceModalOpen
                            : Icon === PaymentOutlinedIcon
                            ? handleGenerateInvoiceForParentModalOpen
                            : undefined
                        }
                      >
                        <Icon />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats Section */}
                <div className={classes.stats}>
                  {["Paid", "Pending", "Overdue"].map((status) => (
                    <p key={status}>
                      <span></span>
                      {status}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <ConsumerOverview
          invoice={data?.invoices || []}
          handlePaidModal={handleUpdateBalanceModalOpen}
          handleDeleteModal={handleDeleteModalOpen}
          currentPage={data?.currentPage}
          totalCount={data?.totalInvoices}
          totalPages={data?.totalPages}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleStudentFilter={handleStudentFilter}
          filterValue={JSON.stringify(selectedStudent)}
          loading={isLoading}
        />
      </main>
      {/* Modals */}
      <GenerateInvoiceModal
        modalOpen={generateInvoiceModalOpen}
        handleClose={handleGenerateInvoiceModalClose}
        heading="Generate New Invoice"
        subHeading="Fill out the form in order to generate the new invoice."
        handleAdd={(payload) => handleGenerateNewInvoice?.mutate(payload)}
        loading={handleGenerateNewInvoice?.isPending}
        success={handleGenerateNewInvoice?.isSuccess}
      />
      <GenerateInvoiceForParentModal
        modalOpen={generateInvoiceForParentModal}
        handleClose={handleGenerateInvoiceForParentModalClose}
        heading="Manual Payment"
        subHeading="Fill out the form in order to create manual payment."
        handleAdd={(payload) => handleGenerateInvoiceForParent?.mutate(payload)}
        loading={handleGenerateInvoiceForParent?.isPending}
        success={handleGenerateInvoiceForParent?.isSuccess}
      />
      <UpdateBalanceModal
        modalOpen={updateBalanceModal?.open || false}
        handleClose={handleUpdateBalanceModalClose}
        heading={"Update Balance"}
        subHeading={"Update Balance in order to change balance status."}
        value={String(updateBalanceModal?.amount) || "No Show"}
        handleAdd={(payload) =>
          handleInvoiceStatusUpdate?.mutate({ ...payload, status: "PAID" })
        }
        loading={handleInvoiceStatusUpdate?.isPending}
        isSuccess={handleInvoiceStatusUpdate?.isSuccess}
      />
      <DeleteModal
        modalOpen={deleteModal?.open || false}
        handleClose={handleDeleteModalClose}
        subHeading="Are you sure you want to delete this invoice? This action is permanent."
        heading="Are You Sure?"
        handleDelete={() => {
          if (deleteModal?.id) {
            handleDeleteInvoice?.mutate(deleteModal?.id && deleteModal.id);
          }
        }}
        loading={handleDeleteInvoice?.isPending}
      />
    </>
  );
};

export default Invoices;

const styles = {
  card: {
    flex: "1 1 calc(50% - 10px)",
    height: "calc(50% - 10px)",
    padding: "10px",
    justifyContent: "space-between",
  },
};
