var uid = new ShortUniqueId();
const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
const allPriorityColors = document.querySelectorAll(".priority-color");
let colors = ['lightpink', 'lightgreen', 'lightblue', 'black'];
let modalPriorityColor = colors[colors.length-1]; // black is selected
let textAreaCont = document.querySelector(".textarea-cont");
const mainCont = document.querySelector(".main-cont");
let ticketArr = [];
let toolboxColors = document.querySelectorAll(".color");
//console.log(toolboxColors);
let removeBtn = document.querySelector(".remove-btn");
let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

//TO OPEN CLOSE MODAL CONTAINER
let isModalPresent = false;
addBtn.addEventListener('click', function(){
    if(!isModalPresent){
        modalCont.style.display = "flex"; //modal add ho jayega screen par
        // isModalPresent = true;
    }
    else{
        modalCont.style.display = "none";
        // isModalPresent = false;
    }

    isModalPresent = !isModalPresent // toggling  effect  insted using line 9 & 13 we use toggling effect;
})

//TO REMOVE AND ADD ACTIVE CLASS FROM PRIORITY COLOR OF MODAL CONTAINER
allPriorityColors.forEach(function (colorElement) {
  colorElement.addEventListener("click", function () {
    //remove kar do if in allprioritycolor have active class
    allPriorityColors.forEach(function (priorityColorElem) {
        priorityColorElem.classList.remove("active");
    });
    //add active class on click elevnt list on element.
    colorElement.classList.add("active");
    modalPriorityColor = colorElement.classList[0];
  });
});

//TO GENERATE AND DISPLAY A TICKET
modalCont.addEventListener("keydown", function(e){ 
    let key = e.key;
    if(key == "Shift"){
        //console.log(modalPriorityColor);
        //console.log(textAreaCont.value);
        createTicket(modalPriorityColor, textAreaCont.value);
        modalCont.style.display = "none";
        isModalPresent = false;
        textAreaCont.value = "";
        allPriorityColors.forEach(function(colorElem){
            colorElem.classList.remove("active");
        })
    }
});

//FUNCTION TO CREATE NEW TICKET
function createTicket(ticketColor, data, ticketId){
    let id = ticketId || uid();
    let ticketCont = document.createElement("div"); //<div></div>
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML=`
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id"> ${id}</div>
        <div class="ticket-area">${data}</div>
        <div class="ticket-lock"> <i class="fa-solid fa-lock"></i> </div>
    `;

    mainCont.appendChild(ticketCont);

    handleRemoval(ticketCont, id);
    handleColor(ticketCont, id);
    handleLock(ticketCont, id);

    //if ticket is being created for the first time, then ticketId would be undefine
    if(!ticketId){
        ticketArr.push(
            {
                ticketColor,
                 data,
                ticketId:id});
        localStorage.setItem("tickets", JSON.stringify(ticketArr))
    }
}

//GET ALL TICKET FROM LOCALSTORAGE
if(localStorage.getItem("tickets")){
    ticketArr = JSON.parse(localStorage.getItem("tickets"));
    ticketArr.forEach(function(ticketObj){
        createTicket(ticketObj.ticketColor, ticketObj.data, ticketObj.ticketId);
    })
}

//FILTER TICKET ON THT BASIS OF TICKETCOLOR
for(let i = 0; i<toolboxColors.length; i++){
    toolboxColors[i].addEventListener("click", function(){
        let currToolBoxColor = toolboxColors[i].classList[0];

        // filterticket will be return arr 
        let filterTickets = ticketArr.filter(function(ticketObj){
            return currToolBoxColor == ticketObj.ticketColor;
        });

        // remove all the ticket
        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let i =0; i<allTickets.length; i++){
            allTickets[i].remove();
        }

        //display filteredTicked
        filterTickets.forEach(function(ticketObj){
            createTicket(ticketObj.ticketColor, ticketObj.data, ticketObj.ticketId);
        })
    })

    //to display all the ticket of all color on doubleclicking
    toolboxColors[i].addEventListener("dblclick", function(){
        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let i =0; i<allTickets.length; i++){
            allTickets[i].remove();
        }

        //display all tickets 
        ticketArr.forEach(function(ticketObj){
            createTicket(ticketObj.ticketColor, ticketObj.data, ticketObj.ticketId);
        })
    })

}

//on clicking removeBtn make color red and make color white in clincking again
let removeBtnActive = false;
removeBtn.addEventListener("click", function(){
    if(removeBtnActive){
        removeBtn.style.color = "white";
    }
    else{
        removeBtn.style.color = "red";
    }
    removeBtnActive = !removeBtnActive;
});

//remove ticket from local storage and ui
function handleRemoval(ticket, id){
    ticket.addEventListener("click", function(){
        if(!removeBtnActive) return;
        //local storage remove
        //->get idx of the ticket to be deleted
    
        let idx = getTicketIdx(id);
        ticketArr.splice(idx, 1); // splice method changes the contents of an array
        
        //remove from browser storage and set updated arr
        localStorage.setItem("tickets", JSON.stringify(ticketArr));

        //fronted remove
        ticket.remove();
    });
}

//return index of the ticket inside local storage's array
function getTicketIdx(id){
    let ticketIdx = ticketArr.findIndex(function(ticketObj){
        return ticketObj.ticketId == id;
    })
    return ticketIdx;
}

//change priority color of the tickets 
function handleColor(ticket, id){
    let ticketColorStrip = ticket.querySelector(".ticket-color"); 

    ticketColorStrip.addEventListener("click", function(){
        let currTicketColor = ticketColorStrip.classList[1]; //lightpink
        //['lightpink', 'lightgreen', 'lightblue', 'black'];
        let currTicketColorIdx = colors.indexOf(currTicketColor);//0

        let newTicketColorIdx =currTicketColorIdx +1;//1

        newTicketColorIdx = newTicketColorIdx % colors.length;//1
        let newTicketColor = colors[newTicketColorIdx]; // lightgreen

        ticketColorStrip.classList.remove(currTicketColor);
        ticketColorStrip.classList.add(newTicketColor);

        //local storage update
        let ticketIdx = getTicketIdx(id);
        ticketArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("tickets", JSON.stringify(ticketArr));
    });
}

//lock and unlock to make content editable true or false
function handleLock(ticket, id){
    //icons ko append in ticket

    console.log(ticket);
    
    let ticketLockEle = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockEle.children[0];
    let ticketTaskArea = ticket.querySelector('.ticket-area')
    console.log(ticketTaskArea);

    //toggle of icons and contenteditable property
    ticketLock.addEventListener("click", function(){
        let ticketIdx = getTicketIdx(id);
        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            console.log(ticketTaskArea);
            ticketTaskArea.setAttribute("contenteditable", "true");
        }
        else{
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable", "false");
        }

        ticketArr[ticketIdx].data = ticketTaskArea.innerText;
        localStorage.setItem("tickets", JSON.stringify(ticketArr));
    });
    
}
