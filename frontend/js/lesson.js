// lesson.js - Loads Lessons
async function loadLesson() {
  const params=new URLSearchParams(window.location.search);
  const worldId=params.get("world")||"1";
  try {
    const res=await fetch(`worlds/world${worldId}.json`);
    if(!res.ok) throw new Error("Lesson not found");
    const data=await res.json();
    document.getElementById("lesson-title").innerText=data.meta.title;
    document.getElementById("lesson-intro").innerHTML=`<p>${data.meta.intro}</p>`;
    const container=document.getElementById("lesson-content");
    container.innerHTML="";
    for(let key in data.lessons){
      const sec=data.lessons[key];
      const div=document.createElement("div");
      div.className="lesson-card";
      div.innerHTML=`<h3>${sec.title}</h3><div>${sec.html}</div>`;
      container.appendChild(div);
    }
  } catch(err){
    document.getElementById("lesson-content").innerHTML="<p>Error loading lesson.</p>";
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  const themeBtn=document.getElementById("toggle-theme");
  if(themeBtn) themeBtn.addEventListener("click",()=>document.body.classList.toggle("dark"));
  loadLesson();
});
