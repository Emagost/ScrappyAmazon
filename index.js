/* invoke the library */
const puppeteer = require('puppeteer');

(async () => {
    /* Created a 'const browser' for use in the 'const page' and use for created a algorytm */
    const browser = await puppeteer.launch({ headless: false }); /* If you dont want to launch browser change "headless: false" to "headless: true" */
    const page = await  browser.newPage();
    await page.goto('https://www.amazon.com');

    /* Enter to page,search IPhone 11 and take screenshot */
    await page.type('#twotabsearchtextbox', 'IPhone 11');
    await page.click('#nav-search-submit-button');
    await page.waitForSelector('[data-component-type=s-search-result]');

    /* Here push the info of the article on empty array*/
    const enlaces = await page.evaluate(()=>{
        const elements = document.querySelectorAll(['[data-component-type=s-search-result] h2 a']);

        const links = [];
        for (let element of elements){
            links.push(element.href);
        }

        return links;
    });
    console.log (enlaces.length);
        /* Created an array to put the information inside  */
        const iPhoneInfo = [];

        /* Here wait for charge selector (title) and move around links */
        for (let enlance of enlaces){
            await page.goto(enlance);
            await page.waitForSelector('#productTitle');
             /* Extract the information of article (title and price) and return */
            const phone = await page.evaluate(()=>{
                const tmp = {};
                    tmp.title = document.getElementById('#productTitle').innerText;
                    tmp.price = document.getElementById('#price_inside_buybox').innerText;
                return tmp;
            });
            /* push information */
            iPhoneInfo.push(phone);
        }
    
        console.log (iPhoneInfo);
    /* close browser */
    await browser.close();
})();
