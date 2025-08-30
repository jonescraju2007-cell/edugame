// app.js - Loads Worlds
const TOTAL_WORLDS = 7;

async function loadWorlds() {
  const container = document.getElementById("worlds-container");
  container.innerHTML = "";
  for (let i=1;i<=TOTAL_WORLDS;i++) {
    try {
      const res = await fetch(`worlds/world${i}.json`);
      if (!res.ok) continue;
      const data = await res.json();
      const card = document.createElement("div");
      card.className="world-card";
      card.innerHTML=`
        <h3>${data.meta.title}</h3>
        <p>${data.meta.intro}</p>
        <button onclick="window.location.href='lesson.html?world=${i}'">📘 Lesson</button>
        <button onclick="window.location.href='quiz.html?world=${i}'">📝 Quiz</button>
      `;
      container.appendChild(card);
    } catch(err){console.error("Error loading world",i,err);}
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  const themeBtn=document.getElementById("toggle-theme");
  if(themeBtn) themeBtn.addEventListener("click",()=>{
    document.body.classList.toggle("dark");
    localStorage.setItem("theme",document.body.classList.contains("dark")?"dark":"light");
  });
  if(localStorage.getItem("theme")==="dark") document.body.classList.add("dark");

  window.toggleMenu=function(){
    const links=document.querySelector(".nav-links");
    if(links) links.classList.toggle("show");
  };

  if(document.getElementById("worlds-container")) loadWorlds();
});
