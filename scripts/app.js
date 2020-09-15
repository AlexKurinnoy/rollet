'use strict'


document.getElementById("search").addEventListener("click", searchUser);

let user;
let roller;
// функция поиска юзера
function searchUser(){
    let id = document.getElementById('userId').value ;
     fetch('https://game-server.kovalevskyi.net/init?uid='+id)
        .then((res) => {
                res.json().then(json=>{
                    if(json.error){
                        alert(json.error)
                    }else{
                
                        user = new User(json.uid, json.balance, json.last_bet, json.bets)
                        roller = json.rolls;
                        document.querySelector("#balance").innerHTML ="<p> Balance = " + user.balance + "</p>";
                        document.querySelector("#last_bet").innerHTML = "<p> Last bet = " + user.last_bet + "</p>";
                        document.querySelector("#bets>ul").innerHTML="";
                        user.bets.forEach(element =>{
                                let button =`
                                 <li>
                                    <input type="radio" id="${element}" name="pic" />
                                    <label for="${element}">${element}</label>
                                  </li>
                                `;
                   
                                document.querySelector("#bets>ul").innerHTML+=button;
                        }   );
                        document.querySelector("#spin").innerHTML=""
                        let buttonSpin = document.createElement("button")
                        buttonSpin.innerHTML = `<p>SPIN</p>`;
                        buttonSpin.addEventListener("click", rollerRuner)
                        document.querySelector("#spin").appendChild(buttonSpin)
   //колбек запуск функции отрисовки барабана
                        showRolls(roller)
                    }
                }).catch(err =>console.log(err))
        }).catch(err =>console.log(err))

}

//
function rollerRuner(){
    let el = null;
    if(document.querySelector('input[name="pic"]:checked') ){
        el = document.querySelector('input[name="pic"]:checked').id;
        document.querySelector("#spin>button").style.visibility ="hidden";
    }else{
        alert('choice BET!!!!!')
        return false;
    }


    if( user.balance >= el && el!=0){
        document.querySelector("#roller").className += "blur";
        fetch('https://game-server.kovalevskyi.net/spin?uid=' + user.id + '&bet=' + el)
            .then((res) => {
                console.log(res)
                res.json().then(json => {
                    console.log(json)
                    if (json.error) {
                        alert(json.error)
                    } else {
                        user.balance=json.balance;
                        user.last_bet=json.last_bet;
                        showRolls(json.rolls);
                        document.querySelector("#spin>button").style.visibility ="visible";
                        document.querySelector("#balance").innerHTML ="<p> Balance = " + user.balance + "</p>";
                        document.querySelector("#last_bet").innerHTML = "<p> Last bet = " + user.last_bet + "</p>";
                        document.querySelector("#roller").classList.remove("blur");
                    }
                }).catch(err =>console.log(err))
            }).catch(err =>console.log(err))

    }else{
        console.log("err")
    }
}

function showRolls(rolls){
    document.querySelector("#roller").style.visibility ="visible";
   document.querySelector("#roller").innerHTML="";
    rolls.forEach(arr=>{
        arr.forEach(el=>{
            let pic =`<div id="${el}" class="rolls">${el}</div>`;
            document.querySelector("#roller").innerHTML+=pic;
        })
    })

}


class User {
    constructor(id, balance, las_bet, bets) {
        this.id = id;
        this._balance = balance;
        this._last_bet = las_bet;
        this.bets = bets;
    }

    // set new parametet after spin
    get balance() {
        return this._balance;
    }
    get last_bet() {
        return this._last_bet;
    }

    set balance(val){
        this._balance = val;
    }
    set last_bet(val){
        this._last_bet = val;
    }
}