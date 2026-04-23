import { Routes,Route } from "react-router-dom"
import Home from "./Components/Home"
import PatientData from "./Components/PatientData"
import User from "./Components/User"


export default function App(){

  return(

    <div>
      <div>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/data" element={<PatientData/>} />
          <Route path="/User" element={<User/>}/>
        </Routes>
      </div>
    </div>
  )
}
