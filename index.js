const popup_container = document.getElementById("popup-container");
let warning_is_empty = true;
let historyTasks = "";
function addtask(){
    popup_container.style.display = 'flex';
}

function cancel_task(){
    popup_container.style.display = 'none';
    document.getElementById("newtask").value = '';

    if(!warning_is_empty){
         document.getElementById("popup").removeChild(document.getElementById('popup').lastElementChild);
         warning_is_empty = true;
    }
}

function confirm_task(){
    let item_text = document.getElementById("newtask").value;
    if(item_text.trim() == ''){

        if(warning_is_empty){

            warning_is_empty = false;
            
            let warning_msg = document.createElement("div");
            warning_msg.innerText = "Add a message or Cancel the operation";
            warning_msg.style.color = 'red';
            warning_msg.style.margin = '10px';
            document.getElementById("popup").appendChild(warning_msg);
        }
        return;
    }

    let list = document.getElementById("list");

    let items = document.createElement("div");
    items.className = 'items';

    let begin_task = document.createElement('div');
    begin_task.className = 'begin-task';

    let fromdate = document.createElement('div');
    fromdate.className = 'fromdate';
    fromdate.innerText = new Date().toLocaleDateString("en");

    let item = document.createElement('div');
    item.className = 'task-text';
    item.innerText = item_text;

    begin_task.appendChild(fromdate);
    begin_task.appendChild(item);

    let del = document.createElement('img');
    del.className = 'del-button';
    del.src = 'trash_icon_50x50.png';
    del.alt = 'delete-button';

    del.onclick = function () {
        items.remove(); 
    };  

    items.appendChild(begin_task);
    items.appendChild(del);

    let lin = document.createElement('div');
    lin.className = 'line';

    list.appendChild(items);

    popup_container.style.display = 'none';

    historyTasks += document.getElementById("newtask").value + "\n";

    document.getElementById("newtask").value = '';
}   

function verify_warning_msg(){
    if(!warning_is_empty){
         document.getElementById("popup").removeChild(document.getElementById('popup').lastElementChild);
         warning_is_empty = true;
    }
}

const textarea = document.getElementById("chat");
const responseContainer = document.getElementById("agent-responses");

const userId = "user126"; 

textarea.addEventListener("keydown", async function (event) {
    if (event.key == "Enter" && !event.shiftKey){
        event.preventDefault();

        let message = textarea.value.trim();
        if(message == "") return;

        let baloon_container_you = document.createElement("div");
        baloon_container_you.className = 'baloon-container-you';
        let baloon_you = document.createElement("div");
        baloon_you.className = 'baloon-you';
        baloon_you.innerText = message;
        let baloon_name = document.createElement("div");
        baloon_name.innerText = "You";

        baloon_container_you.appendChild(baloon_you);
        baloon_container_you.appendChild(baloon_name);
        responseContainer.appendChild(baloon_container_you);
        textarea.value = "";

        try{
            const response = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: userId,
                    history_tasks: historyTasks,
                    mensagem: message,
                }),
            });

            const data = await response.json();

            let baloon_container_ai = document.createElement("div");
            baloon_container_ai.className = 'baloon-container-ai';
            let baloon_ai = document.createElement("div");
            baloon_ai.className = 'baloon-ai';
            baloon_ai.innerText = data.resposta;
            let baloon_name = document.createElement("div");
            baloon_name.innerText = "AI";

            baloon_container_ai.appendChild(baloon_ai);
            baloon_container_ai.appendChild(baloon_name);
            responseContainer.appendChild(baloon_container_ai);


        } catch (error) {
            responseContainer.innerHTML+=`<p style="color:red;">Erro: ${error.message}</p>`;
        }
    }
});

const sideBarButton =  document.getElementById("open-close-chat-button");

sideBarButton.addEventListener("click", function(){
    
    document.getElementById('sidebarID').classList.toggle('open_sidebar');
});
  
