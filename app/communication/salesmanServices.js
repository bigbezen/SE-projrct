/**
 * Created by lihiverchik on 17/12/2016.
 */

//var connection = require('../communication/connectionHandler')
var connection = require('../communication/connectionHandlerStub')

var helpers = {
    enterShift: function(){
        console.log('salemanServices- enterShift ');
        return connection.salesmanRequests.enterShift();
    },

    exitShift: function(){
        console.log('salemanServices- exitShift ');
        return connection.salesmanRequests.exitShift();
    },

    addSale: function(){
        console.log('salemanServices- addSale');
        return connection.salesmanRequests.addSale();
    },

    addShiftNote: function(){
        console.log('salemanServices- addShiftNote');
        return connection.salesmanRequests.addShiftNote();
    },

    getShiftNotes: function(){
        console.log('salemanServices- getShiftNotes');
        return connection.salesmanRequests.getShiftNotesBySalesman();
    },

    encouragements: function(){
        console.log('salemanServices- encouragements');
        return connection.salesmanRequests.encouragements();
    },

    shifts: function(){
        console.log('salemanServices- shifts');
        return connection.salesmanRequests.shifts();
    },

    addShiftsConstraints: function(){
        console.log('salemanServices- addShiftsConstraints');
        return connection.salesmanRequests.addShiftsConstraints();
    },

    salesHistory: function(){
        console.log('salemanServices- salesHistory');
        return connection.salesmanRequests.salesHistory();
    },

    getBroadcastMessages: function(){
        console.log('salemanServices- getBroadcastMessages');
        return connection.salesmanRequests.getBroadcastMessages();
    },

    shiftRegister: function(){
        console.log('salemanServices- shiftRegister');
        return connection.salesmanRequests.shiftRegister();
    }
};


module.exports = helpers;
