/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var Table = require('../components/Table');

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
            <Table onSelectStore={this.handleStoreSelection}/>
        )
    }
});

module.exports = StoreDetails;