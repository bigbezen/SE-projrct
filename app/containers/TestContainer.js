/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');

var TestContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    render: function () {
        return (
            <div>
               <h1>this is a test</h1>
            </div>
        )
    }
});

module.exports = TestContainer;