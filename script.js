const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");

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

// code smajna hai firse 

const allPriorityColors = document.querySelectorAll(".priority-color");

allPriorityColors.forEach(function (colorElement) {
  colorElement.addEventListener("click", function () {
    //remove kar do if in allprioritycolor have active class
    allPriorityColors.forEach(function (priorityColorElem) {
        priorityColorElem.classList.remove("active");
    });
    //add active class on click elevnt list on element.
    colorElement.classList.add("active");
  });
});