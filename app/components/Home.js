/**
 * Created by lihiverchik on 29/11/2016.
 */
var React = require('react');
var PropTypes = React.PropTypes;
var constantsStrings = require('../utils/ConstantStrings');

var Home = function (props) {
        console.log("Home component- render");
        return (
            <div className="jumbotron col-sm-12 text-center" >

                <div className="form-group col-sm-4 col-sm-offset-4">
                    <div>
                        <button className="w3-btn w3-theme-d5 w3-margin-top w3-round-xxlarge" onClick={props.onSelectUsers}>
                            {constantsStrings.manageUsers_string}
                        </button>
                    </div>
                    <div>
                        <button className="w3-btn w3-theme-d5 w3-margin-top w3-round-xxlarge" onClick={props.onSelectProducts}>
                            {constantsStrings.manageProducts_string}
                        </button>
                    </div>
                    <div>
                        <button className="w3-btn w3-theme-d5 w3-margin-top w3-round-xxlarge" onClick={props.onSelectStores}>
                            {constantsStrings.manageStores_string}
                        </button>
                    </div>
                </div>

            </div>
        )
}

Home.propTypes = {
    onSelectUsers:PropTypes.func.isRequired,
    onSelectProducts: PropTypes.func.isRequired,
    onSelectStores: PropTypes.func.isRequired
}
module.exports = Home;
