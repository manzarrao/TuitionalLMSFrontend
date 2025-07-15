export const getConclusionTypeStyles = (conclusionType: string) => {
  const baseStyles = {
    width: "max-content",
    padding: "5px 10px",
    borderRadius: "5px",
  };

  let colorStyles = {};

  switch (conclusionType) {
    case "Cancelled":
      colorStyles = { color: "#653838", backgroundColor: "#FFACAC" };
      break;
    case "Conducted":
      colorStyles = { color: "#286320", backgroundColor: "#A0FFC0" };
      break;
    case "Student Absent":
      colorStyles = { color: "#05445e", backgroundColor: "#85ddee" };
      break;
    case "Teacher Absent":
      colorStyles = { color: "#2F3282", backgroundColor: "#DBDCFF" };
      break;
    default: // No Show or any other
      colorStyles = { color: "#CC5500", backgroundColor: "#f9e79f" };
  }

  return { ...baseStyles, ...colorStyles };
};

export const getTagTypeStyles = (tag: string) => {
  const baseStyles = {
    padding: "5px 10px",
    fontSize: "var(--small-text-size-vh)",
    lineHeight: "var(--small-text-size-vh)",
    borderRadius: "5px",
  };

  let colorStyles = {};

  switch (tag) {
    case "External":
      colorStyles = { color: "#653838", backgroundColor: "#FFACAC" };
      break;
    case "Normal":
      colorStyles = { color: "#286320", backgroundColor: "#A0FFC0" };
      break;
    case "Extra":
      colorStyles = { color: "#05445e", backgroundColor: "#85ddee" };
      break;
    case "Manual":
      colorStyles = { color: "#CC5500", backgroundColor: "#f9e79f" };
      break;
    default: // No Show or any other
      colorStyles = { color: "#2F3282", backgroundColor: "#DBDCFF" };
  }

  return { ...baseStyles, ...colorStyles };
};
