/**
 * Created by lihiverchik on 14/01/2017.
 */

var React = require('react');
var constantsStrings = require('../utils/ConstantStrings');
var managementServices = require('../communication/managementServices');

var EndShiftContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function (){
        return{
            shift: null
        }
    },
    componentWillMount(){
        this.setState({ //TODO: chanhe this to getActiveShift from server
            shift: {
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
            }
        });
    },
    handleSubmitReport: function (e) {
        e.preventDefault();
        var shift = this.state.shift;
        for(var i=0; i<shift.salesReport.length; i++){
            shift.salesReport[i].stockEndShift = parseInt(this.refs[i].value);
        }
        console.log("after loop:");
        console.log(shift);
        var context = this.context;
        managementServices.editShift(shift).then(function (n) { //TODO: fix this!!!!!!
            if (n) {
                alert('edit succeed');
                context.router.push({
                    pathname: '/salesman/Home'
                })
            }
            else {
                alert('edit failed');
                console.log("error");
            }
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
                <form onSubmit={this.handleSubmitReport} className="form-horizontal">
                    {this.state.shift.salesReport.map(this.renderEachProduct)}
                    <button className="w3-btn w3-theme-d5 col-sm-4 col-sm-offset-5"
                            type="submit"> </button>
                </form>
            </div>

        )
    }
});

module.exports = EndShiftContainer;