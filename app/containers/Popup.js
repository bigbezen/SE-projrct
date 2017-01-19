/**
 * Created by lihiverchik on 19/01/2017.
 */
var React = require('react');
var ReactModalDialog = require('react-modal-dialog');
var ModalContainer = require(ReactModalDialog.ModalContainer);
var ModalDialog = require(ReactModalDialog.ModalDialog);


var Popup = React.createClass({
    getInitialState() {
        return{
            isShowingModal: true
        }
    },
    handleClick: function ()
    {
        this.setState({isShowingModal: false})
    },
    handleClose: function()
    {
        this.setState({isShowingModal: false})
    },
    render() {
        return <div onClick={this.handleClick}>
            {
                this.state.isShowingModal &&
                <ModalContainer onClose={this.handleClose}>
                    <ModalDialog onClose={this.handleClose}>
                        <h1>Dialog Content</h1>
                        <p>Are you sure you want to delete?</p>
                        <button onclick={this.handleClose}> yes </button>
                    </ModalDialog>
                </ModalContainer>
            }
        </div>;
    }
});

model.exports = Popup;