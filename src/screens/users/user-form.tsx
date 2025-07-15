"use client";
import { useState, useRef, useCallback, useMemo, FC, useEffect } from "react";
import classes from "./user.module.css";
import { toast } from "react-toastify";
import { Country } from "country-state-city";
import { useQuery, useMutation } from "@tanstack/react-query";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { emailRegex } from "@/utils/helpers/regex";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import { fetchUsersByGroup } from "@/lib/store/slices/usersByGroup-slice";
import { useAppDispatch } from "@/lib/store/hooks/hooks";
import { MyAxiosError } from "@/services/error.type";
import {
  adduser,
  updateUser,
  deactivateUser,
  deleteUser,
  addRelation,
} from "@/services/dashboard/superAdmin/uers/users";
import { UpdateUser_Api_Payload_Type } from "@/services/dashboard/superAdmin/uers/users.type";
import { getAllusers } from "@/services/dashboard/superAdmin/uers/users";
import SearchBox from "@/components/global/search-box/search-box";
import FilterByDate from "@/components/global/filter-by-date/filter-by-date";
import Button from "@/components/global/button/button";
import FilterDropdown from "@/components/global/filter-dropdown/filter-dropdown";
import UsersTable from "@/components/ui/superAdmin/users/users-table/users-table";
import AddModal from "@/components/ui/superAdmin/users/add-modal/add-moadl";
import RelationModal from "@/components/ui/superAdmin/users/relation-modal/relationModalOpen";
import UpdateModal from "@/components/ui/superAdmin/users/edit-modal/edit-modal";
import DeactivateModal from "@/components/ui/superAdmin/users/deactivate-modal/deactivate-modal";
import DeleteModal from "@/components/ui/superAdmin/users/delete-modal/delete-modal";

const UsersForm: FC = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state?.user?.token);
  const roles = useAppSelector((state) => state.roles.roles);
  const students = useAppSelector((state) => state?.usersByGroup?.students!);
  const parents = useAppSelector((state) => state?.usersByGroup?.parents!);
  const rolesArr = useMemo(() => {
    return roles?.map((item: any) => JSON.stringify(item));
  }, []);
  const countries = useMemo(() => {
    return Country?.getAllCountries()?.map((item: any) => JSON.stringify(item));
  }, []);

  // modal states
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [relationModalOpen, setRelationModalOpen] = useState<boolean>(false);
  const [updateModalOpen, setUpdateModalOpen] = useState<any>({
    open: false,
    profile: {},
  });
  const [deactivateModalOpen, setDeactivateModalOpen] =
    useState<boolean>(false);
  const [deactivateId, setDeactivateId] = useState<string>("");
  const [deleteModal, setMeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>("");

  // pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(50);
  // date filter states
  const [dateFilter, setDateFilter] = useState<any>("");
  // search filter states
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [debouncedSearchItem, setDebouncedSearchItem] = useState<string>("");
  // country filter states
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [userType, setUserTypeFilter] = useState("");

  // pagination handler
  const handleChangePage = useCallback((e: any, newPage: number) => {
    setCurrentPage(newPage);
  }, []);
  const handleChangeRowsPerPage = useCallback((e: any) => {
    setRowsPerPage(e?.target?.value);
  }, []);
  // date filter handler
  const handleCalendar = useCallback((value: any) => {
    if (value === null) {
      setDateFilter("");
    } else {
      setDateFilter(value);
    }
  }, []);

  // search filter handler
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setDebouncedSearchItem(searchValue);
    }, 1500);
    // Cleanup timeout when component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  // country filter handler
  const handleCountryFilter = useCallback((e: any) => {
    setCountryFilter(e.target.value);
  }, []);

  // userType filter handler
  const handleUserTypeFilter = useCallback((e: any) => {
    setUserTypeFilter(e.target.value);
  }, []);

  // add-user modal  open/false functions
  const handeAddModalClose = useCallback((e: any) => {
    setAddModalOpen(false);
  }, []);
  const handleAddModalOpen = useCallback((e: any) => {
    setAddModalOpen(true);
  }, []);

  // parent relation modal open/close function
  const handleRelationOpen = useCallback(() => {
    setRelationModalOpen(true);
  }, []);
  const handleRelationClose = useCallback(() => {
    setRelationModalOpen(false);
  }, []);

  // edit-user modal  open/false functions
  const handeEditModalClose = useCallback((e: any) => {
    setUpdateModalOpen({
      open: false,
      profile: {},
    });
  }, []);
  const handleEditModalOpen = useCallback((e: any, item: any) => {
    setUpdateModalOpen({
      open: true,
      profile: item,
    });
  }, []);

  // deactivation user modal open/close  functions
  const handleDeactivateModalClose = useCallback((e: any) => {
    setDeactivateModalOpen(false);
  }, []);
  const handleDeactivateModalOpen = useCallback((e: any, id: number) => {
    setDeactivateModalOpen(true);
    setDeactivateId(id.toString());
  }, []);

  // delete-user modal open/close  functions
  const handleDeleteModalClose = useCallback((e: any) => {
    setMeleteModal(false);
  }, []);
  const handleDeleteModalOpen = useCallback((e: any, id: number) => {
    setMeleteModal(true);
    setDeleteId(id.toString());
  }, []);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [
      "getAllUsers",
      currentPage,
      rowsPerPage,
      debouncedSearchItem,
      dateFilter,
      countryFilter,
      userType,
    ],
    queryFn: () =>
      getAllusers(
        {
          startDate: dateFilter[0] || "",
          endDate: dateFilter[1] || "",
          userType: userType !== "" ? JSON.parse(userType)?.id : null,
          limit: rowsPerPage,
          page: currentPage,
          name: emailRegex.test(debouncedSearchItem) ? "" : debouncedSearchItem,
          email: emailRegex.test(debouncedSearchItem)
            ? debouncedSearchItem
            : "",
          countryCode:
            countryFilter !== "" ? JSON.parse(countryFilter)?.isoCode : "",
        },
        { token }
      ),
    staleTime: 60000,
    enabled: !!token,
    refetchOnWindowFocus: false,
  });
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

  const handleAdd = useMutation({
    mutationFn: (payload) =>
      adduser(payload, {
        token,
        contentType: "multipart/form-data",
      }),
    onSuccess: (data: any) => {
      if (data.message || data.error) {
        return toast.error(data.message || data.error);
      }
      setAddModalOpen(false);
      dispatch(fetchUsersByGroup({ token }));
      refetch();
      toast.success("User Add Successfully");
    },
    onError: (error) => {
      const axiosError = error as MyAxiosError;
      if (axiosError?.response) {
        toast.error(
          axiosError?.response?.data?.message
            ? `${axiosError?.response?.data?.message}`
            : axiosError?.response?.data?.error
            ? `${axiosError?.response?.data?.error}`
            : `${axiosError?.response?.status} ${axiosError?.response?.statusText}`
        );
      } else {
        toast.error(axiosError.message);
      }
    },
  });

  const handleAddRelation = useMutation({
    mutationFn: (payload) =>
      addRelation(payload, {
        token,
      }),
    onSuccess: (data: any) => {
      if (data.message && data.error) {
        return toast.error(data.message || data.error);
      }
      handleRelationClose();
      toast.success("Relation Add Successfully");
    },
    onError: (error) => {
      const axiosError = error as MyAxiosError;
      if (axiosError?.response) {
        toast.error(
          axiosError?.response?.data?.message
            ? `${axiosError?.response?.data?.message}`
            : axiosError?.response?.data?.error
            ? `${axiosError?.response?.data?.error}`
            : `${axiosError?.response?.status} ${axiosError?.response?.statusText}`
        );
      } else {
        toast.error(axiosError.message);
      }
    },
  });

  const handleUpdate = useMutation({
    mutationFn: (payload: UpdateUser_Api_Payload_Type) =>
      updateUser(
        {
          token,
        },
        payload
      ),
    onSuccess: () => {
      toast.success("User Updated Successfully");
      setUpdateModalOpen({
        open: false,
        profile: {},
      });
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
      setUpdateModalOpen({
        open: false,
        profile: {},
      });
    },
  });

  const handleDeactivate = useMutation({
    mutationFn: (payload: { id: string }) =>
      deactivateUser(payload, {
        token,
      }),
    onSuccess: () => {
      toast.success("User Deactivate Successfully");
      setDeactivateModalOpen(false);
      setDeactivateId("");
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
      setDeactivateModalOpen(false);
      setDeactivateId("");
    },
  });

  const handleDelete = useMutation({
    mutationFn: (payload: { id: string }) =>
      deleteUser(payload, {
        token,
      }),
    onSuccess: () => {
      toast.success("User Deleted Successfully");
      setMeleteModal(false);
      setDeleteId("");
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
      setMeleteModal(false);
      setDeleteId("");
    },
  });

  // table props
  const tableProps = useMemo(
    () => ({
      data: data?.users || [],
      currentPage: data?.currentPage || 1,
      totalCount: data?.totalCount || data?.users?.length || 1,
      totalPages: data?.totalPages || 1,
      rowsPerPage: rowsPerPage,
      handleChangePage: handleChangePage,
      handleChangeRowsPerPage: handleChangeRowsPerPage,
      handleDeactivateModal: handleDeactivateModalOpen,
      handleDeleteModal: handleDeleteModalOpen,
      handleEditModal: handleEditModalOpen,
      isLoading: isLoading,
    }),
    [
      data?.users,
      data?.currentPage,
      data?.totalCount,
      data?.totalPages,
      rowsPerPage,
      handleChangePage,
      handleChangeRowsPerPage,
      handleDeactivateModalOpen,
      handleDeleteModalOpen,
      handleEditModalOpen,
      isLoading,
    ]
  );

  //add-modal props
  const addModalProps = useMemo(
    () => ({
      modalOpen: addModalOpen,
      handleClose: handeAddModalClose,
      heading: `Add User`,
      subHeading: `Fill out the form in order to create the user`,
      handleAdd: (payload: any) => handleAdd?.mutate(payload),
      loading: handleAdd?.isPending,
      success: handleAdd?.isSuccess,
    }),
    [
      addModalOpen,
      handeAddModalClose,
      handleAdd?.mutate,
      handleAdd?.isPending,
      handleAdd?.isSuccess,
    ]
  );

  // relation modal props
  const relationModalProps = useMemo(
    () => ({
      modalOpen: relationModalOpen,
      handleClose: handleRelationClose,
      heading: `Add Realtion`,
      subHeading: `Fill out the form in order to create the relation between parent and students`,
      students: students?.users || [],
      parents: parents?.users || [],
      handleAdd: (payload: any) => handleAddRelation?.mutate(payload),
      loading: handleAddRelation?.isPending,
      success: handleAddRelation?.isSuccess,
    }),
    [
      relationModalOpen,
      students,
      addModalOpen,
      handeAddModalClose,
      handleAddRelation?.mutate,
      handleAddRelation?.isPending,
      handleAddRelation?.isSuccess,
      parents,
    ]
  );

  // update-modal props
  const updateModalProps = useMemo(
    () => ({
      modalOpen: updateModalOpen,
      handleClose: handeEditModalClose,
      heading: `Edit User`,
      subHeading: `Update the fields in order to update the user`,
      handleUpdate: (payload: any) => handleUpdate?.mutate(payload),
      loading: handleUpdate?.isPending,
      success: handleUpdate?.isSuccess,
    }),
    [
      updateModalOpen,
      handeEditModalClose,
      handleUpdate?.mutate,
      handleUpdate?.isPending,
      handleUpdate?.isSuccess,
    ]
  );

  // deactivate-modal props
  const deactivateModalProps = useMemo(
    () => ({
      modalOpen: deactivateModalOpen,
      handleClose: handleDeactivateModalClose,
      subHeading: "Are you sure to deactivate this user?",
      heading: "You Sure!",
      handleDeactivate: () => {
        handleDeactivate.mutate({ id: deactivateId });
      },
      loading: handleDeactivate?.isPending,
    }),
    [
      deactivateModalOpen,
      handleDeactivateModalClose,
      handleDeactivate?.mutate,
      handleDeactivate?.isPending,
      deactivateId,
    ]
  );

  // delete-modal props
  const deleteModalProps = useMemo(
    () => ({
      modalOpen: deleteModal,
      handleClose: handleDeleteModalClose,
      subHeading: "Are you sure to delete this user? This action is permanent!",
      heading: "Are You Sure?",
      handleDelete: () => {
        handleDelete.mutate({ id: deleteId });
      },
      loading: handleDelete?.isPending,
    }),
    [
      deleteModal,
      handleDeleteModalClose,
      handleDelete?.mutate,
      handleDelete?.isPending,
      deleteId,
    ]
  );

  return (
    <>
      <main className={classes.container}>
        <div className={classes.section1}>
          <div className={classes.aside}>
            <FilterByDate
              changeFn={handleCalendar}
              width={styles?.filterWidth?.width}
            />
            <SearchBox
              placeholder="Search any user"
              changeFn={handleSearch}
              inlineStyles={styles?.filterWidth}
            />
            <FilterDropdown
              placeholder="Filter By Role"
              data={rolesArr || []}
              handleChange={handleUserTypeFilter}
              value={userType}
              inlineBoxStyles={styles?.filterWidth}
              dropDownObject
            />

            <FilterDropdown
              placeholder="Filter By Country"
              data={countries}
              handleChange={handleCountryFilter}
              value={countryFilter}
              inlineBoxStyles={styles?.filterWidth}
              dropDownObject
            />
          </div>
          <Button
            text="Add Relation"
            icon={<AddOutlinedIcon />}
            clickFn={handleRelationOpen}
            inlineStyling={styles?.buttonStyles}
          />
          <Button
            text="Add New User"
            icon={<AddOutlinedIcon />}
            inlineStyling={styles?.buttonStyles}
            clickFn={handleAddModalOpen}
          />
        </div>

        <UsersTable {...tableProps} />
      </main>
      <AddModal {...addModalProps} />
      <RelationModal {...relationModalProps} />
      <UpdateModal {...updateModalProps} />
      <DeactivateModal {...deactivateModalProps} />
      <DeleteModal {...deleteModalProps} />
    </>
  );
};

export default UsersForm;

const styles = {
  buttonStyles: {
    width: "max-content",
  },
  filterWidth: {
    width: "calc(25% - 10px)",
  },
};
