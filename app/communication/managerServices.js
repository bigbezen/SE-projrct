/**
 * Created by lihiverchik on 14/12/2016.
 */
var connection = require('../communication/connectionHandler')

var helpers = {
    addNotificationRule: function(){
        console.log('userServices- Login ');
        return connection.addNotificationRule();
    },

    removeNotificationRule: function(){
        console.log('managerServices- Login ');
        return connection.removeNotificationRule();
    },

    setNotificationRule: function(){
        console.log('managerServices- setNotificationRule');
        return connection.setNotificationRule();
    },

    sendBroadcastMessage: function(){
        console.log('managerServices- sendBroadcastMessage');
        return connection.sendBroadcastMessage();
    },

    getShiftNotes: function(){
        console.log('managerServices- getShiftNotes');
        return connection.getShiftNotes();
    },

    editSalesReport: function(){
        console.log('managerServices- editSalesReport');
        return connection.editSalesReport();
    },

    getRecommendations: function(){
        console.log('managerServices- getRecommendations');
        return connection.getRecommendations();
    },

    getShiftDetails: function(){
        console.log('managerServices- getShiftDetails');
        return connection.getShiftDetails();
    },

    getShortages: function(){
        console.log('managerServices- getShortages');
        return connection.getShortages();
    },

    publishShifts: function(){
        console.log('managerServices- publishShifts');
        return connection.publishShifts();
    },

    getReports: function(){
        console.log('managerServices- getReports');
        return connection.getReports();
    }
};

module.exports = helpers;