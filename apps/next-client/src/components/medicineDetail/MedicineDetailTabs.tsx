import React from "react";

interface MedicineDetailTabsProps {
  activeTab: "all" | "efficacy" | "dosage" | "precautions";
  setActiveTab: (tab: "all" | "efficacy" | "dosage" | "precautions") => void;
}

const MedicineDetailTabs: React.FC<MedicineDetailTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <ul className="tab_menu">
      {["all", "efficacy", "dosage", "precautions"].map((tab) => (
        <li
          key={tab}
          className={`tab_item ${tab} ${activeTab === tab ? "active" : ""}`}
          onClick={() => setActiveTab(tab as "all" | "efficacy" | "dosage" | "precautions")}
        >
          {tab === "all" ? "전체" : tab === "efficacy" ? "효능효과" : tab === "dosage" ? "용법용량" : "주의사항"}
        </li>
      ))}
    </ul>
  );
};

export default MedicineDetailTabs;