/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var Table = require('../components/EntitiesTable');
var ProductDetails = require('../containers/ProductDetails');


var ProductsContainer = React.createClass({
    handleProductsSelection: function () {
        return console.log("productsדד")
            .then(function (n) {
                console.log(n);
            })
    },
    render: function () {
        return (
            <div> products!!! </div>
        )
    }
});

module.exports = ProductsContainer;