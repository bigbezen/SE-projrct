/**
 * Created by lihiverchik on 11/01/2017.
 */

var React = require('react');
var constantsStrings = require('../utils/ConstantStrings');
var managementServices = require('../communication/managementServices');

var StartShiftContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    handleSubmitReport: function (e) {
        e.preventDefault();
        var shift = this.props.location.state.newShift;
        for(var i=0; i<shift.salesReport.length; i++){
            shift.salesReport[i].stockStartShift = parseInt(this.refs[i].value);
        }
        console.log("after loop:");
        console.log(shift);
        var context = this.context;
        context.router.push({
            pathname: '/salesman/Shift',
            state: {newShift: shift}
        })
        /*managementServices.editShift(shift).then(function (n) { //TODO: fix this!!!!!!
            if (n) {
                alert('edit succeed');
                context.router.push({
                    pathname: '/salesman/Shift'
                })
            }
            else {
                alert('edit failed');
                console.log("error");
            }
        })*/
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
                <form onSubmit={this.handleSubmitReport} className="form-horizontal">
                    {this.props.location.state.newShift.salesReport.map(this.renderEachProduct)}
                    <button className="w3-btn w3-theme-d5 col-sm-4 col-sm-offset-5"
                            type="submit"> </button>
                </form>
            </div>

        )
    }
});

module.exports = StartShiftContainer;