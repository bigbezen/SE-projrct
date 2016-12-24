/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');

var StoreDetails = React.createClass({

    render: function () {
        console.log(this.props.location.query);
        return (
            <div>store detailsssss</div>
        )
    }
});

module.exports = StoreDetails;