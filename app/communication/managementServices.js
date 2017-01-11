/**
 * Created by lihiverchik on 14/12/2016.
 */
//var connection = require('../communication/connectionHandler')
var connection = require('../communication/connectionHandlerStub')

var helpers = {
    addUser: function(user){
        console.log('managementervices- addUser');
        return connection.managementRequests.addUser(user);
    },

    editUser: function(user){
        console.log('managementervices- editUser');
        return connection.managementRequests.editUser(user);
    },

    deleteUser: function(user){
        console.log('managementervices- deleteUser');
        return connection.managementRequests.deleteUser(user);
    },


    getAllUsers: function(){
        console.log('managementervices- getAllUsers');
        return connection.managementRequests.getAllUsers();
    },

    addStore: function(store){
        console.log('managementervices- addStore');
        return connection.managementRequests.addStore(store);
    },

    editStore: function(store){
        console.log('managementervices- editStore');
        return connection.managementRequests.editStore(store);
    },

    deleteStore: function(store){
        console.log('managementervices- deleteStore');
        return connection.managementRequests.deleteStore(store);
    },

    getAllStores: function(){
        console.log('managementervices- getAllStores');
        return connection.managementRequests.getAllStores();
    },

    addProduct: function(product){
        console.log('managementervices- addProduct. '+ product);
        return connection.managementRequests.addProduct(product);
    },

    editProduct: function(product){
        console.log('managementervices- editProduct');
        return connection.managementRequests.editProduct(product);
    },

    getAllProducts: function(){
        console.log('managementervices- getAllProducts');
        return connection.managementRequests.getAllProducts();
    },

    deleteProduct: function(product){
        console.log('managementervices- deleteProduct');
        return connection.managementRequests.deleteProduct(product);
    },

    addEncouragement: function(){
        console.log('managementervices- addEncouragement');
        return connection.managementRequests.addEncouragement();
    },

    editEncouragement: function(){
        console.log('managementervices- editEncouragement');
        return connection.managementRequests.editEncouragement();
    },

    deleteEncouragement: function(){
        console.log('managementervices- deleteEncouragement');
        return connection.managementRequests.deleteEncouragement();
    },

    addShift: function(){
        console.log('managementervices- addShift');
        return connection.managementRequests.addShift();
    },

    editShift: function(){
        console.log('managementervices- editShift');
        return connection.managementRequests.editShift();
    },

    deleteShift: function(){
        console.log('managementervices- deleteShift');
        return connection.managementRequests.deleteShift();
    }
};

module.exports = helpers;