/**
 * Created by lihiverchik on 17/12/2016.
 */
var React = require('react');
var Table = require('../components/EntitiesTable');
var StoreDetails = require('../containers/StoreDetails');


var StoresContainer = React.createClass({
    handleStoresSelection: function () {
        return console.log("stores")
            .then(function (n) {
                console.log(n);
            })
    },
    render: function () {
        return (
            <div> storessss </div>
        )
    }
});

module.exports = StoresContainer;