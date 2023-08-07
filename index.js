const sendchatbtn=document.querySelector(".chat-input span");
const chatinput=document.querySelector(".chat-input textarea");
const chatbox=document.querySelector(".chatbox");
const chatbottoggler=document.querySelector(".chatbot-toggler");
const chatbotcloseBtn=document.querySelector(".close-btn");

let usermessage;
const API_KEY= "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";

const createchatLi= (message ,className) => {
      const chatLi= document.createElement("li");
      chatLi.classList.add("chat",className);
      let chatContent= className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
      chatLi.innerHTML= chatContent;
      chatLi.querySelector("p").textContent = message;
      return chatLi;
      
}

const generateResponse = (incomingChatLi) =>{
    const API_URL= "https://api.openai.com/v1/chat/completions";
    const messageElement= incomingChatLi.querySelector("p");

    const requestOptions = {
      method: "POST",
      headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user" , content: usermessage}]
          }
          )
    }

    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
      messageElement.textContent = data.choices[0].message.content.trim();
  }).catch(() => {
      messageElement.classList.add("error");
      messageElement.textContent = "Oops! Something went wrong. Please try again.";
  }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}


const handleChat = () =>{
     usermessage= chatinput.value.trim();
     
     if(!usermessage) return;

     chatbox.appendChild(createchatLi(usermessage ,"outgoing"));
     chatbox.scrollTo(0,chatbox.scrollHeight);

     setTimeout(() =>{
      const incomingChatLi= createchatLi("Thinking..." ,"incoming");
      chatbox.appendChild(incomingChatLi);
      chatbox.scrollTo(0,chatbox.scrollHeight);
      generateResponse(incomingChatLi);
     },600);
}

sendchatbtn.addEventListener("click",handleChat);
chatbottoggler.addEventListener("click",()=>{
      document.body.classList.toggle("show-chatbot");
})
chatbotcloseBtn.addEventListener("click",()=>{
      document.body.classList.remove("show-chatbot");
})