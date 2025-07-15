// Import required modules
import React, { FC } from "react";
import classes from "./card.module.css";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/global/button/button";
import { useAppSelector } from "@/lib/store/hooks/hooks";

interface CardProps {
  time: string; // ISO or custom format for the time the class started
  name: string; // Name of the teacher/student
  subject: string; // Subject of the class
  profileImageUrl?: string; // Optional URL for the profile image; defaults provided
  meet_link?: string;
  rescheduled?: boolean;
  students?: any[];
  role?: number; // Role of the user (e.g., teacher, student)
  duration: number | null;
  handleExtendClass: (duration: number | null, openModal: boolean) => void; // Function to handle extending the class
}

const Card: FC<CardProps> = ({
  time,
  name,
  subject,
  profileImageUrl,
  meet_link,
  rescheduled,
  students,
  role,
  duration,
  handleExtendClass,
}) => {
  console.log("ajsgdhkg", duration);
  const { user } = useAppSelector((state) => state.user);
  const isLarge = window.innerWidth < 577;
  const checkTimeFormat = (time: string) => {
    if (!time) return "Invalid Time";
    if (time.includes("T")) {
      return moment
        .utc(time, "YYYY-MM-DDTHH:mm:ss.SSSZ")
        .local()
        .format("hh:mm A");
    }
    return moment.utc(time, "HH:mm:ss").local().format("hh:mm A");
  };
  return (
    <div className={classes.cardBox}>
      <div className={classes.firstBox}>
        {rescheduled && <p className={classes.rescheduled}>Rescheduled</p>}
        <p>Started at</p>
        <p>{checkTimeFormat(time) || "No Show"}</p>{" "}
      </div>
      <div className={classes.secondBox}>
        <div className={classes.infoBox}>
          {role === 3 && (
            <>
              {" "}
              <div className={classes.nameImageBox}>
                <div className={classes.imageBox}>
                  <Image
                    src={
                      profileImageUrl || "/assets/images/static/demmyPic.png"
                    }
                    alt="Profile image"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <p>{name.split(" ").slice(0, 2).join(" ")}</p>
              </div>
              <div className={classes.line}></div>
            </>
          )}
          {role === 5 && (
            <>
              {" "}
              <div className={classes.studentsBox}>
                <div className={classes.imagesBox}>
                  <div className={classes.imageBox}>
                    <Image
                      src={
                        (students && students[0]?.user?.profileImageUrl) ||
                        "/assets/images/demmyPic.png"
                      }
                      alt={(students && students[0]?.user?.name) || "Student"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  {students && students[1] && (
                    <div className={classes.imageBox2}>
                      <Image
                        src={
                          students[1]?.user?.profileImageUrl ||
                          "/assets/images/demmyPic.png"
                        }
                        alt={students[1]?.user?.name ?? "Student"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                </div>
                <p>
                  {(students && students[0]?.user?.name?.split(" ")[0]) ||
                    "No Show"}
                  {students &&
                    students[1] &&
                    `, ${students[1]?.user?.name?.split(" ")[0]}`}
                  {students && students?.length > 2 && (
                    <div>
                      &nbsp;
                      <p>
                        {students?.length > 2
                          ? `+${students?.length - 2} more`
                          : null}
                      </p>
                    </div>
                  )}
                </p>
              </div>
              <div className={classes.line}></div>
            </>
          )}

          <p className={classes.subjectBox}>{subject || "No Show"}</p>
          <div className={classes.line}></div>
          <p>{duration + " min" || "No Show"}</p>
        </div>
        <div className={classes.actions}>
          {user?.roleId === 5 && (
            <Button
              clickFn={() => handleExtendClass(duration, true)}
              text="Extend Class"
              inlineStyling={{
                width: "max-content",
                padding: "10px",
                height: "max-content",
              }}
            />
          )}

          <Link
            href={meet_link || ""}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.button}
          >
            {"Join Now"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
