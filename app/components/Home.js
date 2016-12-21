/**
 * Created by lihiverchik on 29/11/2016.
 */
var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link
var PropTypes = React.PropTypes;


var Home = React.createClass({
    render: function () {
        return (
            <div className="jumbotron col-sm-12 text-center" >
                <h1>Hello From Home page</h1>

                <div className="form-group col-sm-4 col-sm-offset-4">
                    <Link to='/LoggedIn/Users'>
                        <button type='button' className="btn btn-block btn-success" >
                            Users
                        </button>
                    </Link>
                    <Link to='/LoggedIn/Products'>
                        <button type='button' className="btn btn-block btn-success" >
                            Products
                        </button>
                    </Link>
                    <Link to='/LoggedIn/Stores'>
                        <button type='button' className="btn btn-block btn-success" >
                            Products
                        </button>
                    </Link>
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
