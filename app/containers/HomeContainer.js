/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var Home = require('../components/Home');
var UsersContainer = require('../containers/UsersContainer')
var ProductsContainer = require('../containers/ProductsContainer')
var StoresContainer = require('../containers/StoresContainer')


var HomeContainer = React.createClass({
    /*handleUsers: function () {
        return UsersContainer.handleUsersSelection()
            .then(function (n) {
                console.log(n);
            })
    },

    handleStores: function () {
        return StoresContainer.handleStoresSelection()
            .then(function (n) {
                console.log(n);
            })
    },

    handleProducts: function () {
        return ProductsContainer.handleProductsSelection()
            .then(function (n) {
                console.log(n);
            })
    },*/

    render: function () {
        return (
            <Home /*onSelectUsers={this.handleUsers}
                  onSelectProducts={this.handleProducts}
                  onSelectStores={this.handleStores}/*//>
        )
    }
});

module.exports = HomeContainer;