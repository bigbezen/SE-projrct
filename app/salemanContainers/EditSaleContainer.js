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
var NotificationSystem      = require('react-notification-system');
var CloseIcon               = require('react-icons/lib/fa/close');


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
        var notificationSystem = this.refs.notificationSystem;
        salesmanServices.getCurrentShift().then(function (currShift) {
            self.setState({
                shift: currShift,
                sales: currShift.sales
            });
        }).catch(function (errMess) {
            notificationSystem.clearNotifications();
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 0,
                position: 'tc'
            });
        })
    },

    onUpdateAmount: function (row, amount) {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        salesmanServices.editSale(this.state.shift._id, row.productId, row.timeOfSale, amount)
            .then(function (n) {
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantStrings.editSuccessMessage_string,
                    level: 'info',
                    autoDismiss: 1,
                    position: 'tc'
                });
                self.updateShift();
        }).catch(function (errMess) {
            notificationSystem.clearNotifications();
            notificationSystem.addNotification({
                message: errMess,
                level: 'error',
                autoDismiss: 0,
                position: 'tc'
            });
        });
        this.updateShift();
    },

    deleteButton: function(cell, row, enumObject, rowIndex) {
        let self = this;
        return (
            <a href="javascript:void(0)" onClick={() => self.onUpdateAmount(row, "0")}>
                <CloseIcon/>
            </a>
        )
    },

    renderSales: function () {
        return(
            <div>
                <div className="w3-card-8 col-xs-offset-1 col-xs-10" style={styles.products_table_container}>
                    <h1><b>{constantStrings.press_quantity_for_edit}</b></h1>
                    <BootstrapTable data={this.state.sales} hover bordered={false} cellEdit={ cellEditProp }>
                        <TableHeaderColumn
                            dataAlign = 'right'
                            tdStyle={{width: '10%'}}
                            editable={false}
                            dataFormat = {this.deleteButton}/>
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
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },

    renderLoading:function () {
        return(
            <div>
                <h1>loading...</h1>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },

    render: function () {
        if(this.state.shift != null)
        {
            return this.renderSales();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = EditSaleContainer;