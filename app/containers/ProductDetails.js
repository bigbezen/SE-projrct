/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var Table = require('../components/Table');

//var ProductDetails = require('../containers/ProductDetails');


var ProductDetails = React.createClass({
    handleProductSelection: function () {
        return console.log("product details")
            .then(function (n) {
                console.log(n);
            })
    },
    render: function () {
        return (
            <Table onSelectProduct={this.handleProductSelection}/>
        )
    }
});

module.exports = ProductDetails;