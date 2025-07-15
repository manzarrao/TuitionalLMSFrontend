import React, { memo, useCallback, useState, useMemo } from "react";
import classes from "./section1.module.css";
import Button from "@/components/global/button/button";
import SubjectsComponent from "./subjects-component/subjects-component";
import { Box } from "@mui/material";
import Image from "next/image";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AddIcon from "@mui/icons-material/Add";
import GenerateMeetLink from "@/components/ui/superAdmin/tutor-profile/meetLink-modal/meetLink-modal";
import { MyAxiosError } from "@/services/error.type";
import { useMutation } from "@tanstack/react-query";
import { generateInterviewLink } from "@/services/dashboard/superAdmin/tutor-request/tutor-request";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import Link from "next/link"; // Corrected import
import { approvedRequest } from "@/services/dashboard/superAdmin/tutor-request/tutor-request";

interface Section1Props {
  data: any;
  refetch?: () => void;
}

const Section1: React.FC<Section1Props> = memo(({ data, refetch }) => {
  const acceptButtonStyle = useMemo(
    () => ({
      borderRadius: "5px",
      width: "100%",
    }),
    []
  );

  const declineButtonStyle = useMemo(
    () => ({
      backgroundColor: "transparent",
      border: "1px solid var(--main-color)",
      color: "var(--main-color)",
      borderRadius: "5px",
      width: "100%",
    }),
    []
  );
  const tutorData = useMemo(() => data?.parsed_jsonData || {}, [data]);
  const { id } = useParams();
  const { token } = useAppSelector((state) => state.user);
  const [meetLinkModal, setMeetLinkModal] = useState<boolean>(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const generateLinkMutation = useMutation({
    mutationFn: (payload: { interviewDate: string }) =>
      generateInterviewLink(
        Number(id),
        {
          token,
        },
        payload
      ),
    onSuccess: (response: any) => {
      if (response?.message) {
        toast.success(response.message);
      } else {
        toast.success("Meeting link generated successfully");
      }
      setMeetLinkModal(false);
      refetch?.();
    },
    onError: (error) => {
      const axiosError = error as MyAxiosError;
      if (axiosError?.response?.data) {
        const errorMessage =
          axiosError.response.data.message ||
          axiosError.response.data.error ||
          `${axiosError.response.status} ${axiosError.response.statusText}`;
        toast.error(errorMessage);
      } else {
        toast.error(axiosError.message || "An error occurred");
      }
    },
  });

  const approveRequestMutation = useMutation({
    mutationFn: (payload: { jsonData: any; id: number }) =>
      approvedRequest(
        {
          token,
        },
        payload
      ),
    onSuccess: (response: any) => {
      if (response?.message) {
        toast.success(response.message);
      } else {
        toast.success("Request approved successfully");
      }
      setSelectedSubjects([]);
      refetch?.();
    },
    onError: (error) => {
      const axiosError = error as MyAxiosError;
      if (axiosError?.response?.data) {
        const errorMessage =
          axiosError.response.data.message ||
          axiosError.response.data.error ||
          `${axiosError.response.status} ${axiosError.response.statusText}`;
        toast.error(errorMessage);
      } else {
        toast.error(axiosError.message || "An error occurred");
      }
      setSelectedSubjects([]);
    },
  });

  const handleCloseMeetLinkModal = useCallback(() => {
    setMeetLinkModal(false);
  }, []);

  const handleOpenMeetLinkModal = useCallback(() => {
    setMeetLinkModal(true);
  }, []);

  const handleGenerateLink = useCallback(
    (payload: { interviewDate: string }) => {
      generateLinkMutation.mutate(payload);
    },
    [generateLinkMutation]
  );

  const handleApprovedRequest = useCallback(() => {
    const newJsonData = { ...data };
    newJsonData.parsed_jsonData.subjects = [...selectedSubjects];
    approveRequestMutation.mutate({
      jsonData: JSON.stringify(newJsonData),
      id: Number(id),
    });
  }, [approveRequestMutation, data]);

  const displayName = useMemo(() => {
    const fullName = tutorData?.firstName || "Unknown";
    return fullName.split(" ").slice(0, 2).join(" ");
  }, [tutorData?.firstName]);

  const subjects = useMemo(
    () => tutorData?.subjects || [],
    [tutorData?.subjects]
  );

  const addSubjects = useCallback((subject: any) => {
    setSelectedSubjects((prev) => [...new Set([...prev, { ...subject }])]);
  }, []);

  return (
    <>
      <div className={classes.container}>
        <Box className={classes.box1}>
          <div className={classes.box1_inner}>
            <div className={classes.imageBox}>
              <Image
                src={tutorData?.profileImage || "/assets/images/demmyPic.png"}
                alt="Tutor Profile"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className={classes.textBox}>
              <p className={classes.name}>{displayName}</p>
              <p className={classes.email}>{tutorData?.email || "No email"}</p>
              <p className={classes.iconBox}>
                <span>
                  <PhoneOutlinedIcon />
                </span>
                {tutorData?.phone || "No phone"}
              </p>
            </div>
          </div>
          <div className={classes.actionButtonBox}>
            {tutorData?.meetLink && (
              <Link
                href={tutorData?.meetLink || ""}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.meetLinkButton}
              >
                Open Meet Link
              </Link>
            )}

            <Button
              text="Get Meet Link"
              icon={<AddIcon />}
              clickFn={handleOpenMeetLinkModal}
            />
          </div>
        </Box>

        <Box className={classes.box2}>
          <div className={classes.heading}>Subjects</div>
          <div className={classes.subjectsBox}>
            {subjects?.map((item: any, indx: number) => (
              <SubjectsComponent
                key={`subject-${indx}-${item?.id || item?.name || indx}`}
                item={item}
                currency={tutorData?.currency}
                handleChecked={addSubjects}
              />
            ))}
          </div>
        </Box>

        <div className={classes.buttonBox}>
          <Button
            text="Accept"
            inlineStyling={acceptButtonStyle}
            clickFn={handleApprovedRequest}
            loading={approveRequestMutation.isPending}
            disabled={approveRequestMutation.isPending}
          />
          <Button text="Decline" inlineStyling={declineButtonStyle} />
        </div>
      </div>

      <GenerateMeetLink
        modalOpen={meetLinkModal}
        handleClose={handleCloseMeetLinkModal}
        loading={generateLinkMutation.isPending}
        success={generateLinkMutation.isSuccess}
        heading="Generate New Meet Link"
        subHeading="Select date and time for the meeting"
        handleGenerateLink={handleGenerateLink}
      />
    </>
  );
});

Section1.displayName = "Section1";

export default Section1;
