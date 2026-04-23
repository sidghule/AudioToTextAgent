import { useState } from "react";

const conditionColors = {
    "Infections": "#f59e0b",
    "Flu": "#60a5fa",
    "Asthma": "#a78bfa",
    "Heart Disease": "#f87171",
    "Diabetes": "#34d399",
    "Hypertension": "#ac8462",
    "Cancer": "#f87171",
    "Obesity": "#60a5fa",
};

export default function PData({ patients }) {
    const [selectedRow, setSelectedRow] = useState(0);

    if (!patients || patients.length === 0) return <p>No patient data found.</p>;

    const columns = Object.keys(patients[0]);

    return (
        <div style={{
            padding: "24px",
            background: "#0f2a35",
            minHeight: "100vh",
            // overflowX: "auto",
            
            boxSizing: "border-box",
        }}>
            <div style={{
                border: "2px solid #2a5a6e",
                borderRadius: "20px",
                // padding:"2px"
                overflowY:"hidden"
            }}>
                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    color: "#e0f0f5",
                    fontSize: "14px",
                }}>
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col} style={{
                                    padding: "14px 18px",
                                    textAlign: "left",
                                    background: "#0d2b38",
                                    color: "#7dd4e8",
                                    fontWeight: "700",
                                    fontSize: "13px",
                                    letterSpacing: "0.05em",
                                    textTransform: "uppercase",
                                    borderBottom: "2px solid #2a5a6e",
                                    whiteSpace: "nowrap",
                                }}>
                                    {col.replace(/_/g, " ")}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient, rowIndex) => {
                            const isSelected = selectedRow === rowIndex;
                            return (
                                <tr
                                    key={patient.Patient_ID ?? rowIndex}
                                    onClick={() => setSelectedRow(rowIndex)}
                                    style={{
                                        background: isSelected ? "#0e3a50" : rowIndex % 2 === 0 ? "#1a3a47" : "#163240",
                                        cursor: "pointer",
                                        borderLeft: isSelected ? "3px solid #7dd4e8" : "3px solid transparent",
                                        transition: "background 0.15s",
                                    }}
                                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#1f4a5c"; }}
                                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = rowIndex % 2 === 0 ? "#1a3a47" : "#163240"; }}
                                >
                                    {columns.map((col) => {
                                        const value = patient[col];

                                        if (col === "Medical_Condition") {
                                            const color = conditionColors[value] || "#5bc8e0";
                                            return (
                                                <td key={col} style={{ padding: "13px 18px", borderBottom: "1px solid #1e4455", whiteSpace: "nowrap" }}>
                                                    <span style={{
                                                        background: color + "22",
                                                        color: color,
                                                        padding: "3px 10px",
                                                        borderRadius: "20px",
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                        border: `1px solid ${color}55`,
                                                    }}>
                                                        {value}
                                                    </span>
                                                </td>
                                            );
                                        }

                                        if ((col === "Smoker" || col === "Diabetes") && value === "Yes") {
                                            return (
                                                <td key={col} style={{ padding: "13px 18px", borderBottom: "1px solid #1e4455", whiteSpace: "nowrap", color: "#f87171", fontWeight: "600" }}>
                                                    {String(value)}
                                                </td>
                                            );
                                        }

                                        return (
                                            <td key={col} style={{
                                                padding: "13px 18px",
                                                borderBottom: "1px solid #1e4455",
                                                whiteSpace: "nowrap",
                                                color: col === "Patient_ID" ? "#7dd4e8" : "#cce8f0",
                                                fontWeight: col === "Patient_ID" ? "600" : "400",
                                            }}>
                                                {String(value ?? "—")}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}