/**
 * Created by lihiverchik on 14/01/2017.
 */

var React = require('react');
var constantsStrings = require('../utils/ConstantStrings');
var managementServices = require('../communication/managementServices');
var paths = require('../utils/Paths');
var startShiftStyles = require('../styles/startShiftStyles');

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
     /*  var shift = this.state.shift;
        for(var i=0; i<shift.salesReport.length; i++){
            shift.salesReport[i].stockEndShift = parseInt(this.refs[i].value);
        }
        console.log("after loop:");
        console.log(shift);
        var context = this.context;
        managementServices.editShift(shift).then(function (n) { TODO: fix this!!!!!!
            if (n) {
                alert('edit succeed');*/
                context.router.push({
                    pathname: paths.salesman_home_path
                })
        /*    }
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
                    {this.state.shift.salesReport.map(this.renderEachProduct)}
                </div>

                <div className="">
                    <button className="w3-theme-d5"
                            onClick={this.handleSubmitReport} type="submit"> {constantsStrings.endShift_string}
                    </button>
                </div>

            </div>
        )
    }
});

module.exports = EndShiftContainer;