/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');

var ProductDetails = React.createClass({

    render: function () {
        console.log(this.props.location.query);
        return (
            <div>product detailsssss</div>
        )
    }
});

module.exports = ProductDetails;