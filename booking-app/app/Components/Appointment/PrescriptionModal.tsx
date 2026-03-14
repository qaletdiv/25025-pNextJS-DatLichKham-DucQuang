"use client";

import { useState, useEffect } from "react";
import { getPills, createPrescription } from "@/app/(Role)/doctor/action";

interface Pill {
  _id: string;
  name: string;
  unit: string;
  price: number;
  description: string;
}

interface Medicine {
  pill: string;
  dosage: string;
  quantity: number;
  instruction: string;
}

interface Props {
  appointmentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PrescriptionModal = ({ appointmentId, onClose, onSuccess }: Props) => {
  const [pills, setPills] = useState<Pill[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([
    { pill: "", dosage: "", quantity: 1, instruction: "" },
  ]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingPills, setFetchingPills] = useState(true);

  useEffect(() => {
    const fetchPills = async () => {
      const result = await getPills();
      setPills(result.pills || []);
      setFetchingPills(false);
    };
    fetchPills();
  }, []);

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { pill: "", dosage: "", quantity: 1, instruction: "" },
    ]);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleChangeMedicine = (
    index: number,
    field: keyof Medicine,
    value: string | number,
  ) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const handleSubmit = async () => {
    // Validate
    const isValid = medicines.every((m) => m.pill && m.dosage && m.quantity);
    if (!isValid) {
      alert("Vui lòng điền đầy đủ thông tin thuốc");
      return;
    }

    setLoading(true);
    try {
      const result = await createPrescription({
        appointmentId,
        medicines,
        note,
      });

      if (result.error) {
        alert(result.error);
        return;
      }

      alert("Kê toa thuốc thành công!");
      onSuccess();
      onClose();
    } catch (err) {
      alert("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[80vh] bg-white rounded-xl shadow-2xl z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Kê toa thuốc</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>

          {fetchingPills ? (
            <div className="text-center py-8 text-gray-500">
              Đang tải danh sách thuốc...
            </div>
          ) : (
            <div className="space-y-4">
              {/* Danh sách thuốc */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Danh sách thuốc</h4>
                  <button
                    onClick={handleAddMedicine}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Thêm thuốc
                  </button>
                </div>

                <div className="space-y-3">
                  {medicines.map((medicine, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">
                          Thuốc {index + 1}
                        </span>
                        {medicines.length > 1 && (
                          <button
                            onClick={() => handleRemoveMedicine(index)}
                            className="text-red-400 hover:text-red-600 text-xs"
                          >
                            Xóa
                          </button>
                        )}
                      </div>

                      {/* Chọn thuốc */}
                      <select
                        value={medicine.pill}
                        onChange={(e) =>
                          handleChangeMedicine(index, "pill", e.target.value)
                        }
                        className="w-full border rounded px-3 py-2 text-sm"
                      >
                        <option value="">-- Chọn thuốc --</option>
                        {pills.map((pill) => (
                          <option key={pill._id} value={pill._id}>
                            {pill.name} ({pill.unit})
                          </option>
                        ))}
                      </select>

                      <div className="grid grid-cols-2 gap-2">
                        {/* Liều lượng */}
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">
                            Liều lượng
                          </label>
                          <input
                            type="text"
                            value={medicine.dosage}
                            onChange={(e) =>
                              handleChangeMedicine(
                                index,
                                "dosage",
                                e.target.value,
                              )
                            }
                            placeholder="500mg"
                            className="w-full border rounded px-3 py-2 text-sm"
                          />
                        </div>

                        {/* Số lượng */}
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">
                            Số lượng
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={medicine.quantity}
                            onChange={(e) =>
                              handleChangeMedicine(
                                index,
                                "quantity",
                                Number(e.target.value),
                              )
                            }
                            className="w-full border rounded px-3 py-2 text-sm"
                          />
                        </div>
                      </div>

                      {/* Hướng dẫn */}
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Hướng dẫn sử dụng
                        </label>
                        <input
                          type="text"
                          value={medicine.instruction}
                          onChange={(e) =>
                            handleChangeMedicine(
                              index,
                              "instruction",
                              e.target.value,
                            )
                          }
                          placeholder="Uống sau ăn"
                          className="w-full border rounded px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ghi chú */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Ghi chú
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nghỉ ngơi nhiều, uống đủ nước..."
                  rows={3}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 border py-2 rounded hover:bg-gray-50 text-sm"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                >
                  {loading ? "Đang lưu..." : "Lưu toa thuốc"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PrescriptionModal;