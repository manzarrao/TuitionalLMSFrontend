import React, { FC, useCallback } from "react";
import styles from "./card.module.css";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/global/button/button";

interface CardProps {
  time: string; // ISO or custom format for the time the class started
  name: string; // Name of the teacher/student
  subject: string; // Subject of the class
  board: string; // Educational board (e.g., CBSE, IGCSE)
  grade: string; // Grade level or class standard
  curriculum: string; // Type of curriculum followed
  profileImageUrl?: string; // Optional URL for the profile image; defaults provided
  students?: any[];
  meet_link?: string;
  rescheduled?: any;
  handleExtendClass: (duration: number, openModal: boolean) => void; // Function to handle extending the class
  duration: number;
}

const Card: FC<CardProps> = ({
  time,
  name,
  subject,
  board,
  grade,
  curriculum,
  profileImageUrl,
  meet_link,
  students,
  rescheduled,
  handleExtendClass,
  duration,
}) => {
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
    <div className={styles.cardBox}>
      <div className={styles.firstBox}>
        {rescheduled && <p className={styles.rescheduled}>Rescheduled</p>}
        <p>Started at</p>
        <p>{checkTimeFormat(time) || "No Show"}</p>
      </div>
      <div className={styles.secondBox}>
        <div className={styles.infoBox}>
          <div className={styles.nameImageSubjectBox}>
            <div className={styles.nameImageBox}>
              <div className={styles.imageBox}>
                <Image
                  src={profileImageUrl || "/assets/images/static/demmyPic.png"}
                  alt="Profile image"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <p>{name.split(" ").slice(0, 2).join(" ") || "No Show"}</p>
            </div>
            <div className={styles.line}></div>
            <p>{subject || "No Show"}</p>
            <div className={styles.line}></div>
            <p>{duration + " mins" || "No Show"}</p>
          </div>
          <div className={styles.studentsBox}>
            <div className={styles.imagesBox}>
              <div className={styles.imageBox}>
                <Image
                  src={
                    (students && students[0]?.user?.profileImageUrl) ||
                    "/assets/images/static/demmyPic.png"
                  }
                  alt={(students && students[0]?.name) || "Student"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              {students && students.length > 1 && (
                <div className={styles.imageBox}>
                  <Image
                    src={
                      students[1]?.user?.profileImageUrl ||
                      "/assets/images/static/demmyPic.png"
                    }
                    alt={students[1]?.user?.name || "Student"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
            </div>
            <p>
              {students && students[0]?.user?.name
                ? `${students[0]?.user?.name
                    .split(" ")[0]
                    .charAt(0)
                    .toUpperCase()}${students[0]?.user?.name
                    .split(" ")[0]
                    .slice(1)}`
                : "No Show"}

              {students &&
                students[1]?.user?.name &&
                `, ${students[1]?.user?.name
                  .split(" ")[0]
                  .charAt(0)
                  .toUpperCase()}${students[1]?.user?.name
                  .split(" ")[0]
                  .slice(1)}`}

              {students && students.length > 2 && (
                <>
                  &nbsp;
                  <span>{`+${students.length - 2} more`}</span>
                </>
              )}
            </p>
          </div>
          <div className={styles.bottomBox}>
            <p>{board || "No Show"}</p>
            <p>{grade || "No Show"}</p>
            <p>{curriculum || "No Show"}</p>
          </div>
        </div>

        <div className={styles.actionsBox}>
          <Button
            text="Extend Class"
            inlineStyling={{ padding: "10px", height: "max-content" }}
            clickFn={() => handleExtendClass(duration, true)}
          />
          <Link
            href={meet_link || ""}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.button}
          >
            {"Join Now"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
