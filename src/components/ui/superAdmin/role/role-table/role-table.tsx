import { useState, useEffect, useMemo, CSSProperties } from "react";
import Image from "next/image";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import classes from "./role.module.css";
import moment from "moment";
import { getAllRoles_Api_Response_Type } from "@/types/roles/getAllRoles.type";

interface Column {
  id: number;
  name: string;
  width: string;
}

const headData: Column[] = [
  { id: 1, name: "Id", width: "15%" },
  { id: 2, name: "Role Name", width: "20%" },
  { id: 4, name: "Created At", width: "25%" },
  { id: 5, name: "Updated At", width: "20%" },
  { id: 6, name: "Actions", width: "20%" },
];

interface RoleTablesProps {
  data?: getAllRoles_Api_Response_Type | [];
  onDeleteClick?: (id: number) => void;
  onEditClick?: (item: any) => void;
  onAssignPage?: (item: any) => any;
}

export default function RoleTable({
  data = [],
  onDeleteClick,
  onEditClick,
  onAssignPage,
}: RoleTablesProps) {
  // Handle empty data
  const roles = Array.isArray(data) ? data : [];

  return (
    <div className={classes.tableBox}>
      <div className={classes.tableHead}>
        {headData?.map((item: Column) => (
          <div
            className={classes.tableHeadCell}
            key={item.id}
            style={{ width: item.width }}
          >
            {item.name}
          </div>
        ))}
      </div>

      <Table
        sx={{
          display: "block !important",
          flex: "0 1 calc(100% - 10px)",
          minHeight: "0",
          background: "transparent !important",
          position: "relative !important",
          border: "none !important",
          userSelect: "none !important",
          overflowY: "auto !important",
          overflowX: "hidden !important",
          padding: "5px 10px !important",
          "&::-webkit-scrollbar": {
            width: "5px !important",
            margin: "12px !important",
            position: "relative !important",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
            display: "none",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#9c9c9c",
            borderRadius: "6px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
            cursor: "pointer",
          },
        }}
      >
        <TableBody
          sx={{
            display: "block !important",
            borderRadius: "10px",
            border: "1px solid #d4d4d4",
            position: "relative",
          }}
          className={classes.tableBody}
        >
          {roles.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                align="center"
                sx={{ padding: "20px", color: "#666" }}
              >
                No roles found
              </TableCell>
            </TableRow>
          ) : (
            roles.map((item: any, indx: number) => {
              return (
                <TableRow key={item.id || indx}>
                  {/* Role ID */}
                  <TableCell
                    align="left"
                    width={headData[0].width}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item?.id || "N/A"}
                  </TableCell>

                  {/* Role Name */}
                  <TableCell
                    align="left"
                    width={headData[1].width}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item?.name || "N/A"}
                  </TableCell>

                  {/* Created At */}
                  <TableCell
                    align="left"
                    width={headData[2].width}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item?.createdAt
                      ? moment.utc(item.createdAt).format("Do MMMM YYYY")
                      : "N/A"}
                  </TableCell>

                  {/* Updated At */}
                  <TableCell
                    align="left"
                    width={headData[3].width}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item?.createdAt
                      ? moment.utc(item.updatedAt).format("Do MMMM YYYY")
                      : "N/A"}
                  </TableCell>

                  {/* Actions */}
                  <TableCell
                    align="left"
                    width={headData[4].width}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <div className={classes.iconsContainer}>
                      <span
                        className={classes.iconBox}
                        onClick={() => onEditClick?.(item)}
                        title="Edit Role"
                      >
                        <Image
                          src="/assets/svgs/edit.svg"
                          alt="edit"
                          width={0}
                          height={0}
                          style={{
                            width: "var(--regular-text-size-vh)",
                            height: "var(--regular-text-size-vh)",
                          }}
                        />
                      </span>
                      <span
                        className={classes.iconBox}
                        onClick={() => onDeleteClick?.(item.id)}
                        title="Delete Role"
                      >
                        <Image
                          src="/assets/svgs/delete.svg"
                          alt="delete"
                          width={0}
                          height={0}
                          style={{
                            width: "var(--regular-text-size-vh)",
                            height: "var(--regular-text-size-vh)",
                          }}
                        />
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
