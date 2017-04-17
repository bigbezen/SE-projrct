/**
 * Created by lihiverchik on 31/03/2017.
 */
/**
 * Created by lihiverchik on 19/01/2017.
 */

var React                   = require('react');
var constantStrings         = require('../utils/ConstantStrings');
var salesmanServices        = require('../communication/salesmanServices');
var styles                  = require('../styles/salesmanStyles/editSaleStyles');
var moment                  = require('moment');
var userServices            = require('../communication/userServices');


const cellEditProp = {
    mode: 'click',
};

function dateFormatter(cell, row) {
    return moment(cell).format('H:mm');
}

class QuantityEditor extends React.Component {
    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
    }
    focus() {
        this.refs.inputRef.focus();
    }
    componentDidMount(){
        this.refs.inputRef.value = this.props.row.quantity;
    }
    updateData() {
        console.log("priceEditor calling update");
        this.props.onUpdate(this.props.row, this.refs.inputRef.value);
    }
    render() {
        return (
            <span>
        <input
            ref='inputRef'
            style={ styles.quantityEditorStyle }
            onBlur={this.updateData}
            type='text'/>
      </span>
        );
    }
}

const createPriceEditor = (onUpdate, props) => (<QuantityEditor onUpdate={ onUpdate } {...props}/>);

var EditSaleContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    setSessionId: function() {
        var sessId = localStorage.getItem('sessionId');
        if (!sessId) {
            sessId = 0;
        }
        localStorage.setItem('sessionId', sessId);
        userServices.setSessionId(sessId);
    },
    setUserType: function() {
        var userType = localStorage.getItem('userType');
        if (!userType) {
            userType = 0;
        }
        localStorage.setItem('userType', userType);
        userServices.setUserType(userType);
    },
    getInitialState(){
        this.setSessionId();
        this.setUserType();
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
        }).catch(function (errMess) {
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 5,
                position: 'tc'
            });
        })
    },
    onUpdateAmount: function (row, amount) {
        var self = this;
        salesmanServices.editSale(this.state.shift._id, row.productId, row.timeOfSale, amount).then(function (n) {
            if (n) {
                var val = n;
                if (val.success) {
                    self.updateShift()
                }
                else {
                }
            }
            else {
            }
        }).catch(function (errMess) {
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 5,
                position: 'tc'
            });
        })
        console.log("onUpdateAmount");
        console.log(amount);
        console.log(row);
        this.updateShift();
    },
    render: function () {
        return(
            <div>
                <div className="w3-card-8 col-xs-offset-1 col-xs-10" style={styles.products_table_container}>
                    <h1><b>{constantStrings.press_quantity_for_edit}</b></h1>
                    <BootstrapTable data={this.state.sales} hover bordered={false} cellEdit={ cellEditProp }>
                        <TableHeaderColumn
                            dataField = 'name'
                            dataAlign = 'right'
                            tdStyle = {styles.productName_column}
                            editable={ false }
                            isKey = {true}>
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            dataField = 'quantity'
                            tdStyle = {styles.products_table_body}
                            customEditor={ { getElement: createPriceEditor, customEditorParameters: { onUpdate: this.onUpdateAmount } }}
                            dataAlign = 'right'>
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            dataField = 'timeOfSale'
                            dataFormat={ dateFormatter }
                            dataAlign = 'right'
                            editable={ false }
                            tdStyle = {styles.time_column}>
                        </TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        )
    }
});

module.exports = EditSaleContainer;