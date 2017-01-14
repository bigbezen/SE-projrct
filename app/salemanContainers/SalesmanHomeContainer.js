/**
 * Created by lihiverchik on 11/01/2017.
 */

var React = require('react');
var constantsStrings = require('../utils/ConstantStrings');

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
        this.setState({
            shift: shift //TODO: change shift to be from server - getCurrentShift
        });
    },
    handleStartShift: function () {
        this.context.router.push({
            pathname: '/salesman/StartShift',
            state: {newShift: this.state.shift}
        })
    },
    render: function () {
        //TODO: present to user details about the shift or some other message if he has no shift
        return (
            <div className='main-container'>
                <button onClick={this.handleStartShift}>{constantsStrings.startShift_string}</button>
            </div>

        )
    }
});

module.exports = SalesmanHomeContainer;