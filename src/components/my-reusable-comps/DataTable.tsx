import { HiPencil, HiTrash } from "react-icons/hi2";

import { PiExportBold } from "react-icons/pi";

import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { IoMdTime } from "react-icons/io";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
} from "../ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface HeaderProps {
  columns: string[];
  sortable?: boolean;
  onSort?: (selectedSort: {
    column: string;
    direction: "asc" | "desc" | "";
  }) => void;
  OnAllSelectChecked?: (checked: boolean) => void;
  onAllDelete?: () => void;
}
function Header({
  columns,
  sortable = true,
  onSort,
  OnAllSelectChecked,
  onAllDelete,
}: HeaderProps) {
  const [sortColumn, setSortColumn] = useState("");
  const [direction, setDirection] = useState("");

  const handleSort = (column: string) => {
    if (sortable) {
      if (sortColumn === column) {
        const newDirection =
          direction === ""
            ? "asc"
            : direction === "asc"
            ? "desc"
            : direction === "desc"
            ? ""
            : "asc";
        setDirection(newDirection);
        onSort?.({ column, direction: newDirection });
      } else {
        setSortColumn(column);
        setDirection("");
        onSort?.({ column, direction: "asc" });
      }
    }
  };
  const handleAllSelectChecked = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    OnAllSelectChecked?.(event.target.checked);
  };

  const handleAllDelete = () => {
    onAllDelete?.();
  };

  return (
    <TableRow className="hover:bg-[rgb(245,245,245)] bg-[rgb(250,250,250)]">
      {columns.map((column, index) => (
        <TableHead
          key={index}
          onClick={() => {
            handleSort(column);
          }}
          className="cursor-pointer"
        >
          <div className="flex w-full h-full justify-between items-center">
            {column}
            {sortable && <div className="flex flex-col h-7">
              <ChevronUp className={`w-4 ${direction === 'asc' ? 'text-[#121212]' : ''}`} />
              <ChevronDown className={`w-4 ${direction === 'desc' ? 'text-[#121212]' : ''}`} />
            </div>}
          </div>
        </TableHead>
      ))}
      <TableHead>
        <div className=" px-2 pr-10 flex w-full h-full justify-between items-center">
          <div className="w-20 h-5 flex justify-end gap-5 pr-3 items-center">
            <HiTrash  className="text-[#ccc]" />
          </div>
          <Checkbox />
        </div>
      </TableHead>
    </TableRow>
  );
}
function Row() {
  return (
    <TableRow>
      <TableCell>
        Mohammed
        <p className="text-[10px] font-light leading-3">0611165517</p>
      </TableCell>
      <TableCell>
        <div className="w-full flex justify-between items-center pr-10">
          <p>3</p>
          <span className="w-10 h-7 flex justify-around items-center bg-amber-100 rounded-lg">
            2 <IoMdTime />
          </span>
        </div>
      </TableCell>
      <TableCell className="font-medium">200 DH</TableCell>
      <TableCell className="font-medium">
        <span className="px-3 py-1 w-fit flex justify-around items-center rounded-lg">
          -50 DH
        </span>
      </TableCell>
      <TableCell>
        <div className=" px-2 pr-10 flex w-full h-full justify-between items-center">
          <div className="w-20 h-5 flex justify-end gap-5 pr-3 items-center">
            <HiPencil />
            <HiTrash className="text-heumint-danger/60" />
          </div>
          <Checkbox />
        </div>
      </TableCell>
    </TableRow>
  );
}
function TableExport() {
  return (
    <Button className="w-30 justify-between flex" variant="secondary">
      export <PiExportBold className="w-4 h-4 ml-2" />
    </Button>
  );
}
function TableSearch() {
  return <Input type="search" className="w-fit" placeholder="Search..." />;
}

function DataTable() {
  const columns = ['Client', 'Joined', 'Total Debt', 'Total Remaining'];
  return (
    <div className="flex flex-col gap-3">
      <div className="px-2 flex justify-start gap-3">
        <div>
          <TableSearch />
        </div>
        <TableExport />
      </div>
      <Table>
        <TableHeader>
          <Header columns={columns}  sortable={true} />
        </TableHeader>
        <TableBody>
          <Row />
        </TableBody>
      </Table>
    </div>
  );
} 

export default DataTable