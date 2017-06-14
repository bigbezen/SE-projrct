/**
 * Created by lihiverchik on 17/12/2016.
 */

var connection = require('../communication/connectionHandler')
//var connection = require('../communication/connectionHandlerStub')

var helpers = {
    getCurrentShift: function(){
        console.log('salesmanServices- getCurrentShift ');
        return connection.salesmanRequests.getCurrentShift();
    },

    startShift: function(shift){
        console.log('salesmanServices- startShift ');
        return connection.salesmanRequests.startShift(shift);
    },

    getFinishedShifts: function(){
        console.log('salesmanServices- getFinishedShifts ');
        return connection.managementRequests.getShiftsByStatus('FINISHED');
    },

    getActiveShift: function(shiftId) {
        console.log('salesmanServices- getActiveShift ');
        return connection.salesmanRequests.getActiveShift(shiftId);
    },

    finishShift: function(shift){
        console.log('salesmanServices- finishShift ');
        return connection.salesmanRequests.finishShift(shift);
    },

    reportSale: function(shiftId, products){
        console.log('salesmanServices- reportSale');
        return connection.salesmanRequests.reportSale(shiftId, products);
    },

    reportOpen: function(shiftId, products){
        console.log('salesmanServices- reportOpen');
        return connection.salesmanRequests.reportOpen(shiftId, products);
    },

    reportExpenses: function(shiftId, km, parking, other){
        console.log('salesmanServices- reportExpenses');
        return connection.salesmanRequests.reportExpenses(shiftId, km, parking,other);
    },

    editSale: function(shiftId,productId, saleTime, quantity){
        console.log('salesmanServices- editSale');
        return connection.salesmanRequests.editSale(shiftId,productId, saleTime, quantity);
    },

    addShiftComment: function(shiftId, content){
        console.log('salesmanServices- addShiftComment');
        return connection.salesmanRequests.addShiftComment(shiftId, content);
    },

    getShiftNotes: function(){
        console.log('salesmanServices- getShiftNotes');
        return connection.salesmanRequests.getShiftNotesBySalesman();
    },

    encouragements: function(){
        console.log('salesmanServices- encouragements');
        return connection.salesmanRequests.encouragements();
    },

    getAllShifts: function(){
        console.log('salesmanServices- shifts');
        return connection.salesmanRequests.getAllShifts();
    },

    addShiftsConstraints: function(){
        console.log('salesmanServices- addShiftsConstraints');
        return connection.salesmanRequests.addShiftsConstraints();
    },

    salesHistory: function(){
        console.log('salesmanServices- salesHistory');
        return connection.salesmanRequests.salesHistory();
    },

    getBroadcastMessages: function(){
        console.log('salesmanServices- getBroadcastMessages');
        return connection.salesmanRequests.getBroadcastMessages();
    },

    shiftRegister: function(){
        console.log('salesmanServices- shiftRegister');
        return connection.salesmanRequests.shiftRegister();
    },

    submitConstraints: function(constraints){
        console.log('salesmanServices- submitConstraints');
        return connection.salesmanRequests.submitConstraints(constraints);
    }
};

module.exports = helpers;
