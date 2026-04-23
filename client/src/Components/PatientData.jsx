import { useNavigate,useLocation } from "react-router-dom"

import PData from "./PData";

import "../index.css";

export default function PatientData() {

    const location = useLocation();

    const data = location.state;

    console.log("FULL location.state:", data);

    console.log("patients array:", data?.patients?.data);

    const patients = data?.patients?.data;

    return <PData patients={patients} />;
}