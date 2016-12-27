/**
 * Created by lihiverchik on 14/12/2016.
 */
//var connection = require('../communication/connectionHandler')
var connection = require('../communication/connectionHandlerStub')

var helpers = {
    addUser: function(user){
        console.log('managementervices- addUser');
        return connection.addUser(user);
    },

    editUser: function(user){
        console.log('managementervices- editUser');
        return connection.editUser(user);
    },

    deleteUser: function(user){
        console.log('managementervices- deleteUser');
        return connection.deleteUser(user);
    },

    addStore: function(store){
        console.log('managementervices- addStore');
        return connection.addStore(store);
    },

    editStore: function(store){
        console.log('managementervices- editStore');
        return connection.editStore(store);
    },

    deleteStore: function(store){
        console.log('managementervices- deleteStore');
        return connection.deleteStore(store);
    },

    getAllStores: function(){
        console.log('managementervices- getAllStores');
        return connection.getAllStores();
    },

    addProduct: function(product){
        console.log('managementervices- addProduct');
        return connection.addProduct(product);
    },

    editProduct: function(product){
        console.log('managementervices- editProduct');
        return connection.editProduct(product);
    },

    getAllProducts: function(){
        console.log('managementervices- getAllProducts');
        return connection.getAllProducts();
    },

    deleteProduct: function(product){
        console.log('managementervices- deleteProduct');
        return connection.deleteProduct(product);
    },

    addEncouragement: function(){
        console.log('managementervices- addEncouragement');
        return connection.addEncouragement();
    },

    editEncouragement: function(){
        console.log('managementervices- editEncouragement');
        return connection.editEncouragement();
    },

    deleteEncouragement: function(){
        console.log('managementervices- deleteEncouragement');
        return connection.deleteEncouragement();
    },

    addShift: function(){
        console.log('managementervices- addShift');
        return connection.addShift();
    },

    editShift: function(){
        console.log('managementervices- editShift');
        return connection.editShift();
    },

    deleteShift: function(){
        console.log('managementervices- deleteShift');
        return connection.deleteShift();
    }
};

module.exports = helpers;