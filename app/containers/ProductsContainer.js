/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var Table = require('../components/Table');
var ProductDetails = require('../containers/ProductDetails');


var ProductsContainer = React.createClass({
    handleProductsSelection: function () {
        return console.log("products")
            .then(function (n) {
                console.log(n);
            })
    },
    render: function () {
        return (
            <Table onSelectProduct={this.handleProductsSelection}/>
        )
    }
});

module.exports = ProductsContainer;