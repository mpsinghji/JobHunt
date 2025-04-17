import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import CompanyTable from "./CompanyTable.jsx";
import { useNavigate } from "react-router-dom";
import useGetCompanies from "../../hooks/useGetCompanies";
import { useDispatch, useSelector } from "react-redux";
import { setSearchCompanyByText } from "../../redux/companySlice";

const Companies = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allCompanies = [], searchCompanyByText } = useSelector((state) => state.company);
  const [filteredCompanies, setFilteredCompanies] = useState(allCompanies);
  const { isLoading, error } = useGetCompanies();

  // Filter companies when search text or companies list changes
  React.useEffect(() => {
    if (!searchCompanyByText) {
      setFilteredCompanies(allCompanies);
      return;
    }

    const filtered = allCompanies.filter((company) =>
      company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [searchCompanyByText, allCompanies]);

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
        {isLoading ? (
          <div className="text-center py-8">Loading companies...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <CompanyTable companies={filteredCompanies} />
        )}
      </div>
    </>
  );
};

export default Companies;
