import React, {
  FC,
  useState,
  useCallback,
  useMemo,
  useEffect,
  ChangeEvent,
} from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import moment from "moment";
import classes from "./payouts.module.css";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import useDebounce from "@/utils/helpers/useDebounce";
import Table from "@/components/ui/superAdmin/tutor-payouts/table/table";
import LoadingBox from "@/components/global/loading-box/loading-box";
import ErrorBox from "@/components/global/error-box/error-box";
import SearchBox from "@/components/global/search-box/search-box";
import { MyAxiosError } from "@/services/error.type";
import {
  getTutorPayouts,
  generateUpdateTutorPayouts,
  updatePayoutStatus,
} from "@/services/dashboard/superAdmin/payouts/payouts";
import { Generate_Update_Payouts_Api_Response_Type } from "@/types/payouts/generateOrUpdatePayout.type";
import { UpdatePayoutStatusType_Api_Response_Type } from "@/types/payouts/updatePayoutStatus.type";
const searchBoxStyles = {
  backgroundColor: "#ECEFF2",
  boxShadow: "none",
  borderRadius: "20px",
};

const iconBoxStyles = {
  background: "none",
};

const inputStyles = {
  paddingLeft: "0px",
};

const TutorPayouts: FC = () => {
  const { token } = useAppSelector((state) => state?.user);
  // State for UI controls
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  // Use debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 1500);

  // Event handlers with useCallback
  const handleChangePage = useCallback((e: any, newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(event.target.value));
      setCurrentPage(1);
    },
    []
  );

  const handleSearch = useCallback((e: any) => {
    setSearchQuery(e.target.value);
  }, []);

  // Fetch data with React Query
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["tutorPayouts", currentPage, rowsPerPage, debouncedSearchQuery],
    queryFn: () =>
      getTutorPayouts(
        {
          month: moment().subtract(1, "month").month() + 1,
          year: moment().year(),
          page: currentPage,
          limit: rowsPerPage,
          search: debouncedSearchQuery || "",
        },
        {
          token,
        }
      ),
    staleTime: 30000,
    enabled: !!token,
    refetchOnWindowFocus: false,
  });

  // update tutor payout status
  const handleGenerateUpdatePayouts = useMutation({
    mutationFn: () => generateUpdateTutorPayouts({ token }),
    onSuccess: (data: Generate_Update_Payouts_Api_Response_Type) => {
      data?.message
        ? toast.success(data?.message)
        : "Payouts Processed Successfully.";
      refetch();
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

  const handleUpdateTutorPayouts = useMutation({
    mutationFn: (payoutId: string) => updatePayoutStatus(payoutId, { token }),
    onSuccess: (data: UpdatePayoutStatusType_Api_Response_Type) => {
      data?.message
        ? toast.success(data?.message)
        : "Payout status updated successfully.";
      refetch();
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

  // Handle errors from API
  useEffect(() => {
    if (error) {
      const axiosError = error as MyAxiosError;
      if (axiosError.response) {
        toast.error(axiosError.response.data.error);
      } else {
        toast.error(axiosError.message);
      }
    }
  }, [error]);

  const tableProps = useMemo(() => {
    return {
      payouts: data?.payouts,
      totalCount: data?.count || 0,
      totalPages: data?.totalPages || 0,
      currentPage: data?.currentPage || 0,
      rowsPerPage,
      handleChangePage,
      handleChangeRowsPerPage,
      handleChangeStatus: (payoutId: string) =>
        handleUpdateTutorPayouts.mutate(payoutId),
      loading: handleUpdateTutorPayouts?.isPending,
    };
  }, [
    data?.payouts,
    data?.count,
    data?.totalPages,
    currentPage,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    handleUpdateTutorPayouts,
  ]);

  return (
    <main className={classes.container}>
      {/* Header Section */}
      <div className={classes.header}>
        <div className={classes.aside1}>
          <div className={classes.aside1Box}>
            <p>Total Paid Sessions</p>
            <p>{2500}</p>
          </div>
          <div className={classes.aside1Box}>
            <p>Pending Tutors</p>
            <p>{2500}</p>
          </div>
        </div>
        <div className={classes.aside2}>
          {handleGenerateUpdatePayouts?.isPending ? (
            <LoadingBox
              inlineStyling={{ height: "max-content", width: "max-content" }}
              loaderStyling={{
                height: "var(--medium-text-size-vh) !important",
                width: "var(--medium-text-size-vh) !important",
              }}
            />
          ) : (
            <span
              className={classes.iconBox}
              onClick={() => handleGenerateUpdatePayouts?.mutate()}
            >
              <RefreshIcon />
            </span>
          )}

          <SearchBox
            placeholder="Search"
            inlineStyles={searchBoxStyles}
            inlineIconBoxStyles={iconBoxStyles}
            inlineInputStyles={inputStyles}
            changeFn={handleSearch}
            value={searchQuery}
          />
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <LoadingBox />
      ) : data && data.payouts && data.payouts.length > 0 ? (
        <Table {...tableProps} />
      ) : (
        <ErrorBox />
      )}
    </main>
  );
};

export default React.memo(TutorPayouts);
