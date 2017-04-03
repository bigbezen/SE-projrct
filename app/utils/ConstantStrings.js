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
    static users_string = 'משתמשים';
    static stores_string = 'חנויות';
    static products_string = 'מוצרים';
    static shifts_string = ' משמרות';
    static edit_string = 'עריכה';
    static delete_string = 'מחיקה';
    static search_string = 'חיפוש';
    static add_string = 'הוספה';
    static logout_string = 'התנתק';
    static NoDataText_string = 'לא נמצאו תוצאות מתאימות';
    static save_string = 'שמירה';
    static storeStatus_string = 'מצב המלאי בחנות:';
    static retrievePassButton_string = 'שלח סיסמא חדשה';
    static changePassButton_string = 'עדכן סיסמא';
    static changePass_string = 'שינוי סיסמא';
    static changePassTitle_string = 'עדכון סיסמא';
    static retrievePassTitle_string = 'שחזור סיסמא';
    static retrievePass_string = 'שחזור סיסמא';

    //home page
    static numberOfUUsers = 'סך המשתמשים בחברה';
    static numberOfStores = 'סך החנויות בחברה';
    static numberOfProducts = 'סך המוצרים בחברה';


    //products
    static id_string = 'מס׳ סידורי';
    static addProduct_string = 'הוספת מוצר חדש';
    static editProduct_string = 'עריכת מוצר קיים';
    static productName_string = 'שם מוצר';
    static retailPrice_string = 'מחיר קמעונאי';
    static salePrice_string = 'מחיר מכירות';
    static category_string = 'קטגוריה';
    static subCategory_string = 'תת קטגוריה';
    static minRequiredAmount_string = 'כמות מינימלית למכירה';
    static notifyManager_string = 'התראת מנהל';

    //incentives
    static addIncentive_string = 'הוספת תמריץ חדש';
    static incentiveName_string = 'שם התמריץ';
    static incentiveNumOfProducts_string = 'כמות הבקבוקים למכירה בתמריץ';
    static incentiveRate_string ='גודל התמריץ';
    static incentivePickProducts_string = 'בחר מוצרים';
    static incentiveProducts_string = 'מוצרים בתמריץ';

    //filter strings
    static enterProductName_string = 'הכנס שם מוצר..';
    static enterPrice_string = 'הכנס מחיר..';
    static selectCategory_string = 'בחר קטגוריה..';
    static selectSubCategory_string = 'בחר תת קטגוריה..';
    static enterQuantity_string = 'הכנס כמות';
    static enterUsername_string = 'הכנס שם משתמש';

    //users
    static userID_string ='ת״ז';
    static addUser_string = 'הוספת משתמש חדש';
    static editUser_string = 'עריכת משתמש קיים';
    static firstName_string = 'שם פרטי';
    static lastName_string = 'שם משפחה';
    static gender_string = 'מין';
    static startDate_string = 'תאריך התחלה';
    static date_string = 'תאריך';
    static role_string = 'תפקיד';
    static endDate_string = 'תאריך סיום';
    static birthDate_string = 'תאריך לידה';
    static street_string = 'מספר בית';
    static zip_string = 'מיקוד';
    static startTime_string = 'שעת התחלה';
    static endTime_string = 'שעת סיום';

    //filter strings
    static enterID_string = 'הכנס ת״ז..';
    static enterFirstName_string = 'הכנס שם פרטי..';
    static enterLastName_string = 'בחר שם משפחה..';
    static selectGender_string = 'בחר מין..';
    static selectRole_string = 'בחר תפקיד..';
    static selectStartDate_string = 'בחר תאריך התחלה..';

    //stores
    static storeName_string ='שם חנות';
    static addStore_string = 'הוספת חנות חדשה';
    static editStore_string = 'עריכת חנות קיימת';
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
    static enterSalesmanName_string ='הכנס שם דייל..';
    static enterType_string = 'הכנס סוג...';
    static enterStatus_string = 'הכנס מצב...';
    //shifts
    static status_string = 'מצב';
    static addShift_string = 'הוספת משמרת חדשה';
    static editShift_string = 'עריכת משמרת קיימת';
    static type_string = 'סוג';
    static salesman_string = 'דייל';
    static getReport_string = 'הורד דוח';
    static shiftType_string = 'סוג משמרת';

    static reportSale_string = 'דווח מכירה';
    static reportOpen_string = 'דווח פתיחה';

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
    static endShift_string = 'סיים משמרת';
    static continueShift_string = 'המשך משמרת';
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

    static select_product_for_sale = 'בחר מוצר אשר נמכר/נפתח:'

    //popups
    static errorMessage_string = 'אירעה שגיאה בשרת, אנא נסה שוב מאוחר יותר';
    static errorTitle_string = 'שגיאה';
    static addSuccessMessage_string = 'ההוספה התבצעה בהצלחה!';
    static editSuccessMessage_string = 'העריכה התבצעה בהצלחה!';
    static addFailMessage_string = 'שגיאה קרתה בעת הוספה';
    static editFailMessage_string = 'שגיאה קרתה בעת עריכה';
    static deleteFailMessage_string = 'שגיאה קרתה בעת מחיקה';
    static deleteMessage_string = 'המחיקה התבצעה בהצלחה!';
    static loginFailMessage_string = 'שם משתמש או סיסמא אינם נכונים';
    static startShiftFailedMessage_string = 'אירעה שגיאה בעת הכניסה למשמרת. אנא נסה שנית';
    static startShiftMessage_string = 'משמרת מהנה! (:';
    static endShiftFailedMessage_string = 'אירעה שגיאה בעת ביצוע סיום משמרת. אנא נסה שנית';
    static saleProductFailedMessage_string = 'אירעה שגיאה בעת ביצוע הדיווח. אנא נסה שנית';
    static badActionMessage_string = 'הפעולה נכשלה. נא לוודא כי כל השדות חוקיים';
    static goodActionMessage_string = 'הפעולה התבצעה בהצלחה!';
    static areYouSure_string = 'האם אתה בטוח כי ברצונך למחוק?';
    static cannotDeleteSelf_string = "לא ניתן למחוק את משתמש זה";
    static mailSentSuccess_string = 'הדוח נשלח לאימייל בהצלחה!';
    static close_string = "סגירה";
    static yes_string = 'כן';
    static retrievePassFailMessage_string = 'שם המשתמש וכתובת האימייל אינם תואמים';
    static changePassNotEqualFailedMessage_string = 'אי התאמה בין הסיסמאות החדשות שהוקלדו';
    static changePassNotValidMessage_string = 'סיסמא לא חוקית. אנא נסה שנית';
    static retrievePassSuccessMessage_string = 'סיסמא חדשה נשלחה אליכם בזה הרגע לדואר האלקטרוני';
    static changePassServerFailedMessage_string = 'סיסמא אינה נכונה. אנא נסה שנית';
    static changePassSuccessMessage_string = 'סיסמא השתנתה בהצלחה!';

     //salesman menu
    static addSale_string = 'מכירות';
    static editSales_string = 'עריכה';
    static addComment_string = 'הוספת הערה';
    static addCommentContent_string = 'הוספת הערה:';
    static comments_string = 'הערות';
    static encouragements_string = 'תמריצים';

    //shift comments
}

module.exports = ConstantStrings;