/**
 * Created by lihiverchik on 29/11/2016.
 */
var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link
var PropTypes = React.PropTypes;
var constantsStrings = require('../components/ConstantStrings');

var Home = React.createClass({
    render: function () {
        return (
            <div className="jumbotron col-sm-12 text-center" >

                <div className="form-group col-sm-4 col-sm-offset-4">
                    <div>
                        <Link to='/LoggedIn/Users'>
                            <button type='button' className="btn btn-block btn-success" >
                                {constantsStrings.manageUsers_string}
                            </button>
                        </Link>
                    </div>
                    <div>
                        <Link to='/LoggedIn/Products'>
                            <button type='button' className="btn btn-block btn-success" >
                                {constantsStrings.manageProducts_string}
                            </button>
                        </Link>
                    </div>
                    <div>
                        <Link to='/LoggedIn/Stores'>
                            <button type='button' className="btn btn-block btn-success" >
                                {constantsStrings.manageStores_string}
                            </button>
                        </Link>
                    </div>
                </div>

            </div>

        )
    }
});

Home.propTypes = {
    onSelectUsers:PropTypes.func.isRequired,
    onSelectProducts: PropTypes.func.isRequired,
    onSelectStores: PropTypes.func.isRequired
}
module.exports = Home;
