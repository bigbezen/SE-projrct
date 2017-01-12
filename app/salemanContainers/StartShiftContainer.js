/**
 * Created by lihiverchik on 11/01/2017.
 */

var React = require('react');
var constantsStrings = require('../utils/ConstantStrings');

var StartShiftContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    handleStartShift: function () {
        this.context.router.push({
            pathname: '/salesman/StartShift'
        })
    },
    getInitialState: function (){
        return{
            productNames: ['אבסולוט', 'סמירנוף', 'בלאק', 'בלו'],
            editing: false
        }

    },
    renderEachProduct: function(text, i){
        return (
            <div className="w3-theme-l5 col-sm-10 col-sm-offset-1 w3-section" key={i}>
                <label className="w3-section col-sm-4"> {text} </label>
                <input className="w3-section col-sm-offset-4" type="number" min={0}
                />
            </div>

        );
    },
    render: function () {
        return (
            <div className='main-container'>
                {this.state.productNames.map(this.renderEachProduct)}
            </div>

        )
    }
});

module.exports = StartShiftContainer;