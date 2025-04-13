import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal } from "lucide-react";

const CompanyTable = () => {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableCaption className="text-lg font-medium text-gray-500">
          Registered Companies
        </TableCaption>
        <TableHeader>
          <TableRow className="border-b-2 border-gray-100">
            <TableHead className="w-[80px] font-semibold text-gray-600">Logo</TableHead>
            <TableHead className="font-semibold text-gray-600">Company Name</TableHead>
            <TableHead className="font-semibold text-gray-600">Date</TableHead>
            <TableHead className="text-right font-semibold text-gray-600">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-gray-50">
            <TableCell>
              <Avatar className="h-12 w-12 border-2 border-gray-100">
                <AvatarImage src="/logo2.png" alt="Company Logo" className="object-cover" />
              </Avatar>
            </TableCell>
            <TableCell className="font-medium text-gray-900">Company name</TableCell>
            <TableCell className="text-gray-500">Date</TableCell>
            <TableCell className="text-right">
              <Popover>
                <PopoverTrigger className="rounded-full p-2 hover:bg-gray-100">
                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                </PopoverTrigger>
                <PopoverContent className="w-36 rounded-lg border border-gray-100 p-2 shadow-lg">
                  <div className="flex items-center gap-2 rounded-md p-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Edit2 className="h-4 w-4" />
                    <span>Edit</span>
                  </div>
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyTable;
