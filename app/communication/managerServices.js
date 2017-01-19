/**
 * Created by lihiverchik on 14/12/2016.
 */
var connection = require('../communication/connectionHandler')

var helpers = {
    addNotificationRule: function(){
        console.log('userServices- Login ');
        return connection.managerRequests.addNotificationRule();
    },

    removeNotificationRule: function(){
        console.log('managerServices- Login ');
        return connection.managerRequests.removeNotificationRule();
    },

    setNotificationRule: function(){
        console.log('managerServices- setNotificationRule');
        return connection.managerRequests.setNotificationRule();
    },

    sendBroadcastMessage: function(){
        console.log('managerServices- sendBroadcastMessage');
        return connection.managerRequests.sendBroadcastMessage();
    },

    getShiftNotes: function(){
        console.log('managerServices- getShiftNotes');
        return connection.managerRequests.getShiftNotes();
    },

    editSalesReport: function(){
        console.log('managerServices- editSalesReport');
        return connection.managerRequests.editSalesReport();
    },

    getRecommendations: function(){
        console.log('managerServices- getRecommendations');
        return connection.managerRequests.getRecommendations();
    },

    getShiftDetails: function(){
        console.log('managerServices- getShiftDetails');
        return connection.managerRequests.getShiftDetails();
    },

    getShortages: function(){
        console.log('managerServices- getShortages');
        return connection.managerRequests.getShortages();
    },

    getSaleReportXl: function(shift){
        console.log('managerServices- getReports');
        return connection.managerRequests.getSaleReportXl(shift);
    }
};

module.exports = helpers;