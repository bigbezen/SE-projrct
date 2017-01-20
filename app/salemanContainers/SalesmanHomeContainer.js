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
                <h1>loading...</h1>
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