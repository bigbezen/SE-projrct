/**
 * Created by lihiverchik on 31/03/2017.
 */
/**
 * Created by lihiverchik on 19/01/2017.
 */

var React                   = require('react');
var constantStrings         = require('../utils/ConstantStrings');
var salesmanServices        = require('../communication/salesmanServices');

var EditSaleContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState(){
        return{
            shift: null,
            sales: []
        }
    },
    componentDidMount() {
        this.updateShift();
    },
    updateShift(){
        var self = this;
        salesmanServices.getCurrentShift().then(function (n) {
            if (n) {
                var val = n;
                if (val.success) {
                    var currShift = val.info;
                    self.setState(
                        {shift: currShift,
                            sales: currShift.sales
                        });
                }
                else {
                }
            }
            else {
            }
        })
    },

    render: function () {
        return(
            <div>
                <div className="w3-margin-top">
                    <BootstrapTable data={this.state.sales} hover bordered={false}>
                        <TableHeaderColumn
                            dataField = 'name'
                            dataAlign = 'right'
                            isKey = {true}>
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            dataField = 'quantity'
                            dataAlign = 'right'>
                        </TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        )
    }
});

module.exports = EditSaleContainer;