import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

const CustomPhoneInput: React.FC<PhoneInputProps> = ({ value, onChange }) => {
  return (
    <>
      <style>{`
        .react-tel-input {
          margin: 0 !important;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          border-radius: 10px;
          filter: drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.08)),
          bos-shadow:"none";
          
        }
        .react-tel-input .form-control {
          border: none;
          padding-left: 55px;
          font-size: var(--normal-text-size);
          font-family : var(--leagueSpartan-regular-400);
        }
           .react-tel-input .form-control::placeholder {
          font-size: var(--normal-text-size);
          font-family : var(--leagueSpartan-regular-400);
        }

        .selected-flag{
        border-radius: 10px !important;}
        .flag-dropdown.open{
         border-radius:10px 0px 0px 10px !important;
        }
        .selected-flag:focus{
        border-radius:10px !important;
        }

   
        .react-tel-input .flag-dropdown {
          background-color: transparent; 
          border: none;
          border-right: 1px solid #DCDCDC !important;
          outline: none;
          border-radius: 0;
          height: 100%;
          width:max-content;
          padding-right: 5px;
          border-radius: 10px 0px 0px 0px;
        }
      

      .country-list {
      height:24vh;
          border-radius: 10px !important;
         margin: 2px 0px 0px 0px !important;
           z-index: 9999 !important;
           width: 24vw !important;
           box-shadow: none !important;
          //  border:5px solid red;
        }
//      .country:hover{
// background-color:var(--main-color) !important;
// }

.country.highlight{
background-color:var(--main-color) !important;
}

      .country-name{
      color: var(--black-color)  !important;
      font-size: 1.7vh  !important;
      font-family: var(--leagueSpartan-regular-400) !important;
       }

      .dial-code{
      color: var(--text-color)  !important;
      font-size: 1.7vh  !important;
      font-family: var(--leagueSpartan-regular-400) !important;
       }

      `}</style>
      <PhoneInput
        country={"us"}
        value={value}
        onChange={onChange}
        inputStyle={{
          width: "100%",
          maxHeight: "50px",
          height: "5.5vh",
          minHeight: "35px",
          boxSizing: "border-box",
          // border: "1px solid red",
          backgroundColor: "#FFF",
          boxShadow: "none",
          filter: "drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.08))",
          borderRadius: "10px",
        }}
      />
    </>
  );
};

export default CustomPhoneInput;
