/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');

//var ProductDetails = require('../containers/ProductDetails');


var StoreDetails = React.createClass({
    handleStoreSelection: function () {
        return console.log("store details")
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

module.exports = StoreDetails;