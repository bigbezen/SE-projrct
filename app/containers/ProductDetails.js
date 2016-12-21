/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');

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
            <div></div>
        )
    }
});

module.exports = ProductDetails;