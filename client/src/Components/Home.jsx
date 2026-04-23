import { useState, useRef } from "react";
import axios from "axios";
import "../App.css"
import { useNavigate } from "react-router-dom";

function Home() { 
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [data,setData]=useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null); 
  const [other,setOther]=useState(null);
  const [other1,setOther1]=useState(null);

  console.log("Main result:",result);
  const startRecording = async () => {
    try {
      console.log("inside the try of recording");
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream
          ?.getTracks()
          .forEach(track => track.stop());
        mediaRecorderRef.current = null;
      }

      if (recording){
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = sendAudio;
      recorder.start();
      setRecording(true);

    } catch (err) {
      console.error("Mic error:", err);
      alert("Microphone is locked. Reload page and close other apps.");
    }
  };


  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const sendAudio = async () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;

    const audioBlob = new Blob(audioChunksRef.current, {
      type: "audio/webm",
    });

    const url = URL.createObjectURL(audioBlob);
    setAudioURL(url);

    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.webm");

    try {
      const res = await axios.post(
        "http://localhost:5000/transcribe",
        formData  
      );
      setResult(res.data);
    
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      mediaRecorderRef.current = null; 
    }
  };
  const navigate=useNavigate();

  function clickHandler(){
    navigate("/data",{
        state:{
            patients:result
        }
    });
  }
  function clickHandler1(){
    navigate('/User');
  }

  // console.log("paersed text",parsedData1);

  return (
    <div className="mainContainer">

      <div className="allContent">

          <h2>Say Something To Get Data About Patients</h2>
          <div>
            {
              !recording ? (
              <button onClick={startRecording}>🎙️ Start</button>
              ) : (<button onClick={stopRecording}>⏹️ Stop</button>)
            }

          </div>
          <div>
            {
              result&&<button onClick={clickHandler}>See Your Data</button>
            }
          </div>
          {audioURL && <audio src={audioURL} controls />}
          {/* <button onClick={clickHandler1}>Record</button> */}
          
      </div>
      <div>
        {
          result&&<div>
            <p>{result?.text}</p>
            <p>{result?.Sqlquery}</p>
          </div>
        }
      </div>
      
    </div>
  );
}

export default Home;
