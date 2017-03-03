/**
 * Created by lihiverchik on 14/01/2017.
 */


var React = require('react');
var constantsStrings = require('../utils/ConstantStrings');
var managementServices = require('../communication/managementServices');
var paths = require('../utils/Paths');
var shiftStyles = require('../styles/salesmanStyles/shiftStyles');

var ShiftContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState(){
        return{
            shift: this.props.location.state.newShift
        }
    },
    handleFinishShift: function (e) {
        e.preventDefault();
        this.context.router.push({
            pathname: paths.salesman_endShift_path
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
    handleSelectSale: function(){
        this.context.router.push({
            pathname: paths.salesman_sale_path,
            state: {newShift: this.state.shift}
        })
    },
    render: function () {
        return (
            <div className='main-container'>
                <div height="50%">
                    <h1> here </h1>
                    <h1> we </h1>
                    <h1> will </h1>
                    <h1> have </h1>
                    <h1> some </h1>
                    <h1> info </h1>
                    <h1> about </h1>
                    <h1> the </h1>
                    <h1> bonuses </h1>
                    <h1> and </h1>
                    <h1> already </h1>
                    <h1> sold </h1>
                    <h1> products </h1>
                </div>
                <div className="footer navbar-fixed-bottom">

                    <div style={shiftStyles.buttonsContainer}>
                        <div>
                            <button style={shiftStyles.saleButton} onClick={this.handleSelectSale} className="w3-btn-floating-large" >sale</button>
                        </div>
                        <div>
                            <button style={shiftStyles.openBottleButton} className="w3-btn-floating-large" >open</button>
                        </div>
                    </div>

                </div>
            </div>

        )
    }
});

module.exports = ShiftContainer;