
const sendToServer = async(data) => {
    try {
        const request = new Request("http://127.0.0.1:8000/", {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, // Make sure to set your headers correctly
            body: JSON.stringify( data )
        });
        const response = await fetch(request);
        if(!response.ok){
            throw new Error(response.statusText);
        }
        const res = await response.json();
        console.log(res);
    } catch (error) {
        console.error(error);
    }
};

const getItemData = async(body) => {
    return new Promise((resolve, reject) => {
        let details = {};
        const heading = body.querySelector('[data-testid="heading"]');
        const address = body.querySelector('[data-testid="address"]');
        const buildingDetails = body.querySelector('[data-testid="building-details"]');
        const inPropertyDetails = body.querySelectorAll('[data-testid="in-property-item"]');
        if(heading){
            details['heading'] = heading.innerText;
        }
        if(address){
            details['address'] = address.innerText;
        }
        if(buildingDetails){
            details['buildingDetails'] = buildingDetails.innerText;
        }
        if(inPropertyDetails){
            inPropertyDetails.forEach(element => {
                details[element.innerText] = element.innerText;
            });
        }
        resolve(details);
    }); 
};

const getItems = async() => {
    const items = document.querySelectorAll('[data-nagish="feed-item-list-box"]');
    //forEach does not wait for promises to resolve before moving to the next iteration 

    //instead of using forEach, map us used to create a new array of promises. 
    const dataPromises = Array.from(items).map(async(item) => {
        const url = item.querySelector('a').href;
        const itemId = url.split('/').pop().split('?')[0];
        const htmlText = (await (await fetch(url)).text()); // html as text
        const body = new DOMParser().parseFromString(htmlText, 'text/html').body;
        const baseData = {link: url, type: item.dataset.testid, innerText: item.innerText};
        const additionalData = await getItemData(body);
        /*data.push({id: itemId,
            ...baseData,
            ...additionalData
        });*/
        return { id: itemId, ...baseData, ...additionalData };
    });
    const data = await Promise.all(dataPromises);
    sendToServer(data);
};

getItems();
