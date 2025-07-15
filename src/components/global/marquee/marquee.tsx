"use client";
import { FC } from "react";
import Marquee from "react-fast-marquee";
import { useAppSelector } from "@/lib/store/hooks/hooks";

const CustomMarquee: FC = () => {
  const { user } = useAppSelector((state) => state.user);
  return (
    <Marquee
      play={true}
      direction="right"
      speed={50}
      gradient={true}
      gradientColor="rgba(255, 255, 255, 1)"
      pauseOnHover={true}
      autoFill={true}
      style={{
        color: "var(--white-color)",
        backgroundColor: "#474950",
        fontFamily: "var(--leagueSpartan-semiBold-600)",
        fontSize:
          "clamp(var(--normal-text-size-rem), var(--xl-text-size-vw), var(--xl-text-size-rem))",
        height: "max-content",
      }}
    >
      {user?.roleId === 1 || user?.roleId === 2
        ? ""
        : user?.roleId === 3
        ? "No Class Links Will Be Sent On Emails.\u00A0\u00A0\u00A0\u00A0"
        : user?.roleId === 4
        ? "No Class Links Will Be Sent On Emails.\u00A0\u00A0\u00A0\u00A0"
        : user?.roleId === 5
        ? "Verify earnings and report issues by the 2nd — no changes after settlement!\u00A0\u00A0\u00A0\u00A0"
        : ""}
    </Marquee>
  );
};

export default CustomMarquee;
