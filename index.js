const sendchatbtn=document.querySelector(".chat-input span");
const chatinput=document.querySelector(".chat-input textarea");
const chatbox=document.querySelector(".chatbox");
const chatbottoggler=document.querySelector(".chatbot-toggler");
const chatbotcloseBtn=document.querySelector(".close-btn");

let usermessage= null; //Variable to stoe user's message
const API_KEY= "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"; //our api key fetched from openai
const inputInitHeight= chatinput.scrollHeight;

const createchatLi= (message ,className) => {
      //Create a chat <li> element with passed message and className
      const chatLi= document.createElement("li");
      chatLi.classList.add("chat",className);
      let chatContent= className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
      chatLi.innerHTML= chatContent;
      chatLi.querySelector("p").textContent = message;
      return chatLi; // return that <li> element
      
}

const generateResponse = (incomingChatLi) =>{
    const API_URL= "https://api.openai.com/v1/chat/completions";
    const messageElement= incomingChatLi.querySelector("p");
    
    // Define the properties and message for the API request
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
     
    // Send POST request to API , get response and see the response as paragraph text
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
      messageElement.textContent = data.choices[0].message.content.trim();
  }).catch(() => {
      messageElement.classList.add("error");
      messageElement.textContent = "Oops! Something went wrong. Please try again.";
  }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}


const handleChat = () =>{
     usermessage= chatinput.value.trim(); // Get User entered message and remove extra white space
     
     if(!usermessage) return;


     //clear the input textarea and set the height to its default
     chatinput.value= "";
     chatinput.style.height = `${inputInitHeight}px`;



  //Append The user message to the chatbox
     chatbox.appendChild(createchatLi(usermessage ,"outgoing"));
     chatbox.scrollTo(0,chatbox.scrollHeight);

     setTimeout(() =>{
      //Display thinking message while waiting for the response
      const incomingChatLi= createchatLi("Thinking..." ,"incoming");
      chatbox.appendChild(incomingChatLi);
      chatbox.scrollTo(0,chatbox.scrollHeight);
      generateResponse(incomingChatLi);
     },600);
}


// adjusting the height of text-area
chatinput.addEventListener("input",() =>{
    chatinput.style.height = `${inputInitHeight}px`;
    chatinput.style.height = `${chatinput.scrollHeight}px`;
});

//sending the message on Enter button click
chatinput.addEventListener("keydown",(e) =>{
      if(e.key === "Enter" && !e.shiftKey && window.innerWidth >800){
            e.preventDefault();
            handleChat();
      } 
  });

sendchatbtn.addEventListener("click",handleChat);
chatbottoggler.addEventListener("click",()=>{
      document.body.classList.toggle("show-chatbot");
})
chatbotcloseBtn.addEventListener("click",()=>{
      document.body.classList.remove("show-chatbot");
})
