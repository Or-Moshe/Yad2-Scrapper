
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
    data = [];
    items.forEach(async(item) => {
        const url = item.querySelector('a').href;
        const itemId = url.split('/')[5].split('?')[0];
        const htmlText = (await (await fetch(url)).text()); // html as text
        const body = new DOMParser().parseFromString(htmlText, 'text/html').body;
        const baseData = {link: url, type: item.dataset.testid, innerText: item.innerText};
        const additionalData = await getItemData(body);
        data.push({id: itemId,
            ...baseData,
            ...additionalData
        });
    });
    console.log(data);
};

getItems();
