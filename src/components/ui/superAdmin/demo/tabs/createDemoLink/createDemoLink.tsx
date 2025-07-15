import React from "react";
import classes from "./createDemoLink.module.css";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Typography from "@mui/material/Typography";
import DropDown from "@/components/global/dropDown-objects/dropDown-objects";
import InputField from "@/components/global/input-field/input-field";
import Button from "@/components/global/button/button";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import VideoCameraFrontOutlinedIcon from "@mui/icons-material/VideoCameraFrontOutlined";
import DatePicker from "@/components/global/date-picker/date-picker";

const emptyState = {
  teacher: "",
  subject: "",
  grade: "",
  curriculum: "",
  studentName: "",
  parentName: "",
  demoDuration: "",
  time: "",
};

const reducer = (state: any, action: any) => {
  state = { ...state, [action.name]: action.value };
  return state;
};

const CreateDemoLink = () => {
  const { teachers } = useAppSelector((state) => state?.usersByGroup);
  const { subject, curriculum, grades } = useAppSelector(
    (state) => state?.resources
  );
  const [formData, dispatch] = React.useReducer(reducer, emptyState);

  const handleSubmit = () => {
    console.log(formData);
  };
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div>
          <AddOutlinedIcon sx={{ width: "2rem", height: "2rem" }} />
          <p>Create Demo Link</p>
        </div>
        <p>
          Generate a new Google Meet demo session link for one-on-one student
          sessions
        </p>
      </div>
      <form className={classes.contentBox}>
        <div className={classes.fields}>
          <Typography variant="body2">Teacher</Typography>
          <DropDown
            placeholder="Select Teacher"
            data={teachers?.users?.map((item) => JSON.stringify(item))}
            handleChange={(e: any) =>
              dispatch({
                name: "teacher_name",
                value: JSON.parse(e.target.value).name,
              })
            }
            value={formData.teacher}
          />
        </div>
        <div className={classes.fields}>
          <Typography variant="body2">Subject</Typography>
          <DropDown
            placeholder="Select Subject"
            data={subject?.map((item) => JSON.stringify(item))}
            handleChange={(e: any) =>
              dispatch({
                name: "subject",
                value: JSON.parse(e.target.value).name,
              })
            }
            value={formData.subject}
          />
        </div>
        <div className={classes.fields}>
          <Typography variant="body2">Grade</Typography>
          <DropDown
            placeholder="Select Grade"
            data={grades?.map((item) => JSON.stringify(item))}
            handleChange={(e: any) =>
              dispatch({
                name: "grade",
                value: JSON.parse(e.target.value).name,
              })
            }
            value={formData.grade}
          />
        </div>

        <div className={classes.fields}>
          <Typography variant="body2">Curriculum</Typography>
          <DropDown
            placeholder="Select Curriculum"
            data={curriculum?.map((item) => JSON.stringify(item))}
            handleChange={(e: any) =>
              dispatch({
                name: "curriculum",
                value: JSON.parse(e.target.value).name,
              })
            }
            value={formData.curriculum}
          />
        </div>
        <div className={classes.fields}>
          <Typography variant="body2">Student Name</Typography>
          <InputField
            placeholder="Enter student name"
            value={formData.student_name}
            changeFunc={(e) =>
              dispatch({
                name: "student_name",
                value: e.target.value,
              })
            }
          />
        </div>
        <div className={classes.fields}>
          <Typography variant="body2">Parent Name</Typography>
          <InputField
            // inputBoxStyles={styles?.inputStyles}
            placeholder="Enter parent name"
            value={formData.parent_name}
            changeFunc={(e) =>
              dispatch({
                name: "parent_name",
                value: e.target.value,
              })
            }
          />
        </div>
        <div className={classes.fields}>
          <Typography variant="body2">Demo Duration (minutes)</Typography>
          <InputField
            // inputBoxStyles={styles?.inputStyles}
            placeholder="Enter demo duration"
            value={formData.demo_duration}
            changeFunc={(e) =>
              dispatch({
                name: "demo_duration",
                value: e.target.value,
              })
            }
          />
        </div>
        <div className={classes.fields}>
          <Typography variant="body2">Time</Typography>
          <InputField
            // inputBoxStyles={styles?.inputStyles}
            placeholder="Enter time"
            value={formData.time}
            changeFunc={(e) =>
              dispatch({
                name: "time",
                value: e.target.value,
              })
            }
          />
        </div>
        <div className={classes.fields}>
          <Typography variant="body2">Date</Typography>
          <DatePicker
            placeholder="Select Date and Time"
            changeFn={(date) => dispatch({ name: "date", value: date })}
            value={formData.date}
            boxShadow="0px 1px 4px rgba(0, 0, 0, 0.08)"
            height="5.5vh"
            maxHeight="50px"
            minHeight="35px"
          />
        </div>
      </form>
      <Button
        inlineStyling={{ width: "100%", borderRadius: "7.5px" }}
        text="Generate Google Meet Demo Link"
        icon={<VideoCameraFrontOutlinedIcon />}
        clickFn={handleSubmit}
        //   loading={loading}
        //   disabled={loading}
      />
    </div>
  );
};

export default CreateDemoLink;
