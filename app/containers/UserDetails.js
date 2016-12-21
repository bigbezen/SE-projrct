/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');

//var ProductDetails = require('../containers/ProductDetails');


var UserDetails = React.createClass({
    handleUserSelection: function () {
        return console.log("user details")
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

module.exports = UserDetails;