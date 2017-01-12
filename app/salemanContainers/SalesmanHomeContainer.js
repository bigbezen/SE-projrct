/**
 * Created by lihiverchik on 11/01/2017.
 */

var React = require('react');
var constantsStrings = require('../utils/ConstantStrings');

var SalesmanHomeContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    handleStartShift: function () {
        this.context.router.push({
            pathname: '/salesman/StartShift'
        })
    },
    render: function () {
        return (
            <div className='main-container'>
                <button onClick={this.handleStartShift}>{constantsStrings.startShift_string}</button>
            </div>

        )
    }
});

module.exports = SalesmanHomeContainer;