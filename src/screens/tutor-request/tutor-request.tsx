"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import styles from "./tutor-request.module.css";
import FilterByDate from "@/components/global/filter-by-date/filter-by-date";
import SearchBox from "@/components/global/search-box/search-box";
import TutorRequestTable from "@/components/ui/superAdmin/tutorRequest/tutorRequest-table/tutorRequest-table";
import { useQuery } from "@tanstack/react-query";
import { getAllRequest } from "@/services/dashboard/superAdmin/tutor-request/tutor-request";
import { Onboarding_Requests_Parsed } from "@/services/dashboard/superAdmin/tutor-request/tutor-request.types";
import { toast } from "react-toastify";
import { MyAxiosError } from "@/services/error.type";
import LoadingBox from "@/components/global/loading-box/loading-box";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import useDebounce from "@/utils/helpers/useDebounce";

const TutorRequest: React.FC = () => {
  const { token } = useAppSelector((state) => state?.user);
  const [searchItem, setSearchItem] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<any>("");
  const debouncedSearch = useDebounce(searchItem, 1500);

  // search handler - simplified to just update state
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchItem(e.target.value);
  }, []);

  // date filter handler
  const handleCalendar = useCallback((value: any) => {
    if (value === null) {
      setDateFilter("");
    } else {
      setDateFilter(value);
    }
  }, []);

  // Fetch data using react-query
  const { data, error, isLoading } = useQuery({
    queryKey: ["tutor-requests", dateFilter],
    queryFn: () =>
      getAllRequest(
        {
          startDate: dateFilter[0] || "",
          endDate: dateFilter[1] || "",
        },
        {
          token,
        }
      ),
    enabled: !!token,
    refetchOnWindowFocus: false,
  });

  // Parse the data (jsonData)
  const parsedData = useMemo(() => {
    if (!data) return null;
    return data.map((item) => {
      const { jsonData, ...rest } = item;
      const parsed_jsonData = jsonData ? JSON.parse(jsonData) : null;
      return { ...rest, parsed_jsonData };
    });
  }, [data]);

  // Use debouncedSearch instead of debouncedSearchItem
  const filteredList = useMemo(() => {
    if (!parsedData) return [];

    // Clean up debounced search term for comparison
    const searchTerm = debouncedSearch.toLowerCase();

    return parsedData.filter((item: Onboarding_Requests_Parsed) => {
      const userData = item?.parsed_jsonData;

      const fullName = `${userData?.firstName?.toLowerCase() || ""} ${
        userData?.lastName?.toLowerCase() || ""
      }`;
      const email = userData?.email?.toLowerCase() || "";

      const isSearchMatch =
        fullName.includes(searchTerm) || email.includes(searchTerm);

      return isSearchMatch;
    });
  }, [parsedData, debouncedSearch]);

  // Memoize TutorRequestTable props
  const tutorRequestTableProps = useMemo(
    () => ({
      data: filteredList || [],
    }),
    [filteredList]
  );

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

  return (
    <main className={styles.container}>
      <div className={styles.section1}>
        <FilterByDate changeFn={handleCalendar} width="25%" />
        <SearchBox
          placeholder="Search any request"
          changeFn={handleSearch}
          inlineStyles={{ width: "25%", background: "transparent" }}
        />
      </div>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <TutorRequestTable {...tutorRequestTableProps} />
      )}
    </main>
  );
};

export default TutorRequest;
