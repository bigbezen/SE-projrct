/**
 * Created by lihiverchik on 11/01/2017.
 */

var React = require('react');
var constantsStrings = require('../utils/ConstantStrings');
var managementServices = require('../communication/managementServices');
var paths = require('../utils/Paths');
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
            pathname: paths.salesman_shift_path,
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
            <div key={i}>
                <div className="w3-row" key={i}>
                    <div className="w3-col s6 w3-container ">
                        <input ref={i} className="" type="number" value="0" min={0} />
                    </div>
                    <div className="w3-col s8 w3-container ">
                        <h1>{text.productName}</h1>
                    </div>

                </div>
                <hr/>
            </div>


        );
    },
    render: function () {

        return (

            <div>
                <div className="w3-container w3-theme-d5">
                    <h1>{constantsStrings.storeStatus_string}</h1>
                </div>

                <div className="w3-container w3-theme-l5">
                    {this.props.location.state.newShift.salesReport.map(this.renderEachProduct)}
                </div>
                <div className="w3-container w3-theme-d5">
                    <button className="w3-btn w3-theme-d5 col-sm-4 col-sm-offset-4"
                            onClick={this.handleSubmitReport} type="submit"> {constantsStrings.startShift_string}
                    </button>
                </div>

           </div>
        )
    }
});

module.exports = StartShiftContainer;