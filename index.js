const popup_container = document.getElementById("popup-container");
let warning_is_empty = true;

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
    //list.appendChild(lin);

    popup_container.style.display = 'none';

    document.getElementById("newtask").value = '';
}   

function verify_warning_msg(){
    if(!warning_is_empty){
         document.getElementById("popup").removeChild(document.getElementById('popup').lastElementChild);
         warning_is_empty = true;
    }
}

