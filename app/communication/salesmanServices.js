/**
 * Created by lihiverchik on 17/12/2016.
 */

//var connection = require('../communication/connectionHandler')
var connection = require('../communication/connectionHandlerStub')

var helpers = {
    enterShift: function(){
        console.log('salemanServices- enterShift ');
        return connection.enterShift();
    },

    exitShift: function(){
        console.log('salemanServices- exitShift ');
        return connection.exitShift();
    },

    addSale: function(){
        console.log('salemanServices- addSale');
        return connection.addSale();
    },

    addShiftNote: function(){
        console.log('salemanServices- addShiftNote');
        return connection.addShiftNote();
    },

    getShiftNotes: function(){
        console.log('salemanServices- getShiftNotes');
        return connection.getShiftNotesBySalesman();
    },

    encouragements: function(){
        console.log('salemanServices- encouragements');
        return connection.encouragements();
    },

    shifts: function(){
        console.log('salemanServices- shifts');
        return connection.shifts();
    },

    addShiftsConstraints: function(){
        console.log('salemanServices- addShiftsConstraints');
        return connection.addShiftsConstraints();
    },

    salesHistory: function(){
        console.log('salemanServices- salesHistory');
        return connection.salesHistory();
    },

    getBroadcastMessages: function(){
        console.log('salemanServices- getBroadcastMessages');
        return connection.getBroadcastMessages();
    },

    shiftRegister: function(){
        console.log('salemanServices- shiftRegister');
        return connection.shiftRegister();
    }
};

module.exports = helpers;