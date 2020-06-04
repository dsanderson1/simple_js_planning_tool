window.addEventListener('load', initialize);

function initialize() {
  //add event listener for the add session button.
  document.getElementById('addSession').addEventListener('click', addSession);
  document.getElementById('unitnameedit').innerHTML = localStorage.unitName;
  fillSessionWeek();
  loadSessions(localStorage.unitID);
}

function fillSessionWeek(){
    //fill the drop down box with every week the unit has. e.g. 12 week unit has 1 to 12 inclusive. 
    const weeks = localStorage.unitWeeks;
    const optBox = document.getElementById('sessionWeek');
    let i = 0;
    while (i != weeks) {
        i++;
        const opt = document.createElement('option');
        opt.innerHTML = i;
        opt.value = i;
        optBox.appendChild(opt);
    }
}

async function addSession(){
    const sessionTitle = document.getElementById('sessionTitle');
    const sessionDesc = document.getElementById('sessionDesc');
    
    const getST = document.getElementById('sessionType');
    const sessionType = getST.options[getST.selectedIndex].text;
    
    const getSW = document.getElementById('sessionWeek');
    const sessionWeek = getSW.options[getSW.selectedIndex].text;
    
    const unitID = localStorage.unitID;
   
    
    if (!sessionTitle.checkValidity() || !sessionDesc.checkValidity()) {
        console.error('failed validation');
        return;
    } else {
        console.error('fine');
    }
    
    const addButton = document.getElementById('addSession');
    addButton.textContent = 'Adding....';
    addButton.disabled = true;
    
    let url = '/api/addSession'
    url += '?sessiontitle=' + encodeURIComponent(sessionTitle.value);
    url += '&sessiondesc=' + encodeURIComponent(sessionDesc.value);
    url += '&sessiontype=' + encodeURIComponent(sessionType);
    url += '&sessionweekno=' + encodeURIComponent(sessionWeek);
    url += '&sessionunitid=' + encodeURIComponent(unitID);
    
    
    await delay(500);
    
    const response = await fetch(url, { method: 'POST' });
    
    addButton.disabled = false;
    
    if (response.ok) {
        //loadSessions(localStorage.unitID);
        sessionTitle.value = '';
        sessionDesc.value = '';
        addButton.textContent = 'Add Session';
    } else {
        console.error('Could not add the new session', response.status, response.statusText);
        addButton.textContent = 'Please try again';
    }
}

async function loadSessions(unitid) {
    let url = '/api/loadSessions'
    url += '?unitid=' + encodeURIComponent(unitid);
    
    const response = await fetch(url);
    
    if (response.ok) {
        const sessions = await response.json();

        //Session week display constants
        const sessWeekTemp = document.getElementById('sess_week_temp');
        const sessWeekAddNextBefore = sessWeekTemp.nextElementSibling;
        
        //set up session data constants for use in for loop
        let sessTemp = undefined;
        let addNextBefore = undefined;
        let weekNo = undefined;
        for(let i = 0; i < sessions.length; i++){
            //if the new session row has a new week no then create a new header with that week no, otherwise just put the session data under the week thats already there.
            if (sessions[i].unitsession_weekno != weekNo) {
                weekNo = sessions[i].unitsession_weekno;
                const sessWeekNoEl = document.importNode(sessWeekTemp.content, true);
                sessWeekNoEl.querySelector('.weekno').textContent = "Week " + sessions[i].unitsession_weekno;
                sessWeekNoEl.querySelector('.weekno').dataset.id = "Week " + sessions[i].unitsession_weekno;
                sessWeekTemp.parentElement.insertBefore(sessWeekNoEl, sessWeekAddNextBefore);
                
                sessTemp = document.getElementById('sess_temp');
                
                //Make every new weeks sessTemp.id = to the week no. Without this the sessions come in random order as they dont know which week they belong to.
                sessTemp.id = 'sess_temp_'+sessions[i].unitsession_weekno;
                addNextBefore = sessTemp.nextElementSibling;
            }
                const sessEl = document.importNode(sessTemp.content, true);
                sessEl.querySelector('.sessiontype_title').textContent = sessions[i].unitsession_type + ': ' + sessions[i].unitsession_title;
                sessEl.querySelector('.sessiondesc').textContent = "Description: " + sessions[i].unitsession_description;
                sessEl.querySelector('.delete').dataset.id = sessions[i].unitsession_id;
                sessEl.querySelector('.delete').addEventListener('click', deleteSession);
                sessTemp.parentElement.insertBefore(sessEl, addNextBefore);
        }
    }
}

async function deleteSession(ev) {
    if (ev.target.dataset.id) {
        let url = '/api/deleteSession'
        url += '?unitsessionid=' + encodeURIComponent(ev.target.dataset.id);
        const response = await fetch (url, { method: 'DELETE' });
        if(response.ok){
            //get the delete refresh page to work, maybe use a separate function instead of integrating within loadSessions. 
            //loadSessions(localStorage.unitID);
         }else{
            console.log("Error deleting the session");
         }
    }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
