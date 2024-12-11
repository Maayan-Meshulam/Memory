let query = `https://data.gov.il/api/3/action/datastore_search?resource_id=b1fdc757-07e3-4875-a023-99e59ac44f24`;

async function getCounrysData(amountCouplesCards){
    try{
        let respone = await fetch(query + `&limit=${amountCouplesCards}`);
        let data = await respone.json();
        return data;
    }
    catch{
        alert(" הייתה תקלה קטנה, נא רענן את הדף או פתח אותו שוב");
    }
   
}

let totalShowingCards = 0;//סופר את כמות ההרמות של הכרטיסים בכל המשחק
let flagCardsOpen = 0; // כמות קלפים פתוחים שנשארו במשחק - לא כולל אלא שהורמו
let countShownCards = 0; // שהזוג שלהם נמצא -  כמות הקלפים שפתוחים בו זמנית   
let amountOfCards; //כמות קלפי משחק בהתאם

//פונקציה שיוצרת מערך של קלפים
async function createArrCards(signAmountCards){
    let data;
    let arrOfCards=[];

    //נשנה את עיצוב הכפתור בעת לחיצה על כמות קלפים מסוימת
    //נשנה את פריסת הדף
    document.getElementById("containerCards").style.display = "grid";
    document.getElementById("option1Amount").classList.remove("selected");
    document.getElementById("option2Amount").classList.remove("selected");
    document.getElementById("option3Amount").classList.remove("selected");
    //איפוסים - למקרה שעברנו בין הכפתורים
    countShownCards = 0;
    totalShowingCards = 0;
    document.getElementById("amountOfSuccessCoupleCards").innerText = 0;
    document.getElementById("amountOfShowingCardsTotal").innerText = 0;

    //TODO: כאשר עוברים ממסך גדול למסך קטן הגודל לא מתעדכן

    switch (signAmountCards){
        case 1:
            if(window.innerWidth > 1200) //רק בגודל מסך כזה הסידור יהיה שונה
                document.getElementById("containerCards").style.gridTemplateColumns = "1fr 1fr 1fr 1fr"; 
            amountOfCards = 12;
            document.getElementById("option1Amount").classList.add("selected");
            popUpStartGame(12);
            data = await getCounrysData(6); 
            break;
        case 2:
            if(window.innerWidth > 1200)
                document.getElementById("containerCards").style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr"; 
            amountOfCards = 20;
            document.getElementById("option2Amount").classList.add("selected");
            popUpStartGame(20);
            data = await getCounrysData(10);
            break;
        case 3:
            if(window.innerWidth > 1200)
                document.getElementById("containerCards").style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr 1fr"; 
            amountOfCards = 30;
            document.getElementById("option3Amount").classList.add("selected");
            popUpStartGame(30);
            data = await getCounrysData(15);
            break;
    };
    
    //ניצור מערך עם האובייקטים
    for(let i = 0; i < amountOfCards/2; i++){
        arrOfCards.push({status: "hidden", country: data.result.records[i]["שם_מדינה_במאגר"], capitlCity: data.result.records[i]["שם_עיר_בירה"], toFound:"capitalCity"});
        arrOfCards.push({status: "hidden", country: data.result.records[i]["שם_מדינה_במאגר"], capitlCity: data.result.records[i]["שם_עיר_בירה"], toFound:"country"});          
    }

    suffel(arrOfCards);
    
}


//פונקציה שמערבבת קלפים
function suffel(arrOfCards){

    let tempArr = [];
    let randomIdex;
    let arrFirstLength = arrOfCards.length;
        
    for(let i = 0; i < arrFirstLength; i++){
        randomIdex = Math.floor(Math.random() * arrOfCards.length); //מספר רנדומלי
        tempArr.push(arrOfCards[randomIdex]);
        tempArr[i].index = i; //נוסיף תכונה של מיקום בסידור
        arrOfCards.splice(randomIdex, 1); //נמחק מהמערך המקורי
    }

    matchCardToContent(tempArr);   

}


//פונקציה שמשייכת אלמנט כרטיס עם תוכן האובייקט 
function matchCardToContent(arrOfCards){
    let cardsElemntsArr = [];

    for(let i = 0; i < arrOfCards.length; i++){   
        let cardElemnt = document.createElement("div");
        cardElemnt.classList.add("card");
        let inlineCardElemnt = document.createElement("div");
        inlineCardElemnt.classList.add("overtCard");
        cardElemnt.appendChild(inlineCardElemnt);

        if(arrOfCards[i].toFound == "capitalCity"){
            inlineCardElemnt.innerText = arrOfCards[i].country;
        }
        else{
            inlineCardElemnt.innerText = arrOfCards[i].capitlCity;
        }

        cardsElemntsArr.push(cardElemnt);
    }

    AssociateToCard(cardsElemntsArr, arrOfCards)
}



//פונקציה שפורסת את הקלפים על השולחן
function AssociateToCard(cardsElemntsArr, arrOfCards){   

    let containerObj = document.getElementById('containerCards');
    containerObj.innerHTML = ""; //איפוס הלוח

    //נוסיף ללוח את כל האלמנטים שנוצרו
    for(let i = 0; i < cardsElemntsArr.length; i++){
        containerObj.appendChild(cardsElemntsArr[i]);
    }

    //נוסיף לכל האלמנטים שנוצרו מאזיני אירוע לחיצה
    for(let i = 0; i < cardsElemntsArr.length; i++){ 

        cardsElemntsArr[i].addEventListener("click", ()=>{
            showCard(cardsElemntsArr[i], arrOfCards[i], arrOfCards); //נעביר את הקלף, האובייקט והמערך הכולל של הקלפים
        });
    }           

}



let cardsOpen = [];
//פונקציה שהופכת את הקלף
function showCard(choosenCard, choosenObject, arrOfCards){
    flagCardsOpen += 1;

    if(flagCardsOpen < 3){
        if(choosenObject.status != "shown"){
      
            //TODO: טיפול במקרה של פתיחה ביותר משני קלפים
        
            let insideChoosenCard = choosenCard.querySelector(".overtCard");
            cardsOpen.push({object: choosenObject, card: insideChoosenCard});
            insideChoosenCard.style.display = "flex";
                    
            if(flagCardsOpen == 2){
                totalShowingCards += 1;
                document.getElementById("amountOfShowingCardsTotal").innerText = totalShowingCards;

                setTimeout(()=>{
                    isMatch(cardsOpen, arrOfCards);
                },700)
            }
        }
        else{
            flagCardsOpen--;
            alert("קלף זה כבר פתוח");
        }
    }
    
    
}


//פונקציה שבודקת האם הקלפים שנלחצו תואמים
function isMatch(arrOpenCards, arrOfCards){
       
    if(arrOpenCards[0].object.country == arrOpenCards[1].object.country){
       popUpSuccess();     
       arrOpenCards[0].card.style.display = "flex";
       arrOpenCards[1].card.style.display = "flex";
       arrOpenCards[0].object.status = "shown";
       arrOpenCards[1].object.status = "shown";
       countShownCards += 2;
       document.getElementById("amountOfSuccessCoupleCards").innerText = `${countShownCards / 2}/${amountOfCards/2} זוגות`
    }
    else{
        arrOpenCards[0].card.style.display = "none";
        arrOpenCards[1].card.style.display = "none";
    }

     //איפוס
     flagCardsOpen = 0;
     cardsOpen = [];

    if(countShownCards == arrOfCards.length){
        alert("המשחק הסתיים");
        resetGame(arrOfCards);

    }
}


//התחלת משחק חדש
function resetGame(arrOfCards){
    for(index in arrOfCards){
        arrOfCards[index].status = "hidden";
        document.getElementsByClassName("overtCard")[index].style.display = "none";
    }

    countShownCards = 0;
    totalShowingCards = 0;
    document.getElementById("amountOfSuccessCoupleCards").innerText = 0;
    document.getElementById("amountOfShowingCardsTotal").innerText = 0;

    suffel(arrOfCards);

}


//פופ אפ שמורה על תחילת משחק
function popUpStartGame(numOfCards){
    document.body.innerHTML += `
        <div id="popUpStartGame">
            התחל משחק עם ${numOfCards} קלפים
        </div>
    `;

    setTimeout(()=>{
        document.getElementById("popUpStartGame").remove();
    },1000);
}

//פופ אפ שמסמל הצלחה
function popUpSuccess(){
    let popUP = document.createElement('div');
    popUP.id = 'popUpSuccessId';
    popUP.classList.add('popUpSuccess');
    popUP.innerText = `איזה כיף , מצאת זוג ! `;       
    document.body.appendChild(popUP)

    setTimeout(()=>{
        document.getElementById("popUpSuccessId").remove();
    },800);
}



//שינוי פריסת הכרטיסים בהתאם לגודל המסך
function eventScreenWidth(){

        //טיפול במקרה שהמסך מעל 1200 ונשארים על אותה כמות קלפים ומשנים רק את גודל המסך
        //TODO: כאשר עוברים ממסך של מעל 1200 למסך של 600 ומטה זה לא מדפיס את הגודל הנכון ובגלל זה גם לא את הפריסה הנכונה
        if(window.innerWidth > 1200){
            let cardClassList = document.getElementsByClassName('card');
            if(cardClassList.length > 0){            
                if(cardClassList.length == 12)
                    document.getElementById("containerCards").style.gridTemplateColumns = "1fr 1fr 1fr 1fr"; 
                else if(cardClassList.length == 20)
                    document.getElementById("containerCards").style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr"; 
                else if(cardClassList.length == 30)
                    document.getElementById("containerCards").style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr 1fr"; 
            }
        }
        else if(window.innerWidth <= 600){
            document.getElementById("containerCards").style.gridTemplateColumns = "1fr 1fr"; 
        
        }
        else if(window.innerWidth <= 1200){
            document.getElementById("containerCards").style.gridTemplateColumns = "1fr 1fr 1fr"; 
        }
        

}

window.addEventListener("resize", eventScreenWidth);
window.addEventListener("DOMContentLoaded", eventScreenWidth);

