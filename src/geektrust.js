const fs = require("fs");
const filename = process.argv[2];
const moment = require('moment')
let DetailOfplan = {
    Music: {
        FREE: {
            amount: 0,
            time: 1
        },
        PERSONAL: {
            amount: 100,
            time: 1
        },
        PREMIUM: {
            amount: 250,
            time: 3
        }
    },      
     Video: {
        FREE: {
            amount: 0,
            time: 1
    },
        PERSONAL: {
            amount: 200,
            time: 0
        },
        PREMIUM: {
            amount: 500,
            time: 3
        }
    },
    Podcat: {
        FREE: {
            amount: 0,
            time: 1
        },
        PERSONAL: {
            amount: 100,
            time: 1
        },
        PREMIUM: {
            amount: 300,
            time: 2
        }
    }
}
let topUp = {
    FOUR_DEVICE: {
        amount: 50,
        device: 4
    },
    TEN_DEVICE: {
        amount: 100,
        device: 10
    },

}
 

let allPrice = 0;
let tupleIndex = [];
let planIndex = [];
let subPlan = {};

function showInformation(){
    if (planIndex.length === 0) {
        console.log('SUBSCRIPTIONS_NOT_FOUND');
        return;
    }
    for (j = 0; j < planIndex.length; j++) {
        console.log('RENEWAL_REMINDER ' + planIndex[j].type + ' ' + planIndex[j].enDate);
    }
    console.log('RENEWAL_AMOUNT ' + allPrice);
}



data = fs.readFileSync(process.argv[2]).toString();
const addTop = (device, num) => {
    if (subPlan.date == 'NULL') {
        console.log('ADD_TOPUP_FAILED INVALID_DATE');
        return;
    }
    if (planIndex.length === 0) {
        console.log('ADD_TOPUP_FAILED SUBSCRIPTIONS_NOT_FOUND');
        return;
    }
    let checkSub = tupleIndex.find(item => item == device + '_' + num)
    if (checkSub) {
        console.log('ADD_TOPUP_FAILED DUPLICATE_TOPUP');
        return;
    }
    let topInfo = topUp[device];
    let topPrice = topInfo.amount * num;
    allPrice = allPrice + topPrice;
    tupleIndex.push(device + '_' + num);
}



function subScrip(type, plan){
    let planDetails = DetailOfplan[type];
    let month = planDetails[plan.trim()].time
    if (subPlan.date == 'NULL') {
        console.log('ADD_SUBSCRIPTION_FAILED INVALID_DATE');
        return;
    }
    let enDate = moment(subPlan.date, "DD-MM-YYYY").add(month, 'M').format('DD-MM-YYYY');
    let obj = {type,plan,startDate: subPlan.date,
        enDate: moment(enDate, "DD-MM-YYYY").subtract(10, 'days').format('DD-MM-YYYY')
    }
    let checkSub = planIndex.find(item => item.type.trim() == type.trim())
    if (checkSub) {
        console.log('ADD_SUBSCRIPTION_FAILED DUPLICATE_CATEGORY');
        return;
    }
    if (!checkSub) {
        planIndex.push(obj);
        allPrice = allPrice + planDetails[plan.trim()].amount
    }

}



function dateMention(dateSt){
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (dateSt.match(regex) === null) {
        console.log('Date is not valid');
        subPlan.date = 'NULL';
        return "NULL";
    }
    const [day, month, year] = dateSt.split('-');
    const isformatted = `${year}-${month}-${day}`;
    const date = new Date(isformatted);
    const timestamp = date.getTime();
    if (typeof timestamp !== 'number') {
        console.log('DATEis INVALID');
        subPlan.date = 'NULL';
        return "NULL";
    }
    subPlan.date = dateSt;
}




// here we define main method
function mainMethod(inputData) {
    var input = inputData.toString().split("\n")
    for (i = 0; i < input.length; i++) {
        if (input) {
            let input = input[i].split(' ')
            switch (input[0]) {
                case 'START_SUBSCRIPTION':
                    dateMention(input[1].trim());
                    break;
                case 'ADD_SUBSCRIPTION':
                    subScrip(input[1], input[2]);
                    break;
                case 'ADD_TOPUP':
                    addTop(input[1], input[2]);
                    break;
                case 'PRINT_RENEWAL_DETAILS':
                    showInformation()
                    break;

            }
        }
    }
}
mainMethod(data);


module.exports = { mainMethod }