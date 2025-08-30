// mentor.js - Simple AI Mentor (dummy placeholder)
async function askMentor(){
  const input=document.getElementById("mentor-input");
  const reply=document.getElementById("mentor-reply");
  const question=input.value.trim();
  if(!question) return;
  reply.innerHTML="🤔 Thinking...";
  input.value="";
  try{
    const res=await fetch(`${BACKEND_URL}/mentor`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({question})
    });
    const data=await res.json();
    reply.innerHTML="💡 "+(data.answer||"No response.");
  }catch{
    reply.innerHTML="⚠️ Mentor unavailable.";
  }
}
