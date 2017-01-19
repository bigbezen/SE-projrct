/**
 * Created by lihiverchik on 11/01/2017.
 */

var React = require('react');
var constantsStrings = require('../utils/ConstantStrings');
var managementServices = require('../communication/managementServices');
var paths = require('../utils/Paths');
var startShiftStyles = require('../styles/startShiftStyles');

var StartShiftContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState()
    {
        return{
            shift:this.props.location.state.newShift
        }
    },
    handleSubmitReport: function (e) {
        e.preventDefault();
        /*var shift = this.props.location.state.newShift;
        for(var i=0; i<shift.salesReport.length; i++){
            shift.salesReport[i].stockStartShift = parseInt(this.refs[i].value);
        }
        console.log("after loop:");
        console.log(shift);
        var context = this.context;
        context.router.push({
            pathname: paths.salesman_shift_path,
            state: {newShift: shift}
        })
        managementServices.editShift(shift).then(function (n) { //TODO: fix this!!!!!!
            if (n) {
                alert('edit succeed');*/
                this.context.router.push({
                    pathname: '/salesman/Shift',
                    state: {newShift: this.state.shift}
                })
          /*  }
            else {
                alert('edit failed');
                console.log("error");
            }
        })*/
    },
    renderEachProduct: function(text, i){
        return (
                <div style={startShiftStyles.product} key={i} height={'100%'}>
                    <div style={startShiftStyles.product__detail}>
                        <input type="checkbox" style={startShiftStyles.product__selector} value=""/>
                    </div>
                    <div style={startShiftStyles.product__detail}>
                        <h1> {text.productName} </h1>
                    </div>
                    <div style={startShiftStyles.product__detail}>
                        <h1> picture</h1>
                    </div>
                </div>
        );
    },
    render: function () {

        return (

            <div>
                <div className="w3-theme-d5">
                    <h1>{constantsStrings.storeStatus_string}</h1>
                </div>

                <div className="w3-theme-l5">
                    {this.props.location.state.newShift.salesReport.map(this.renderEachProduct)}
                </div>

                <div className="">
                    <button className="w3-theme-d5"
                            onClick={this.handleSubmitReport} type="submit"> {constantsStrings.startShift_string}
                    </button>
                </div>

           </div>
        )
    }
});

module.exports = StartShiftContainer;