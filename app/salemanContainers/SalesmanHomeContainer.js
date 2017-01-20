/**
 * Created by lihiverchik on 11/01/2017.
 */

/*
var React = require('react');
var constantsStrings = require('../utils/ConstantStrings');
var paths = require('../utils/Paths');
var salesmanService = require('../communication/salesmanServices');
var moment = require('moment');

var SalesmanHomeContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState(){
        return({
            shift: null
        })
    },
    componentWillMount() {
        this.updateShifts();
    },
    updateShifts() {
        var self = this;
        salesmanService.getCurrentShift().then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    self.setState({
                        shift: result.info
                    });
                    self.updateFields();
                }
            } else {
                  alert("Error while retrieving shift from the server");
            }
        })
    },
    handleStartShift: function () {
        this.context.router.push({
            pathname: paths.salesman_startShift_path,
            state: {newShift: this.state.shift}
        })
    },
    updateFields:function() {
        this.refs.nameBox.value = this.state.shift.store.name;
        this.refs.startBox.value = moment(this.state.shift.startTime).format('YYYY-MM-DD hh:mm').toString();
        this.refs.endBox.value = moment(this.state.shift.endTime).format('YYYY-MM-DD hh:mm').toString();
    },
    renderShift: function () {
        return (
        <div className="jumbotron col-sm-offset-3 col-sm-6 text-center">
            <h1>משמרת קרובה</h1>
            <form onSubmit={this.handleStartShift} className="form-horizontal">
                <div className="form-group ">
                    <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.storeName_string}</label>
                    <input type="text"
                           disabled="true"
                           className="col-sm-4"
                           ref="nameBox"
                    />
                </div>

                <div className="form-group ">
                    <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.startDate_string}</label>
                    <input type="text"
                           className="col-sm-4"
                           disabled="true"
                           ref="startBox"
                    />
                </div>

                <div className="form-group ">
                    <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.endDate_string}</label>
                    <input type="text"
                           className="col-sm-4"
                           disabled="true"
                           ref="endBox"
                    />
                </div>

                <div className="form-group">
                    <button
                        className="w3-btn w3-theme-d5 col-sm-4 col-sm-offset-5"
                        type="submit">
                        {constantsStrings.startShift_string}
                    </button>
                </div>
            </form>
        </div>
        )
    },
    renderLoading:function () {
        return(
            <div>
                <h1>אין לך משמרות היום, סע לים! (:</h1>
            </div>
        )
    },
    render: function () {
        if(this.state.shift != null)
        {
            return this.renderShift();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = SalesmanHomeContainer;*/


/**
 * Created by lihiverchik on 11/01/2017.
 */

var React = require('react');
var constantsStrings = require('../utils/ConstantStrings');
var paths = require('../utils/Paths');
var salesmanService = require('../communication/salesmanServices');

var shift = {
    storeId: '1',
    startTime: {},
    endTime: {},
    status: 'started',
    type: 'sale',
    salesmanId: '111',
    constraints: [],
    salesReport: [
        {
            productId: 1,
            productName: 'אבסולוט',
            stockStartShift: 0,
            stockEndShift: 0,
            sold: 0,
            opened: 0
        },
        {
            productId: 2,
            productName: 'סמירנוף',
            stockStartShift: 0,
            stockEndShift: 0,
            sold: 0,
            opened: 0
        },
        {
            productId: 3,
            productName: 'בלאק',
            stockStartShift: 0,
            stockEndShift: 0,
            sold: 0,
            opened: 0
        },
        {
            productId: 4,
            productName: 'בלו',
            stockStartShift: 0,
            stockEndShift: 0,
            sold: 0,
            opened: 0
        }
    ],
    sales: []
};

var SalesmanHomeContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState(){
        return({
            shift: null
        })
    },
    componentWillMount() {
        this.updateShifts();
    },
    updateShifts() {
        var self = this;
        salesmanService.getCurrentShift().then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    self.setState({
                        shift: result.info
                    });
                }
            } else {
                alert("Error while retrieving shift from the server");
            }
        })
    },
    handleStartShift: function () {
        this.context.router.push({
            pathname: paths.salesman_startShift_path,
            state: {newShift: this.state.shift}
        })
    },
    renderShift: function () {
        //TODO: present to user details about the shift or some other message if he has no shift
        return (
            <div className='main-container'>
                <button onClick={this.handleStartShift}>{constantsStrings.startShift_string}</button>
            </div>

        )
    },
    renderLoading:function () {
        return(
            <div>
                <h1>אין לך משמרות היום, סע לים!!! (:</h1>
            </div>
        )
    },
    render: function () {
        if(this.state.shift != null)
        {
            return this.renderShift();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = SalesmanHomeContainer;