/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');

var UserDetails = React.createClass({

    render: function () {
        console.log(this.props.location.query);
        return (
            <div>user detailsssss</div>
        )
    }
});

module.exports = UserDetails;