/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var managementServices = require('../communication/managementServices');
var constantsStrings = require('../utils/ConstantStrings');
var shiftInfo = require('../models/shift');
var flatten = require('flat');
var ReactBootstrap = require("react-bootstrap");
var moment = require('moment');
var paths = require('../utils/Paths');

var ShiftDetails = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
        }
    },

    componentDidMount() {
    },

    handleSubmitShift: function (e) {
        e.preventDefault();
        var startTime = this.refs.startTimeBox.value;
        var endTime = this.refs.endTimeBox.value;

        var context = this.context;
        var shifts;
        managementServices.AddAllShifts(startTime, endTime).then(function (n) {
            if(n){
                var val = n;
                if (val.success) {
                    shifts = val.info;
                    alert('All shifts as been created!');
                    context.router.push({
                        pathname: paths.manager_home_path
                    })
                } else {
                    alert('shifts creator as been failed. Please check your parameters');
                }
            }
            else{
                alert('shifts creator as been failed. Please check your parameters');
                console.log("error");
            }
        })
    },

    createAllShifts: function() {
        return (
            <div className="jumbotron col-xs-offset-3 col-xs-6 w3-theme-l4 text-center">
                <h1>יצירת קבוצת משמרות</h1>
                <form onSubmit={this.handleSubmitShift} className="form-horizontal text-right">

                    <div className="form-group ">
                        <label className="col-xs-2 col-xs-offset-2">{constantsStrings.startDate_string}</label>
                        <input type="datetime-local"
                               className="col-xs-4"
                               ref="startTimeBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="col-xs-2 col-xs-offset-2">{constantsStrings.endDate_string}</label>
                        <input type="datetime-local"
                               className="col-xs-4"
                               ref="endTimeBox"
                        />
                    </div>

                    <div className="form-group">
                        <button
                            className="w3-btn w3-theme-d5 col-xs-4 col-xs-offset-4"
                            type="submit">
                            {constantsStrings.add_string}
                        </button>
                    </div>
                </form>
            </div>
        )
    },

    render: function () {
        return this.createAllShifts();
    }
});

module.exports = ShiftDetails;
