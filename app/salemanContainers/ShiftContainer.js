/**
 * Created by lihiverchik on 14/01/2017.
 */


var React = require('react');
var constantsStrings = require('../utils/ConstantStrings');
var managementServices = require('../communication/managementServices');

var ShiftContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    handleFinishShift: function (e) {
        e.preventDefault();
        this.context.router.push({
            pathname: '/salesman/EndShift'
        })
    },
    renderEachProduct: function(text, i){
        return (
            <div className="w3-theme-l5 col-sm-10 col-sm-offset-1 w3-section form-group" key={i}>
                <label className="w3-section col-sm-4"> {text.productName} </label>
                <input ref={i} className="w3-section col-sm-offset-4" type="number" value="0" min={0} />
            </div>
        );
    },
    render: function () {
        return (
            <div className='main-container'>
                <form className="form-horizontal">
                    {this.props.location.state.newShift.salesReport.map(this.renderEachProduct)}
                </form>

                <button className="w3-btn w3-theme-d5 col-sm-4 col-sm-offset-5"
                        type="submit" onClick={this.handleFinishShift}> </button>
            </div>

        )
    }
});

module.exports = ShiftContainer;