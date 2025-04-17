import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import CompanyTable from "./CompanyTable.jsx";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "../../hooks/useGetAllCompanies";
import { useDispatch, useSelector } from "react-redux";
import { setSearchCompanyByText } from "../../redux/companySlice";

const Companies = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companies = [], searchCompanyByText } = useSelector((state) => state.company);
  const [filteredCompanies, setFilteredCompanies] = useState(companies);

  useGetAllCompanies();

  // Filter companies when search text or companies list changes
  React.useEffect(() => {
    if (!searchCompanyByText) {
      setFilteredCompanies(companies);
      return;
    }

    const filtered = companies.filter((company) =>
      company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [searchCompanyByText, companies]);

  const handleSearchChange = (e) => {
    dispatch(setSearchCompanyByText(e.target.value));
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-fit"
            placeholder="Filter by name"
            value={searchCompanyByText || ""}
            onChange={handleSearchChange}
          />
          <Button onClick={() => navigate("/admin/companies/create")}>
            New Company
          </Button>
        </div>
        <CompanyTable companies={filteredCompanies} />
      </div>
    </>
  );
};

export default Companies;
