import React from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import CompanyTable from "./CompanyTable.jsx";
import { useNavigate } from "react-router-dom";

const Companies = () => {
    const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex item-center justify-between my-5">
            <Input className="w-fit" placeholder="Filter by name"/>
            <Button onClick={()=>navigate("/admin/companies/create")}>New Company</Button>
        </div>
            <CompanyTable/>
      </div>
    </>
  );
};

export default Companies;
