/**
 * Created by lihiverchik on 11/01/2017.
 */

var React = require('react');

var Product = React.createClass({
    getInitialState: function(){
        return {editing: false}
    },
    editProduct: function (){
        this.setState({editing: true});
    },
    saveProduct: function(){
       this.setState({editing: false});
    },
    renderNormal: function(){
        return (<div></div>)
    },
    render: function () {
        return (
            <div className='main-container'>
                <button className="w3-btn w3-theme-d5 w3-round-xxlarge col-sm-2 col-sm-offset-9" onClick={this.handleLogoutUser}>
                    {constantsStrings.logout_string}
                </button>
                {this.props.children}

            </div>

        )
    }
});

module.exports = Product;