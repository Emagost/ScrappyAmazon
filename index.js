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
    const href = await page.evaluate(()=>{
        const elements = document.querySelectorAll('[data-component-type=s-search-result] h2 a');

        const links = [];
        for (let element of elements){
            links.push(element.href);
        }

        return links;
    });

        /* Created an array to put the information inside  */
        const iPhoneInfo = [];

        /* Here wait for charge selector (title) and move around links */
        for (let hrefs of href){
            await page.goto(hrefs);
            await page.waitForSelector('#productTitle');
             /* Extract the information of article (title and price) and return */
            const phone = await page.evaluate(()=>{
                const tpm = {};
                try{
                        tpm.title = document.querySelector("#productTitle").innerText.includes("iPhone 11") && !document.querySelector("#productTitle").innerText.includes("Pro") ? document.querySelector("#productTitle").innerText : null;
                        tpm.price = parseFloat(document.querySelector("#price_inside_buybox").innerText) * 1000;
                    return tpm;
                }catch(error){
                    console.log (error);
                }
            });

        phone.link = href;
        /* push information */
            if (phone.title && phone.price > 500) iPhoneInfo.push(phone);
            }

        console.log (iPhoneInfo, iPhoneInfo.length);

    /* close browser */
    await browser.close();
})();
