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
    static manageShifts_string = 'ניהול משמרות';
    static edit_string = 'עריכה';
    static delete_string = 'מחיקה';
    static search_string = 'חיפוש';
    static add_string = 'הוספה';
    static logout_string = 'התנתק';
    static NoDataText_string = 'לא נמצאו תוצאות מתאימות';
    static save_string = 'שמירה';

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
    static enterProductName_string = 'הכנס שם מוצר..';
    static enterPrice_string = 'הכנס מחיר..';
    static selectCategory_string = 'בחר קטגוריה..';
    static selectSubCategory_string = 'בחר תת קטגוריה..';
    static enterQuantity_string = 'הכנס כמות';


    //users
    static userID_string ='ת״ז';
    static firstName_string = 'שם פרטי';
    static lastName_string = 'שם משפחה';
    static gender_string = 'מין';
    static startDate_string = 'תאריך התחלה';
    static role_string = 'תפקיד';
    static endDate_string = 'תאריך סיום';
    static birthDate_string = 'תאריך לידה';
    static street_string = 'מספר בית';
    static zip_string = 'מיקוד';

    //filter strings
    static enterID_string = 'הכנס ת״ז..';
    static enterFirstName_string = 'הכנס שם פרטי..';
    static enterLastName_string = 'בחר שם משפחה..';
    static selectGender_string = 'בחר מין..';
    static selectRole_string = 'בחר תפקיד..';
    static selectStartDate_string = 'בחר תאריך התחלה..';

    //stores
    static storeName_string ='שם חנות';
    static managerName_string = 'מנהל';
    static phone_string = 'טלפון';
    static address_string = 'כתובת';
    static city_string = 'עיר';
    static area_string = 'איזור';
    static channel_string = 'ערוץ';

    //filter strings
    static enterStoreName_string = 'הכנס שם חנות..';
    static enterManagerName_string = 'הכנס שם מנהל..';
    static enterPhone_string = 'הכנס טלפון..';
    static enterAddress_string = 'הכנס כתובת..';
    static enterCity_string = 'הכנס עיר..';
    static selectArea_string = 'בחר איזור..';
    static selectChannel_string = 'בחר ערוץ..';

    //shifts
    static status_string = 'מצב';
    static type_string = 'סוג';
    static salesman_string = 'דייל';

    static product_category =
    {
        'ספיריט': 'ספיריט',
        'יין' : 'יין'
    };

    static product_subCategory =
    {
        'בלנד סקוטי': 'בלנד סקוטי',
        'סינגל מאלט סקוטי': 'סינגל מאלט סקוטי',
        'וויסקי אמריקאי/קנדי': 'וויסקי אמריקאי/קנדי',
        'ארבעת הלבנים': 'ארבעת הלבנים',
        'אפרטיף/דגסטיף': 'אפרטיף/דגסטיף',
        'תבור הר/פנינים' : 'תבור הר/פנינים',
        'תבור אדמה' : 'תבור אדמה',
        'תבור אדמה 2' : 'תבור אדמה 2',
        'L.E' : 'L.E',
    };

    static user_gender =
    {
        'זכר': 'זכר',
        'נקבה': 'נקבה'
    };

    static user_role =
    {
        'salesman': 'דייל',
        'agent': 'סוכן שטח',
        'manager': 'מנהל'
     };

    static store_area =
    {
        'צפון': 'צפון',
        'דרום': 'דרום',
        'מרכז': 'מרכז'
    };

    static store_channel =
     {
         'מסחרי': 'מסחרי',
         'קלאסי': 'קלאסי'
     };

    //salesman
    static startShift_string = 'התחל משמרת';

    static genderForDropdown = ["נקבה", "זכר"];

    static channelForDropdown = ["מסחרי", "קלאסי"];

    static areaForDropdown = ["צפון", "דרום", "מרכז"];

    static categoryForDropdown = ["ספיריט", "יין"];

    static subCategoryForDropdown = ["בלנד סקוטי", "סינגל מאלט סקוטי", "וויסקי אמריקאי/קנדי", "ארבעת הלבנים", "אפרטיף/דגסטיף", "תבור הר/פנינים", "תבור אדמה", "תבור אדמה 2", "L.E"];

    static userRoleForDropDown =
        [
            ['salesman', 'דייל'],
            ['agent', 'סוכן שטח'],
            ['manager', 'מנהל']
        ];


  //  static userRoleForDropDown = ["דייל", "סוכן שטח"];

    static dropDownChooseString = 'בחר...';

    static email_string = 'אימייל';
}

module.exports = ConstantStrings;