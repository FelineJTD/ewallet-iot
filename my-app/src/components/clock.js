import { useState } from "react";

function Clock() {
  let time  = new Date().toLocaleTimeString();

  const [ctime,setTime] = useState(time);
  const UpdateTime=()=>{
    time =  new Date().toLocaleTimeString();
    setTime(time);
  }
  setInterval(UpdateTime);

  return <p>{ctime}</p>
}

export default Clock;