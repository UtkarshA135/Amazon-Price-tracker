const nightmare = require("nightmare")();

const nodemailer = require('nodemailer');
  
const args = process.argv.slice(2);
const url = args[0];
const minPrice = args[1];
const fromMail = args[2];
const pass = args[3];
const toMail = args[4];
checkPrice();
async function checkPrice() {
    try{
        const PriceString = await nightmare.goto(url)
        .wait("#priceblock_ourprice")
        .evaluate(()=>document.getElementById("priceblock_ourprice").innerText).end();
        const price = parseFloat(PriceString.replace('$',''));
       if(price < minPrice)
       {
          console.log(price);
         sendMail(
            "Hey !! Its cheap",`The price on ${url} has dropped below $ ${minPrice}`);
       }
    }
    catch(e){
        sendMail(
            "Amazon Tracker Error",`Sorry we have an error ${e}`);
            throw e;
    }
 
}
function sendMail(subject ,body){
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: fromMail,
            pass: pass,
        }
    });
      
    let mailDetails = {
        from: fromMail,
        to: toMail,
        subject: subject,
        text: body,
        html:`<p>${body}</p>`
    };
      
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            console.log('Email sent successfully');
        }
    })
}