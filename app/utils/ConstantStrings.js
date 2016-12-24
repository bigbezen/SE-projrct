/**
 * Created by lihiverchik on 21/12/2016.
 */
var React = require('react');

class ConstantStrings extends React.Component {
    //general
    static login_string = 'התחבר';
    static welcome_string = 'ברוכים הבאים';
    static username_string = 'שם משתמש';
    static password_string = 'סיסמא';
    static manageUsers_string = 'ניהול משתמשים';
    static manageStores_string = 'ניהול חנויות';
    static manageProducts_string = 'ניהול מוצרים';
    static edit_string = 'עריכה';
    static delete_string = 'מחיקה';
    static search_string = 'חיפוש';

    //products
    static id_string = 'מס׳ סידורי';
    static productName_string = 'שם מוצר';
    static retailPrice_string = 'מחיר עלות';
    static salePrice_string = 'מחיר מכירות';
    static category_string = 'קטגוריה';
    static subCategory_string = 'תת קטגוריה';
    static minRequiredAmount_string = 'כמות מינימלית למכירה';
    static notifyManager_string = 'התראת מנהל';

    //filter strings
    static enterProductName_string = 'הכנס שם מוצר..'
    static enterPrice_string = 'הכנס מחיר..'
    static selectCategory_string = 'בחר קטגוריה..'
    static selectSubCategory_string = 'בחר תת קטגוריה..'

    //users
    static userID_string ='ת״ז';
    static firstName_string = 'שם פרטי';
    static lastName_string = 'שם משפחה';
    static gender_string = 'מין';
    static startDate_string = 'תאריך התחלה';
    static role_string = 'תפקיד';

    //filter strings
    static enterID_string = 'הכנס ת״ז..'
    static enterFirstName_string = 'הכנס שם פרטי..'
    static enterLastName_string = 'בחר שם משפחה..'
    static selectGender_string = 'בחר מין..'
    static selectRole_string = 'בחר תפקיד..'
    static selectStartDate_string = 'בחר תאריך התחלה..'

    //stores
    static storeName_string ='שם חנות';
    static managerName_string = 'מנהל';
    static phone_string = 'טלפון';
    static address_string = 'כתובת';
    static city_string = 'עיר';
    static area_string = 'איזור';
    static channel_string = 'ערוץ';

    //filter strings
    static enterStoreName_string = 'הכנס שם חנות..'
    static enterManagerName_string = 'הכנס שם מנהל..'
    static enterPhone_string = 'הכנס טלפון..'
    static enterAddress_string = 'הכנס כתובת..'
    static enterCity_string = 'הכנס עיר..'
    static selectArea_string = 'בחר איזור..'
    static selectChannel_string = 'בחר ערוץ..'


}

module.exports = ConstantStrings;