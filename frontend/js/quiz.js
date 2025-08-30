// quiz.js - Loads Quizzes
let questions=[]; let currentIndex=0;

async function loadQuiz(){
  const params=new URLSearchParams(window.location.search);
  const worldId=params.get("world")||"1";
  try{
    const res=await fetch(`worlds/world${worldId}.json`);
    if(!res.ok) throw new Error("Quiz not found");
    const data=await res.json();
    document.getElementById("quiz-title").innerText=data.meta.title+" - Quiz";
    questions=data.questions.simple||[];
    if(questions.length===0){document.getElementById("quiz-container").innerHTML="<p>No quiz available.</p>";return;}
    renderQuestion();
    document.getElementById("back-to-lesson").href=`lesson.html?world=${worldId}`;
  }catch(err){console.error(err);}
}

function renderQuestion(){
  const q=questions[currentIndex];
  let optionsHtml="";
  if(q.type==="mcq"){
    optionsHtml=q.options.map(opt=>`<button onclick="checkAnswer('${opt}','${q.answer}')">${opt}</button>`).join("");
  }else if(q.type==="truefalse"){
    optionsHtml=`<button onclick="checkAnswer('True','${q.answer}')">True</button>
                 <button onclick="checkAnswer('False','${q.answer}')">False</button>`;
  }else if(q.type==="fill"){
    optionsHtml=`<input type="text" id="fill-answer" placeholder="Type your answer...">
                 <button onclick="checkAnswer(document.getElementById('fill-answer').value,'${q.answer}')">Submit</button>`;
  }
  document.getElementById("quiz-container").innerHTML=`
    <div class="question-card">
      <h3>Q${currentIndex+1}: ${q.question}</h3>
      <div class="options">${optionsHtml}</div>
      <p id="feedback"></p>
    </div>`;
}

function checkAnswer(selected,correct){
  const feedback=document.getElementById("feedback");
  if(selected.trim().toLowerCase()===correct.trim().toLowerCase()){
    feedback.innerHTML=`<span class="correct">✅ Correct!</span>`;
  }else{
    feedback.innerHTML=`<span class="wrong">❌ Wrong! Correct Answer: ${correct}</span>`;
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("prev-btn").addEventListener("click",()=>{if(currentIndex>0){currentIndex--;renderQuestion();}});
  document.getElementById("next-btn").addEventListener("click",()=>{if(currentIndex<questions.length-1){currentIndex++;renderQuestion();}});
  document.getElementById("show-answer-btn").addEventListener("click",()=>{const q=questions[currentIndex];document.getElementById("feedback").innerHTML=`💡 Correct Answer: ${q.answer}`;});
  loadQuiz();
});
