import React from "react";
import { MedicineResultDto } from "@/dto/MedicineResultDto";

interface MedicineDetailTableProps {
  medicine: MedicineResultDto;
}

const MedicineDetailTable: React.FC<MedicineDetailTableProps> = ({ medicine }) => {
  return (
    <div className="details">
      <table className="medicine_table">
        <tbody>
          <tr>
            <th>분류</th>
            <td>{medicine.className}</td>
          </tr>
          <tr>
            <th>외형</th>
            <td>{medicine.chart}</td>
          </tr>
          <tr>
            <th>제조사</th>
            <td>{medicine.entpName}</td>
          </tr>
          <tr>
            <th>크기</th>
            <td>
              {medicine.lengLong} mm x {medicine.lengShort} mm x {medicine.thick} mm
            </td>
          </tr>
          <tr>
            <th>제형</th>
            <td>{medicine.formCodeName}</td>
          </tr>
          <tr>
            <th>모양</th>
            <td>{medicine.drugShape}</td>
          </tr>
          <tr>
            <th>색상</th>
            <td>{medicine.colorClass1}</td>
          </tr>
          {medicine.storageMethod && (
            <tr>
              <th>저장 방법</th>
              <td>{medicine.storageMethod}</td>
            </tr>
          )}
          {medicine.validTerm && (
            <tr>
              <th>유효기간</th>
              <td>{medicine.validTerm}</td>
            </tr>
          )}
          {medicine.packUnit && (
            <tr>
              <th>포장 단위</th>
              <td>{medicine.packUnit}</td>
            </tr>
          )}
          {medicine.meterialName && (
            <tr>
              <th>재료명</th>
              <td>{medicine.meterialName}</td>
            </tr>
          )}
          <tr>
            <th>전문/일반 구분</th>
            <td>{medicine.etcOtcName}</td>
          </tr>
          <tr>
            <th>허가 날짜</th>
            <td>
              {medicine.itemPermitDate
                ? new Date(medicine.itemPermitDate).toISOString().split("T")[0]
                : "N/A"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MedicineDetailTable;