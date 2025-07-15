import styles from "./calender.module.css";
import React, { FC, useMemo, memo, useCallback } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Create localizer once outside component
const localizer = momentLocalizer(moment);

// Define types clearly
interface TeacherSchedule {
  start_time: string;
  session_duration: number;
}

interface Enrollment {
  id: number;
  subject?: {
    name: string;
  };
  tutor?: {
    name: string;
    profileImageUrl: string;
  };
  students?: {
    name: string;
    profileImageUrl: string;
  }[];
}

interface SlotData {
  id: number;
  class_status?: "CANCELLED" | "SCHEDULED" | "OTHER_STATUS";
  enrollment?: Enrollment;
  teacherSchedule?: TeacherSchedule;
  DateTime?: string;
  duration?: number;
}

interface Event {
  id: number;
  slotData: SlotData;
  title?: string;
  status?: boolean | string;
  start: Date;
  end: Date;
  duration?: number;
}

interface HandleNormalSlotProps {
  open: boolean;
  day: string;
  startTime: string;
  endTime: string;
  ids: number[];
  enrollment_id: number | null;
}

interface EventComponentProps {
  event: Event;
  isMonth?: boolean;
  isDay?: boolean;
  isWeek?: boolean;
}

interface ClassScheduleViewProps {
  events: Event[];
  handleCancelledSchedulledSlot?: (data: { id: number; open: boolean }) => void;
  handleNormalSlot?: (data: HandleNormalSlotProps) => void;
}

// Extract CSS into a separate constant to avoid recreation on each render
const CALENDAR_STYLES = `
  .rbc-month-view {
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.4);
  }

  .rbc-toolbar {
    margin-bottom: 5px;
  }

  .rbc-btn-group > button {
    color: var(--black-color);
    font-family: var(--leagueSpartan-regular-400);
    font-size: var(--extraSmall-text-size-vh);
  }

  .rbc-btn-group > :nth-child(1) {
    border-radius: 10px 0px 0px 10px !important;
  }

  .rbc-btn-group > :nth-child(3) {
    border-radius: 0px 10px 10px 0px !important;
  }

  .rbc-btn-group > :nth-child(4) {
    display: none;
  }

  .rbc-today {
    background: #EBF8FF !important;
    border: 2px solid var(--main-color) !important;
  }

  .rbc-time-slot {
    color: var(--black-color);
    font-family: var(--leagueSpartan-medium-500);
    font-size: var(--regular-text-size-vh);
  }

  .rbc-event-label {
    display: none;
  }

  .rbc-month-view {
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.5);
    overflow: hidden;
    backdrop-filter: blur(10px);
  }

  .rbc-btn-group > button:hover {
    background-color: #DDF3FF !important;
  }

  .rbc-toolbar-label {
    color: var(--black-color);
    font-family: var(--leagueSpartan-medium-500);
    font-size: var(--normal-text-size-vh);
  }

  .rbc-toolbar button {
    padding: 5px 10px;
  }

  .rbc-active {
    color: var(--white-color) !important;
    font-family: var(--leagueSpartan-regular-400);
    font-size: var(--extraSmall-text-size-vh);
    background-color: var(--main-color) !important;
    box-shadow: none !important;
  }

  .rbc-header {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rbc-header > span {
    color: #2d2d2d;
    font-family: var(--leagueSpartan-regular-400);
    font-size: var(--regular-text-size-vh);
    line-height: normal;
    font-style: normal;
    leading-trim: both;
    padding: 5px 0px;
  }

  .rbc-event {
    background: transparent;
    border: none !important;
  }

  .rbc-event:focus {
    outline: none;
  }

  .rbc-event.rbc-selected {
    background-color: #DDF3FF;
  }

  .rbc-event > div {
    color: var(--black-color);
    font-family: var(--leagueSpartan-medium-500);
    font-size: 1.4vh;
  }

  .rbc-date-cell {
    text-align: left;
  }

  .rbc-row-segment {
    padding: 0px 10px;
  }

  .rbc-button-link {
    color: #8C8C8C;
    font-family: var(--leagueSpartan-medium-500);
    font-size: var(--regular-text-size-vh);
    padding: 0px 10px;
    padding-top: 2.5px;
  }

  .rbc-show-more {
    color: var(--black-color);
    font-family: var(--leagueSpartan-light-300);
    font-size: 1.4vh;
  }
`;

// Utility function for formatting time outside component
const formatEventTime = (
  startTime: string | undefined,
  dateTime: string | undefined
): string => {
  if (startTime) {
    return moment.utc(startTime, "HH:mm:ss").local().format("h:mm a");
  } else if (dateTime) {
    return moment.utc(dateTime).local().format("h:mm a");
  }
  return "";
};

// Event Component with proper memoization
const EventComponent: FC<EventComponentProps> = memo(
  ({ event, isMonth, isDay, isWeek }) => {
    // Determine colors based on event status
    const isInactive = event?.status === false || event?.status === "CANCELLED";
    const isScheduled = event?.status === "SCHEDULED";

    const eventStyles = useMemo(
      () => ({
        backgroundColor: isInactive
          ? "#FECDCD"
          : isScheduled
          ? "#DAFFF0"
          : "var(--light-blue)",
        borderLeft: isInactive
          ? "3px solid #FF0000"
          : isScheduled
          ? "3px solid #008000"
          : "3px solid var(--main-color)",
      }),
      [isInactive, isScheduled]
    );

    const textColor = useMemo(
      () =>
        isInactive ? "#FF0000" : isScheduled ? "#008000" : "var(--main-color)",
      [isInactive, isScheduled]
    );

    // Pre-compute formatted time
    const formattedTime = useMemo(
      () =>
        formatEventTime(
          event?.slotData?.teacherSchedule?.start_time,
          event?.slotData?.DateTime
        ),
      [event?.slotData?.teacherSchedule?.start_time, event?.slotData?.DateTime]
    );

    const sessionDuration =
      event?.slotData?.teacherSchedule?.session_duration ||
      event?.slotData?.duration;
    const subjectName = event?.slotData?.enrollment?.subject?.name;
    const title = event?.title ?? "No Show";

    return (
      <div className={styles.field} style={eventStyles}>
        <div className={styles.wrapper}>
          <p className={styles.textFields}>{subjectName}</p>
          <div className={styles.timeBox}>
            <p style={{ color: "var(--text-color)" }}>{formattedTime}</p>
            {<p style={{ color: textColor }}>{sessionDuration} min</p>}
          </div>
        </div>
        <p className={styles.textFields}>{title}</p>
      </div>
    );
  }
);

EventComponent.displayName = "EventComponent";

const ClassScheduleView: FC<ClassScheduleViewProps> = ({
  events,
  handleCancelledSchedulledSlot,
  handleNormalSlot,
}) => {
  // Define event handlers with useCallback
  const handleEventClick = useCallback(
    (e: Event) => {
      const isCancelledOrScheduled =
        e?.slotData?.class_status === "CANCELLED" ||
        e?.slotData?.class_status === "SCHEDULED";

      if (isCancelledOrScheduled && handleCancelledSchedulledSlot) {
        handleCancelledSchedulledSlot({
          id: e.id,
          open: true,
        });
      } else if (handleNormalSlot) {
        handleNormalSlot({
          open: true,
          day: moment(e.start).format("dddd"),
          startTime: moment(e.start).format("hh:mmA"),
          endTime: moment(e.end).format("hh:mmA"),
          ids: [e.id],
          enrollment_id: e?.slotData?.enrollment?.id ?? null,
        });
      }
    },
    [handleCancelledSchedulledSlot, handleNormalSlot]
  );

  // Memoize components to avoid recreation
  const components = useMemo(
    () => ({
      month: {
        event: (props: any) => <EventComponent {...props} isMonth />,
      },
      day: {
        event: (props: any) => <EventComponent {...props} isDay />,
      },
      week: {
        event: (props: any) => <EventComponent {...props} isWeek />,
      },
    }),
    []
  );

  // Pre-compute current date
  const now = useMemo(() => moment().toDate(), []);

  return (
    <>
      <style>{CALENDAR_STYLES}</style>

      <Calendar
        localizer={localizer}
        events={events}
        components={components}
        startAccessor="start"
        endAccessor="end"
        className={styles.container}
        defaultView={Views.WEEK}
        getNow={() => now}
        scrollToTime={now}
        onSelectEvent={handleEventClick}
      />
    </>
  );
};

export default memo(ClassScheduleView);
