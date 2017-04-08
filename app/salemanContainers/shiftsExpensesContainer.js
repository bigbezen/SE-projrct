/**
 * Created by lihiverchik on 08/04/2017.
 */


var React = require('react');
var salesmanServices = require('../communication/salesmanServices');
var constantStrings = require('../utils/ConstantStrings');
var paths = require('../utils/Paths');
var styles = require('../styles/salesmanStyles/shiftCommentsStyles');
var userServices = require('../communication/userServices');
var managementServices = require('../communication/managementServices');
var EditIcon = require('react-icons/lib/md/edit');

var ShiftsExpensesContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState(){
        this.setSessionId();
        return{
            shifts: null,
            viewMode: true
        }
    },
    setSessionId: function() {
        var sessId = localStorage.getItem('sessionId');
        if (!sessId) {
            sessId = 0;
        }
        localStorage.setItem('sessionId', sessId);
        userServices.setSessionId(sessId);
    },
    componentDidMount() {
        this.updateShifts();
    },
    updateShifts(){
        var self = this;
        managementServices.getSalesmanFinishedShifts("58e76aea46a8a1f930f1ae9a").then(function (n) {
            if (n) {
                var val = n;
                if (val.success) {
                    var shifts = val.info;
                    self.setState({shifts: shifts});
                    console.log('yayyyyy');
                }
                else {
                }
            }
            else {
            }
        })
    },
    changeStateToAddMode: function(){
        this.setState({viewMode: false})
    },
    changeStateToViewMode: function(){
        this.setState({viewMode: true})
    },
    handleEditShift(){
    },
    onClickEditButton: function(shift, index){
        var newSold = this.refs["numOfKM" + index].value;
        var newOpened = this.refs["parkingCost" + index].value;
        var shiftId = shift.shiftId;
        var self = this;
        var notificationSystem = this.refs.notificationSystem;

        /*managementServices.updateSalesReport(shiftId, productId, newSold, newOpened)
            .then(function(result) {
                console.log('updated sales report');

            })
            .catch(function(err) {
                console.log('error');
                notificationSystem.addNotification({
                    message: constantsStrings.editFailMessage_string,
                    level: 'error',
                    autoDismiss: 1,
                    position: 'tc',
                });
            })*/
    },
    renderEachShift: function(shift, i){
        var shiftDate = new Date(shift.startTime) ;
        var ShiftDateFormated = shiftDate.toLocaleDateString();
        return (
            <div className="row col-sm-10 col-sm-offset-1 w3-theme-l4 w3-round-large w3-card-4 w3-text-black"
                 style={{marginTop: '10px', height: '45px'}}>
                <p className="col-sm-2"><b>{shift.store.name}</b></p>
                <p className="col-sm-3">{ShiftDateFormated}</p>
                <input className="col-sm-2" type="number" min="0" style={{marginTop: '3px'}} ref={"numOfKM" + i} defaultValue={shift.numOfKM} />
                <p className="col-sm-1"></p>
                <input className="col-sm-2" type="number" min="0" style={{marginTop: '3px'}} ref={"parkingCost" + i} defaultValue={shift.parkingCost} />
                <p className="col-sm-1"></p>
                <p className="w3-xlarge" onClick={() => this.onClickEditButton(shift, i)}><EditIcon/></p>
            </div>
        )
    },
    renderViewMode: function(){
        return (
            <div className="w3-container col-sm-12">
                <div className="row col-sm-10 col-sm-offset-1 w3-theme-l4 w3-round-large w3-card-4 w3-text-black">
                    <p className="col-sm-2" style={styles.listHeader}><b>{constantStrings.storeName_string}</b></p>
                    <p className="col-sm-3" style={styles.listHeader}><b>{constantStrings.date_string}</b></p>
                    <p className="col-sm-3" style={styles.listHeader}><b>{constantStrings.num_of_km_string}</b></p>
                    <p className="col-sm-3" style={styles.listHeader}><b>{constantStrings.parking_price_string}</b></p>
                    <p className="col-sm-1"></p>
                </div>
                {this.state.shifts.map(this.renderEachShift)}
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
        if(this.state.shifts != null && this.state.viewMode)
        {
            return this.renderViewMode();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = ShiftsExpensesContainer;