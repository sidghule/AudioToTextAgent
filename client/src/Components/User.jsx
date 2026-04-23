import { useState, useRef } from "react";
import axios from "axios";
import "../index.css";
export default function User(){
    const [recording1, setRecording1] = useState(false);
    const [result1, setResult1] = useState(null);
    const [audioURL1, setAudioURL1] = useState(null);
    const [data,setData]=useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const streamRef = useRef(null); 

    console.log("Our Data is",result1);
    const startRecording = async () => {
        try {
            console.log("inside the try of recording");
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stream
                ?.getTracks()
                .forEach(track => track.stop());
                mediaRecorderRef.current = null;
            }

            if (recording1){
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
            setRecording1(true);

        } catch (err) {
            console.error("Mic error:", err);
            alert("Microphone is locked. Reload page and close other apps.");
        }
    };


    const stopRecording = () => {
        if (!mediaRecorderRef.current) return;
        mediaRecorderRef.current.stop();
        setRecording1(false);
    };

    const sendAudio = async () => {
        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;

        const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
        });

        const url = URL.createObjectURL(audioBlob);
        setAudioURL1(url);

        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.webm");

        try {
            const res = await axios.post(
                "http://localhost:5000/info",
                formData
            );
            setResult1(res.data);
        } catch (err) {
            console.error("Upload error:", err);
        } finally {
            mediaRecorderRef.current = null; 
        }
    };
    let parsedData = null;

    if (result1?.data) {
        parsedData = JSON.parse(result1.data);
    }
    console.log("Our Parse Data is",parsedData)
    return(
        <div className="secondContainer">
            <h2>Say Something About You</h2>
            <div>
                {!recording1 ? (
                <button onClick={startRecording}>🎙️ Start</button>
                ) : (<button onClick={stopRecording}>⏹️ Stop</button>)
                }

            </div>
            <div>
                {
                    parsedData?(
                        <div>
                            {result1?.data}
                        </div>
                        ):(<></>)           
                }
            </div>

          {audioURL1 && <audio src={audioURL1} controls />}
          
        </div>
    )
}