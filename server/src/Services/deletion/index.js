let dal             = require('../../DAL/dal');

let users      = require('../../Models/user');
let shifts      = require('../../Models/shift');
let messages       = require('../../Models/message');
let products       = require('../../Models/product');
let stores       = require('../../Models/store');
let encs       = require('../../Models/encouragement');
let MAReport    = require('../../Models/Reports/monthAnalysisReport');
let SMHReport   = require('../../Models/Reports/SummaryMonthlyHoursReport');


let cleanDb = async function(){
    let result = await users.remove({'username': {$ne: 'admin'}});
    result = await shifts.remove({});
    result = await messages.remove({});
    result = await products.remove({});
    result = await stores.remove({});
    result = await encs.remove({});
    result = await MAReport.remove({});
    result = await SMHReport.remove({});
    return result;
};

let cleanUsers = async function(){
    let result = await users.remove({'username': {$ne: 'admin'}});
    return result;
};

let cleanShifts = async function(){
    let result = await shifts.remove({});
    return result;
};

let cleanMessages = async function() {
    let result = await messages.remove({});
    return result;
};

let cleanProducts = async function(){
    let result = await products.remove({});
    return result;
};

let cleanStores = async function(){
    let result = await stores.remve({});
    return result;
};

let cleanEncs = async function() {
    let result = await encs.remove({});
    return result;
};

let cleanMAReport = async function(){
    let result = MAReport.remove({});
    return result;
};

let cleanSMHReport = async function(){
    let result = SMHReport.remove({});
    return result;
};

let initiateProductsDb =  async function(){
    let productsSpirit = [
        {
            name: 'רד לייבל',
            subCategory: 'Johnnie Walker',
        },
        {
            name: 'רד ריי',
            subCategory: 'Johnnie Walker',
        },
        {
            name: 'בלאק לייבל',
            subCategory: 'Johnnie Walker',
        },
        {
            name: 'דאבל בלאק לייבל',
            subCategory: 'Johnnie Walker',
        },
        {
            name: 'גרין לייבל',
            subCategory: 'Johnnie Walker',
        },
        {
            name: 'גולד רזרב',
            subCategory: 'Johnnie Walker',
        },
        {
            name: 'פלטינום',
            subCategory: 'Johnnie Walker',
        },
        {
            name: 'בלו לייבל',
            subCategory: 'Johnnie Walker',
        },
        {
            name: "ג'וני ווקר קינג ג'ורג' V",
            subCategory: 'Johnnie Walker',
        },
        {
            name: "ג'וני ווקר אודיסי",
            subCategory: 'Johnnie Walker',
        },
        {
            name: 'The John Walker',
            subCategory: 'Johnnie Walker',
        },
        {
            name: 'J&B',
            subCategory: 'Irish & Scotch Blended Whiskey',
        },
        {
            name: 'דימפל 15',
            subCategory: 'Irish & Scotch Blended Whiskey',
        },
        {
            name: 'אייריש מיסט',
            subCategory: 'Irish & Scotch Blended Whiskey',
        },
        {name: 'סינגלטון 12', subCategory: 'Malt Whiskey',},
        {name: 'סינגלטון 15', subCategory: 'Malt Whiskey',},
        {name: 'סינגלטון 18', subCategory: 'Malt Whiskey',},
        {name: 'סינגלטון Tailfire', subCategory: 'Malt Whiskey',},
        {name: 'קארדו 12', subCategory: 'Malt Whiskey',},
        {name: 'קארדו 15', subCategory: 'Malt Whiskey',},
        {name: 'קארדו 18', subCategory: 'Malt Whiskey',},
        {name: 'קארדו גולד ריזרב', subCategory: 'Malt Whiskey',},
        {name: 'טליסקר 10', subCategory: 'Malt Whiskey',},
        {name: 'טליסקר סטורם', subCategory: 'Malt Whiskey',},
        {name: 'טליסקר 18', subCategory: 'Malt Whiskey',},
        {name: 'קליסקר 25', subCategory: 'Malt Whiskey',},
        {name: 'טליסקר 30', subCategory: 'Malt Whiskey',},
        {name: 'טליסקר 57N', subCategory: 'Malt Whiskey',},
        {name: 'טליסקר DE', subCategory: 'Malt Whiskey',},
        {name: 'לאגאבולין 8', subCategory: 'Malt Whiskey',},
        {name: 'לאגאבולין 12', subCategory: 'Malt Whiskey',},
        {name: 'לאגאבולין 16', subCategory: 'Malt Whiskey',},
        {name: 'לאגאבולין DE', subCategory: 'Malt Whiskey',},
        {name: 'קאול אילה 12', subCategory: 'Malt Whiskey',},
        {name: 'קאול אילה DE', subCategory: 'Malt Whiskey',},
        {name: 'רויאל לוכנגר 12', subCategory: 'Malt Whiskey',},
        {name: 'קליינאליש 14', subCategory: 'Malt Whiskey',},
        {name: "גלין קינצ'י 12", subCategory: 'Malt Whiskey',},
        {name: 'דלוויני 15', subCategory: 'Malt Whiskey',},
        {name: 'קראגנאמור 12', subCategory: 'Malt Whiskey',},
        {name: 'אובן 14', subCategory: 'Malt Whiskey',},
        {name: 'מורטלאך 18', subCategory: 'Malt Whiskey',},
        {name: 'מורטלאך 25', subCategory: 'Malt Whiskey',},
        {name: 'מורטלאך RO', subCategory: 'Malt Whiskey',},
        {name: 'ויילד טרקי 81', subCategory: 'American & Canadian Whiskey',},
        {name: 'ויילד טרקי 101', subCategory: 'American & Canadian Whiskey',},
        {name: 'ויילד טרקי ריי', subCategory: 'American & Canadian Whiskey',},
        {name: 'בולט ברבן', subCategory: 'American & Canadian Whiskey',},
        {name: 'בולט ריי', subCategory: 'American & Canadian Whiskey',},
        {name: 'קראון רויאל', subCategory: 'American & Canadian Whiskey',},
        {name: 'פייר פראן אמבר', subCategory: 'Cogniac',},
        {name: 'פייר פראן רזרב', subCategory: 'Cogniac',},
        {name: "פייר פראן סלקסיון דה אנג'לס", subCategory: 'Cogniac',},
        {name: 'פייר פראן אבל', subCategory: 'Cogniac',},
        {name: "סמירנוף רד", subCategory: 'Vodka',},
        {name: "סנירנוף בלאק", subCategory: 'Vodka',},
        {name: "סמירנוף גולד", subCategory: 'Vodka',},
        {name: "קטל וואן", subCategory: 'Vodka',},
        {name: "קטל וואן סיטרון", subCategory: 'Vodka',},
        {name: "קטל וואן תפוז", subCategory: 'Vodka',},
        {name: "סירוק", subCategory: 'Vodka',},
        {name: "טנקרי סטרלינג", subCategory: 'Vodka',},
        {name: "גורדונס", subCategory: 'Gin',},
        {name: "טנקרי", subCategory: 'Gin',},
        {name: "טנקרי 10", subCategory: 'Gin',},
        {name: "קפטן מורגן ספייסד", subCategory: 'Rum',},
        {name: "קפטן מורגן בלאק", subCategory: 'Rum',},
        {name: "זאקאפה 23", subCategory: 'Rum',},
        {name: "זאקאפה XO", subCategory: 'Rum',},
        {name: "זאקאפה ריזרב לימיטד אדישן", subCategory: 'Rum',},
        {name: "פמפרו בלאנקו", subCategory: 'Rum',},
        {name: "מאיירס רום", subCategory: 'Rum',},
        {name: "פיסקו", subCategory: 'Pisco',},
        {name: "אספולון בלאנקו", subCategory: 'Teqila',},
        {name: "אספולון רפוסאדו", subCategory: 'Teqila',},
        {name: "דון חוליו בלאנקו", subCategory: 'Teqila',},
        {name: "דון חוליו רפוסאדו", subCategory: 'Teqila',},
        {name: "דון חוליו אנייחו", subCategory: 'Teqila',},
        {name: "דון חוליו 1942", subCategory: 'Teqila',},
        {name: "ערק אל נמרוד", subCategory: 'Anise',},
        {name: "אוזו 12", subCategory: 'Anise',},
        {name: "צ'נזאנו ביאנקו", subCategory: 'Vermouth',},
        {name: "צ'נזאנו רוסו", subCategory: 'Vermouth',},
        {name: "צ'נזאנו אקסטרא דריי", subCategory: 'Vermouth',},
        {name: "צ'ינזאנו 1757", subCategory: 'Vermouth',},
        {name: "בייליס", subCategory: 'Liqeuers',},
        {name: "פרנג'ליקו", subCategory: 'Liqeuers',},
        {name: "גרנד מרנייה", subCategory: 'Liqeuers',},
        {name: "שרידנס", subCategory: 'Liqeuers',},
        {name: "מי טוניק", subCategory: 'Fever Tree',},
        {name: "טוניק למון", subCategory: 'Fever Tree',},
        {name: "ג'ינג'ר ביר", subCategory: 'Fever Tree',},
        {name: "ג'ינג'ר אייל", subCategory: 'Fever Tree',},

    ];
    let productsWine = [
        {name: "קברנה סוביניון", subCategory: 'תבור הר',},
        {name: "מרלו", subCategory: 'תבור הר',},
        {name: "שירז", subCategory: 'תבור הר',},
        {name: "שרדונה", subCategory: 'תבור הר',},
        {name: "גוורצטרמינר", subCategory: 'תבור הר',},
        {name: "רוזה", subCategory: 'תבור הר',},


        {name: "לבן", subCategory: 'תבור פנינים',},
        {name: "רוזה", subCategory: 'תבור פנינים',},
        {name: "אדום", subCategory: 'תבור פנינים',},

        {name: "קברנה סוביניון", subCategory: 'תבור אדמה',},
        {name: "מרלו", subCategory: 'תבור אדמה',},
        {name: "שירז", subCategory: 'תבור אדמה',},
        {name: "שרדונה", subCategory: 'תבור אדמה',},
        {name: "גוורצטרמינר", subCategory: 'תבור אדמה',},
        {name: "סוביניון בלאן", subCategory: 'תבור אדמה',},
        {name: "רוסאן", subCategory: 'תבור אדמה',},
        {name: "רוזה ברברה", subCategory: 'תבור אדמה',},

        {name: "קשת", subCategory: 'תבור פרמיום',},
        {name: "רעם", subCategory: 'תבור פרמיום',},
        {name: "להבה", subCategory: 'תבור פרמיום',},
        {name: "סופה", subCategory: 'תבור פרמיום',},
        {name: "שחר", subCategory: 'תבור פרמיום',},
        {name: "זהר", subCategory: 'תבור פרמיום',},
        {name: "טנאט", subCategory: 'תבור סינגל וינארד',},
        {name: "מרסלאן", subCategory: 'תבור סינגל וינארד',},
    ];
    let product_category =
        {
            spirit: 'ספיריט',
            wine: 'יין'
        };
    try {
        console.log('bla');
        for (let product of productsSpirit) {
            let prod = new products();
            prod.name = product.name;
            prod.category = product_category.spirit;
            prod.subCategory = product.subCategory;
            prod.salePrice = 1;
            prod.retailPrice = 1;
            prod.minRequiredAmount = 1;
            prod.notifyManager = false;

            console.log('bla');
            let result = await prod.save();
            console.log('bla');
        }
        for (let product of productsWine) {
            let prod = new products();
            prod.name = product.name;
            prod.category = product_category.wine;
            prod.subCategory = product.subCategory;
            prod.salePrice = 1;
            prod.retailPrice = 1;
            prod.minRequiredAmount = 1;
            prod.notifyManager = false;
            let result = await prod.save();
        }
    }
    catch(err){
        return false;
    }
    return true;
};


module.exports.cleanDb = cleanDb;
module.exports.cleanUsers = cleanUsers;
module.exports.cleanStores = cleanStores;
module.exports.cleanShifts = cleanShifts;
module.exports.cleanMessages = cleanMessages;
module.exports.cleanProducts = cleanProducts;
module.exports.cleanEncs = cleanEncs;
module.exports.cleanMAReports = cleanMAReport;
module.exports.cleanSMHReports = cleanSMHReport;
module.exports.initiateProducts = initiateProductsDb;

















