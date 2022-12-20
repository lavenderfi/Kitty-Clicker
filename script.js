function updateTreats(qty){
    let counter = document.getElementById('treat-counter')
    counter.innerText = qty
}

function clickKitty(data){
    data.treats++
    renderHelpers(data)
    return updateTreats(data.treats)
}

function unlock(helpers,count){
    helpers.forEach(helperObj => {
        if(helperObj.price /2 <= count){
            helperObj.unlocked = true;
        }
    })
}
function getHelpers(data){
    return data.helpers.filter((obj)=> obj.unlocked)
}

function displayName(id){
    return id
    .split('-')
    .map(word => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ')
}

// make actual elements

function makeHelperDiv(helper){
    const container = document.createElement('div')
    container.className = 'helper'
    const name = displayName(helper.id)
    const html = `
    <div class='h-column'>
    <div class='h-title'>${name}</div>
    <button type='button' id='buy_${helper.id}>Buy</button>
    </div>
    <div class='h-column'>
    <div>Quantity: ${helper.qty}</div>
    <div>Treats per second: ${helper.tps}</div>
    <div>Cost: ${helper.price} treats</div>
  </div>
    </div>
    `
    container.innerHTML = html
    return container
}

function deleteAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
  
  function renderHelpers(data) {
    const helperContainer = document.getElementById("helper-container");
    deleteAllChildNodes(helperContainer);
    unlock(data.helpers, data.treats);
    return getHelpers(data).map((obj) => {
      helperContainer.appendChild(makeHelperDiv(obj));
      return obj;
    });
  }

  function getHelperById(data, id) {
    for (let i = 0; i < data.helpers.length; i++) {
      if (data.helpers[i].id === id) return data.helpers[i];
    }
  }

  function canAfford(data, id) {
    let helper = getHelperById(data, id);
    if (data.treats >= helper.price) {
      return true;
    }
    return false;
  }

  function updateTps(tps){
    document.getElementById('tps').innerText = tps
  }

  function updatePrice(oldPrice){
    return Math.floor(oldPrice * 125) / 100
  }

  function buyAttempt(data,id){
    let helper = getHelperById(data,id)
    if(canAfford(data,id)){
        helper.qty++
        data.treats -= helper.price
        helper.price = updatePrice(helper.price)
        data.totalTPS += helper.tps
        return true
    }
    return false;
  }

  function buyClick(event,data){
    if(event.target.tagName === 'BUTTON'){
        let helper =  event.target.id.split("").splice(4).join("").split('>')[0];
        if(buyAttempt(data,helper)){
            buyAttempt(data,helper)
            renderHelpers(data)
            updateTps(data.totalTPS)
            updateTreats(data.treats)
            return;
        }
        window.alert('Need more treats!')
    }
  }

  function increase(data){
    data.treats += Math.floor(data.totalTPS)
    updateTreats(data.treats)
    renderHelpers(data)
  }

  const data = window.data;

  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => {
    clickKitty(data);
  });


  const helperContainer = document.getElementById("helper-container");
  helperContainer.addEventListener("click", (event) => {
    buyClick(event, data);
  });


  setInterval(() => increase(data), 1000);
