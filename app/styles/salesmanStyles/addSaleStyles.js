/**
 * Created by lihiverchik on 20/01/2017.
 */

var addSaleStyles = {
    tableCell:{
        fontSize: '30px'

    },
    space: {
        height: '40px'
    },
    reportTopContainer:{
        display: 'flex',
        flexDirection: 'row',
        width:'100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '79px',
        marginBottom: '20px',
        height: '120px',
        background: '#54504b'
    },
    reportButtonsContainer:{
        flex: 'auto',
        alignSelf: 'auto',
        width:'30%',
        textAlign: 'center',
    },
    reportButtons:{
        width: '200px',
        height: '100px',

    },
    products_table_container: {
        backgroundColor: 'RGB(255,255,255)',
        marginBottom: '80px'
    },
    products_table_body: {
        fontSize: '40px',
        fontWeight: 'bold',
        height: '160px',
        paddingTop: '40px'
    },
    endShiftButton:{
        marginBottom: '20px',
        background: '#54504b'
    },
    inputMinHeight:{
        height: '60px',
    },
    productSaleRow: {
        marginBottom: '10px',
        height: '100px',
        background: 'rgba(162, 144, 104, 0.4)',
    },
    notificationStyle: {
        NotificationItem: {
            DefaultStyle: {
                fontSize: '50px',
                width: '500px',
                height: '200px',
                textAlign: 'center',
                margin: '100px -80px'
            },
            error: {
                height: '200px',
                width: '500px',
                fontSize: '50px'
            },
        }
    },
    reportButtonStyle: {
        background: 'rgb(183, 148, 70)',
        color: 'white',
        padding: '10px'
    },
    selectedStringContainerStyle: {
        color:'white',
        background: '#54504b',
        marginTop: '191px'

    },
    soldProductRow: {
        marginBottom: '10px',
        height: '100px',
        background: '#bbbbbb'
    }
};

module.exports = addSaleStyles;