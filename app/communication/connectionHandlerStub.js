/**
 * Created by aviramad on 12/17/2016.
 */
var userObj = require('../Models/user');
var storeObj = require('../models/store');
var productObj = require('../models/product');

var userRequests = {
    login: function(username, password) {
        return 'you logged in';
    },

    logout: function() {
        return 'you logged out';
    },

    retrievePassword: function(){
        return 'you retrieve the pass';
    },

    changePassword: function(oldPass, newPass){
        return 'you changed the pass';
    },

    getProfile: function(){
        return createUser();
    }
};

var managementRequests = {
    addUser: function(user) {
        return createUser();
    },

    //TODO: param
    editUser: function(user) {
        return "edit the user";
    },

    //TODO: param
    deleteUser: function(user) {
        return 'delete user';
    },

    addStore: function(store) {
        return createStore();
    },

    editStore: function(store) {
        //TODO: add stub
    },

    deleteStore: function(store) {
        //TODO: add stub
    },

    getAllStores: function() {
        return createStoresCollection();
    },

    addProduct: function(product) {
        return createProduct();
    },

    editProduct: function(product) {
        //TODO: add stub
    },

    deleteProduct: function(product) {
        //TODO: add stub
    },

    getAllProducts: function() {
        return createProductsCollection();
    },
    
    getAllUsers: function() {
      return createUsersCollection();
    },

    addEncouragement: function() {
    },

    editEncouragement: function() {
    },

    deleteEncouragement: function() {
    },

    addShift: function() {
    },

    editShift: function() {
    },

    deleteShift: function() {
    }
};

function createUser() {
    var user1 = new userObj();
    user1._id = '1';
    user1.username = 'aviramad';
    user1.password =  'pass1';
    user1.startDate = new Date('1/1/13');
    user1.endDate = null;
    user1.personal.id = '302991468';
    user1.personal.firstName = 'אבירם';
    user1.personal.lastName = 'אדירי';
    user1.personal.sex = 'זכר';
    user1.contact = null;
    user1.jobDetails.userType = 'דייל';
    user1.inbox = [];

    return user1;
}

function createUsersCollection() {
    var users = [];

    // first user
    var user1 = new userObj();
    user1._id = '1';
    user1.username = 'aviramad';
    user1.password =  'pass1';
    user1.startDate = new Date('1/1/13');
    user1.endDate = null;
    user1.personal.id = '302991468';
    user1.personal.firstName = 'אבירם';
    user1.personal.lastName = 'אדירי';
    user1.personal.sex = 'זכר';
    user1.contact = null;
    user1.jobDetails.userType = 'דייל';
    user1.inbox = [];

    users.push(user1);

    // sec user
    var user2 = new userObj();
    user2._id = '2';
    user2.username = 'darga';
    user2.password =  'pass2';
    user2.startDate = new Date('2/1/13');
    user2.endDate = null;
    user2.personal.id = '78977897';
    user2.personal.firstName = 'גל';
    user2.personal.lastName = 'דר';
    user2.personal.sex = 'נקבה';
    user2.contact = null;
    user2.jobDetails.userType = 'דייל';
    user2.inbox = [];

    users.push(user2);

    // 3th user
    var user3 = new userObj();
    user3._id = '3';
    user3.username = 'lihiv';
    user3.password =  'pass3';
    user3.startDate = new Date('4/10/15');
    user3.endDate = null;
    user3.personal.id = '65346546';
    user3.personal.firstName = 'ליהיא';
    user3.personal.lastName = 'וורצ\'יק';
    user3.personal.sex = 'נקבה';
    user3.contact = null;
    user3.jobDetails.userType = 'דייל';
    user3.inbox = [];

    users.push(user3);

    // 4th user
    var user4 = new userObj();
    user4._id = '4';
    user4.username = 'shahafs';
    user4.password =  'pass4';
    user4.startDate = new Date('12/12/16');
    user4.endDate = null;
    user4.personal.id = '543564365';
    user4.personal.firstName = 'shahaf';
    user4.personal.lastName = 'stein';
    user4.personal.sex = 'זכר';
    user4.contact = null;
    user4.jobDetails.userType = 'סוכן שטח';
    user4.inbox = [];

    users.push(user4);

    // 5th user
    var user5 = new userObj();
    user5._id = '5';
    user5.username = 'bezen';
    user5.password =  'pass5';
    user5.startDate = new Date('5/6/14');
    user5.endDate = null;
    user5.personal.id = '123456789';
    user5.personal.firstName = 'מתן';
    user5.personal.lastName = 'בזן';
    user5.personal.sex = 'זכר';
    user5.contact = null;
    user5.jobDetails.userType = 'מנהל';
    user5.inbox = [];

    users.push(user5);

    return users;
}

function createStoresCollection() {
    var stores = [];

    //store 1
    var store1 = new storeObj();
    store1._id = '1';
    store1.name = 'בנא משקאות';
    store1.managerName = 'ישראל ישראלי';
    store1.phone = '052333333';
    store1.city = 'באר שבע';
    store1.address = 'המרד 57';
    store1.area = 'דרום';
    store1.channel = 'מסחרי';

    stores.push(store1);

    //store 2
    var store2 = new storeObj();
    store2._id = '2';
    store2.name = 'דרינק אנד קו';
    store2.managerName = 'מירי מסיקה';
    store2.phone = '052222222';
    store2.city = 'באר שבע';
    store2.address = 'האורגים 12';
    store2.area = 'דרום';
    store2.channel = 'מסחרי';

    stores.push(store2);

    //store 3
    var store3 = new storeObj();
    store3._id = '3';
    store3.name = 'רמי לוי בעמ';
    store3.managerName = 'רמי לוי';
    store3.phone = '052111111';
    store3.city = 'דימונה';
    store3.address = 'הדימונאים 21';
    store3.area = 'דרום';
    store3.channel = 'קלאסי';

    stores.push(store3);

    //store 4
    var store4 = new storeObj();
    store4._id = '4';
    store4.name = 'טרמינל';
    store4.managerName = 'אביב גפן';
    store4.phone = '052333338';
    store4.city = 'מנוחה';
    store4.address = 'המרד 57';
    store4.area = 'דרום';
    store4.channel = 'מסחרי';

    stores.push(store4);

    return stores;
}

function createStore() {
    var store4 = new storeObj();

    store4._id = '1';
    store4.name = 'טרמינל';
    store4.managerName = 'אביב גפן';
    store4.phone = '052333338';
    store4.city = 'מנוחה';
    store4.address = 'המרד 57';
    store4.area = 'דרום';
    store4.channel = 'מסחרי';

    return store4;
}

function createProductsCollection() {
    var products = [];

    // product 1
    var product1 = new productObj();
    product1._id = '1';
    product1.name = 'אבסולוט';
    product1.retailPrice = 40;
    product1.salePrice = 50;
    product1.category = 'ספיריט';
    product1.subCategory = 'וודקה';
    product1.minRequiredAmount = 20;
    product1.notifyManager = false;

    products.push(product1);

    var product2 = new productObj();
    product2._id = '2';
    product2.name = 'סמירנוף';
    product2.retailPrice = 50;
    product2.salePrice = 55;
    product2.category = 'ספיריט';
    product2.subCategory = 'וודקה';
    product2.minRequiredAmount = 20;
    product2.notifyManager = false;

    products.push(product2);

    var product3 = new productObj();
    product3._id = '3';
    product3.name = 'קורווזיה VSOP';
    product3.retailPrice = 170;
    product3.salePrice = 220;
    product3.category = 'ספיריט';
    product3.subCategory = 'קוניאק';
    product3.minRequiredAmount = 5;
    product3.notifyManager = true;

    products.push(product3);

    var product4 = new productObj();
    product4._id = '4';
    product4.name = 'יין תבור';
    product4.retailPrice = 50;
    product4.salePrice = 70;
    product4.category = 'יין';
    product4.subCategory = 'הסדרה האיזורית';
    product4.minRequiredAmount = 15;
    product4.notifyManager = false;

    products.push(product4);

    var product5 = new productObj();
    product5._id = '5';
    product5.name ='ג\'וני ווקר blue';
    product5.retailPrice = 400;
    product5.salePrice = 600;
    product5.category = 'ספיריט';
    product5.subCategory = 'וויסקי';
    product5.minRequiredAmount = 3;
    product5.notifyManager = true;

    products.push(product5);

    return products;
}

function createProduct() {
    var product5 = new productObj();

    product5._id = '1';
    product5.name = 'אבסולוט';
    product5.retailPrice = 40;
    product5.salePrice = 50;
    product5.category = 'ספיריט';
    product5.subCategory = 'וודקה';
    product5.minRequiredAmount = 10;
    product5.notifyManager = false;

    return product5;
}

/*
function createProductsCollectionArray() {
    var products  = [
        {
            name: 'אבסולוט',
            retailPrice: 40,
            salePrice: 50,
            category: 'ספיריט',
            subCategory: 'וודקה',
            minRequiredAmount: 20,
            notifyManager: false
        }, {
            name : 'סמירנוף',
            retailPrice : 50,
            salePrice : 55,
            category : 'ספיריט',
            subCategory : 'וודקה',
            minRequiredAmount : 20,
            notifyManager : false
        }, {
            name : 'קורווזיה VSOP',
            retailPrice : 170,
            salePrice : 220,
            category : 'ספיריט',
            subCategory : 'קוניאק',
            minRequiredAmount : 5,
            notifyManager : true
        }, {
            name : 'יין תבור',
            retailPrice : 50,
            salePrice : 70,
            category : 'יין',
            subCategory : 'הסדרה האיזורית',
            minRequiredAmount : 15,
            notifyManager : false
        } ,{
            name : 'ג\'וני ווקר blue',
            retailPrice : 400,
            salePrice : 600,
            category : 'ספיריט',
            subCategory : 'וויסקי',
            minRequiredAmount : 3,
            notifyManager : true
        }];
    return products;
}
*/

var managerRequests = {
    addNotificationRule: function(){
        errorMessage('addNotificationRule', 'Not implemented yet');
    },

    removeNotificationRule: function(){
        errorMessage('removeNotificationRule', 'Not implemented yet');
    },

    setNotificationRule: function(){
        errorMessage('setNotificationRule', 'Not implemented yet');
    },

    sendBroadcastMessage: function(){
        errorMessage('sendBroadcastMessage', 'Not implemented yet');
    },

    getShiftNotes: function(){
        errorMessage('getShiftNotes', 'Not implemented yet');
    },

    editSalesReport: function(){
        errorMessage('editSalesReport', 'Not implemented yet');
    },

    getRecommendations: function(){
        errorMessage('getRecommendations', 'Not implemented yet');
    },

    getShiftDetails: function(){
        errorMessage('getShiftDetails', 'Not implemented yet');
    },

    getShortages: function(){
        errorMessage('getShortages', 'Not implemented yet');
    },

    publishShifts: function(){
        errorMessage('publishShifts', 'Not implemented yet');
    },

    getReports: function(){
        errorMessage('getReports', 'Not implemented yet');
    }
};

var salesmanRequests = {
    enterShift: function() {
        //TODO: this about what
    },

    exitShift: function() {
        //TODO: this about what
    },

    addSale: function(){
        //TODO: this about what
    },

    addShiftNote: function(){
        //TODO: this about what
    },

    getShiftNotesBySalesman: function(){
        //TODO: this about what
    },

    encouragements: function(){
        //TODO: this about what
    },

    shifts: function(){
        //TODO: this about what
    },

    addShiftsConstraints: function(){
        //TODO: this about what
    },

    salesHistory: function(){
        //TODO: this about what
    },

    getBroadcastMessages: function(){
        //TODO: this about what
    },

    shiftRegister: function(){
        //TODO: this about what
    }
};


module.exports = managerRequests;
module.exports = userRequests;
module.exports = managementRequests;
module.exports = salesmanRequests;