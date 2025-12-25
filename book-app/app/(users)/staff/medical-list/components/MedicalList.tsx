"use client";

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useAppSelector, useAppDispatch } from "@/app/redux/hook";
import { getAllMedicalForm } from "@/app/redux/slices/staff-medical/medical.slices";
import { useRouter } from "next/navigation";

export default function MedicalListClient() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { medicalList } = useAppSelector((state) => state.medical);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    dispatch(getAllMedicalForm());
  }, [dispatch]);

  // Chỉ search theo tên bệnh nhân
  const filteredItems = medicalList?.filter((item) =>
    item.patient?.username.toLowerCase().includes(filterText.toLowerCase())
  );

  // Chuyển sang trang detail
  const handleView = (id: string) => {
    console.log("Navigating to ID:", id);
    router.push(`/staff/medical-list/${id}`);
  };

  const columns = [
    { name: "Tên bệnh nhân", selector: (row) => row.patient?.username, sortable: true, width: "150px" },
    { name: "Email", selector: (row) => row.patient?.email, sortable: true, width: "180px" },
    { name: "Mô tả", selector: (row) => row.description, sortable: true, width: "250px" },
    { name: "Trạng thái", selector: (row) => row.status, sortable: true, width: "120px" },
    { name: "Ngày tạo", selector: (row) => row.createdAt, sortable: true, width: "160px" },
    {
      name: "Hành động",
      cell: (row) => (
        <button
          onClick={() => handleView(row._id)}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          Kiểm tra
        </button>
      ),
      width: "120px",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">Danh sách bệnh nhân</h1>

      <input
        type="text"
        placeholder="Tìm kiếm theo tên bệnh nhân"
        className="border p-2 mb-4 rounded w-full"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      <DataTable
        columns={columns}
        data={filteredItems || []}
        pagination
        highlightOnHover
        responsive
      />
    </div>
  );
}
