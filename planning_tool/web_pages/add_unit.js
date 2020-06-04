
window.addEventListener('load', init);
function init() {
    //add event listener for the add unit button.
    document.getElementById('addUnit').addEventListener('click', addNewUnit);
}

async function addNewUnit() {
    const unitTitle = document.getElementById('unitTitle');
    const unitNoOfWeeks = document.getElementById('unitNoOfWeeks');
    
    //insert google open id in unit creator when finished
    let unitCreator = 'UP834615';
    
    if (!unitTitle.checkValidity() || !unitNoOfWeeks.checkValidity()) {
        document.body.classList.add('error');
        console.error('failed validation');
        return;
    } else {
        document.body.classList.remove('error');
    }
    
    const addButton = document.getElementById('addUnit');
    addButton.textContent = 'Adding....';
    addButton.disabled = true;
   
    let url = '/api/addUnit'
    url += '?unittitle=' + encodeURIComponent(unitTitle.value);
    url += '&unitcreator=' + encodeURIComponent(unitCreator);
    url += '&noofweeks=' + encodeURIComponent(unitNoOfWeeks.value);
    
    
    //make the user wait a short while to provide feedback
    await delay(500);
   
    //Post to the server
    const response = await fetch(url, { method: 'POST' });
    addButton.disabled = false;

    if (response.ok) {
        unitTitle.value = '';
        unitNoOfWeeks.value = '';
        addButton.textContent = 'Add Unit';
    } else {
        console.error('Could not add the new unit', response.status, response.statusText);
        addButton.textContent = 'Please try again';
    }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}