window.addEventListener('load', initialize);

function initialize() {
  showUnits();
}

async function showUnits() {
  const url = '/api/loadUnits'

  const response = await fetch(url);

  if (response.ok) {
    const units = await response.json();
    const temp = document.getElementById('unit_temp');
    const addNextBefore = temp.nextElementSibling;
    
    //fill the page with each unit. 
    for(let i = 0; i < units.length; i++){
        const unitLst = document.importNode(temp.content, true);
        unitLst.querySelector('.unitname').textContent= units[i].unit_name;
        unitLst.querySelector('.unitname').dataset.id = units[i].unit_id;
        unitLst.querySelector('.unitname').dataset.weeks = units[i].unit_weeks;
        unitLst.querySelector('.unitname').addEventListener('click', saveUnitInfo);
        temp.parentElement.insertBefore(unitLst, addNextBefore);
    }
   } else {
    console.error('ERROR[STATUS, STATUSTEXT]', response.status, response.statusText);
  }
}

//add unit information to local storage for use on the edit unit page. 
function saveUnitInfo(ev) {
    if (ev.target.dataset.id) {
        localStorage.unitID = ev.target.dataset.id;
        localStorage.unitName = ev.target.innerHTML;
        localStorage.unitWeeks = ev.target.dataset.weeks;
        window.location.replace("/edit_unit.html");
    }
}