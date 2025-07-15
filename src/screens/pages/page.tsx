"use client";
import React, { useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import {
  getAllPages,
  createPage,
  updatePage,
  deletePage,
} from "@/services/dashboard/superAdmin/pages/pages";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import { MyAxiosError } from "@/services/error.type";
import { CreatePage_Api_Payload } from "@/types/pages/createPage.types";
import ErrorBox from "@/components/global/error-box/error-box";
import LoadingBox from "@/components/global/loading-box/loading-box";
import Button from "@/components/global/button/button";
import PageTable from "@/components/ui/superAdmin/pages/pages-table/pages-table";
import AddModal from "@/components/ui/superAdmin/pages/add-modal/add-Modal";
import UpdateModal from "@/components/ui/superAdmin/pages/update-modal/update-modal";
import DeleteModal from "@/components/ui/superAdmin/enrollment/delete-modal/delete-modal";
import classes from "./page.module.css";

const Page = () => {
  const { token } = useAppSelector((state) => state?.user);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedPageId, setSelectedPageId] = React.useState<number | null>(
    null
  );
  const [editModal, setEditModal] = React.useState<{
    id: number;
    name: string;
    route: string;
    icon: string;
    modalOpen: boolean;
  } | null>(null);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["getAllPages"],
    queryFn: () => {
      return getAllPages({ token });
    },
    enabled: !!token,
  });

  const addPage = useMutation({
    mutationFn: (payload: CreatePage_Api_Payload) =>
      createPage(
        {
          name: payload.name,
          route: payload.route,
          icon: payload.icon,
          category: payload.category,
        },
        {
          contentType: "multipart/form-data",
          token,
        }
      ),
    onSuccess: (data) => {
      setAddModalOpen(false);
      toast.success(`Page Created Successfully`);
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

  const handleUpdatePage = useMutation({
    mutationFn: (payload: {
      updatedId: number;
      name: string;
      route: string;
      icon: string;
      category: string;
    }) =>
      updatePage(
        String(payload.updatedId),
        {
          name: payload.name,
          route: payload.route,
          icon: payload.icon,
          category: payload.category,
        },
        {
          token,
        }
      ),
    onSuccess: (data) => {
      setEditModal(null);
      toast.success(`Page Updated Successfully`);
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

  const deletePageMutation = useMutation({
    mutationFn: (pageId: number) => deletePage(String(pageId), { token }),
    onSuccess: (data) => {
      setDeleteModalOpen(false);
      setSelectedPageId(null);
      toast.success(`Page Deleted Successfully`);
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

  if (isLoading) return <LoadingBox />;

  return (
    <>
      <div className={classes.container}>
        <div className={classes.actionBar}>
          <Button
            text="Add Page"
            icon={<Plus />}
            clickFn={() => setAddModalOpen(true)}
          />
        </div>
        {data && data?.pages?.length > 0 ? (
          <PageTable
            data={data.pages}
            onDeleteClick={(pageId) => {
              setSelectedPageId(pageId);
              setDeleteModalOpen(true);
            }}
            onEditClick={(item) => setEditModal({ ...item, modalOpen: true })}
          />
        ) : (
          <ErrorBox inlineStyling={{ flex: 1 }} />
        )}
      </div>
      <AddModal
        modalOpen={addModalOpen}
        handleClose={() => setAddModalOpen(false)}
        handleAdd={(payload) => addPage.mutate(payload)}
        loading={addPage.isPending}
        success={addPage.isSuccess}
        heading="Add Page"
        subHeading="Fill all the fields in order to add a new page."
      />
      <UpdateModal
        modalOpen={editModal?.modalOpen || false}
        handleClose={() => setEditModal(null)}
        handleUpdate={(payload: {
          name: string;
          route: string;
          icon: string;
          category: string;
        }) =>
          handleUpdatePage.mutate({ updatedId: editModal?.id!, ...payload })
        }
        loading={handleUpdatePage.isPending}
        success={handleUpdatePage.isSuccess}
        heading="Update Page"
        subHeading="Edit the fields in order to update the page."
        selectedPageData={editModal}
      />
      <DeleteModal
        modalOpen={deleteModalOpen}
        handleClose={() => {
          setDeleteModalOpen(false);
          setSelectedPageId(null);
        }}
        handleDelete={() => deletePageMutation.mutate(selectedPageId!)}
        heading="Delete Page"
        subHeading="Are you sure you want to delete this page?"
        loading={deletePageMutation.isPending}
      />
    </>
  );
};

export default Page;
