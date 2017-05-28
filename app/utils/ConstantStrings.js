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
    static reports_string = ' דוחות';
    static saleReport_string = 'טעימות';
    static edit_string = 'עריכה';
    static delete_string = 'מחיקה';
    static search_string = 'חיפוש';
    static productSearch_string = 'חיפוש מוצר';
    static add_string = 'הוספה';
    static logout_string = 'התנתק';
    static NoDataText_string = 'לא נמצאו תוצאות מתאימות';
    static save_string = 'שמירה';
    static storeStatus_string = 'מצב המלאי בחנות:';
    static retrievePassButton_string = 'שחזר סיסמא';
    static changePassButton_string = 'עדכן סיסמא';
    static changePass_string = 'שינוי סיסמא';
    static changePassTitle_string = 'עדכון סיסמא';
    static retrievePassTitle_string = 'שחזור סיסמא';
    static retrievePass_string = 'שחזור סיסמא';
    static liveSalesReport_string = 'צפייה במשמרות בזמן אמת';
    static selectedProducts_string = 'המוצרים שנבחרו';
    static createPublishShifts_string = 'יצירה ופרסום משמרות';
    static managePublishedShifts_string = 'ניהול משמרות מפורסמות';
    static constraints_string = 'אילוצי דיילים';
    static available_string = 'זמין למשמרת';
    static notAvailable_string = 'לא זמין למשמרת';
    static submitConstraints_string = 'הגש/י אילוצים';

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
    static incentiveRateSalesman_string ='תגמול';

    static incentivePickProducts_string = 'בחר מוצרים';
    static incentiveProducts_string = 'מוצרים בתמריץ';
    static incentiveIncentives_string = 'תמריצים';
    static incentiveMissingProducts_string = 'לא ניתן לייצר תמריץ ללא מוצרים';

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
    static fullName_string = 'שם הדייל';
    static gender_string = 'מין';
    static startDate_string = 'תאריך התחלה';
    static endDate_string = 'תאריך סיום';
    static date_string = 'תאריך';
    static role_string = 'תפקיד';
    static salary_string = 'שכר שעתי';
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
    static getReport_string = 'שלח לאימייל';
    static shiftType_string = 'סוג משמרת';
    static eventType_string = 'סוג אירוע';
    static addMultipleShifts_string = 'הוספת מספר משמרות';
    static setSalesmanAndPublish_string = 'שיבוץ דיילים ופרסום';
    static publishShifts_string = 'פרסום המשמרות';
    static SHIFT_STATUS = {
        CREATED: 'CREATED',
        PUBLISHED: 'PUBLISHED',
        STARTED: 'STARTED',
        FINISHED: 'FINISHED'
    };

    //reports
    static defaultSalesmanDropDown_string = 'בחר/י דייל';
    static defaultShiftDropDown_string = 'בחר/י משמרת';
    static noShifts_string = 'לא קיימות משמרות להצגה';
    static editReport_string = 'ערוך דוח';
    static reportsNumberOfProductsSold_string = 'נמכרו';
    static reportsNumberOfProductsOpened_string = 'נפתחו';
    static reportsSalesReportTitle_string = 'דוח טעימות';
    static reportsSalesReportSubTitle_string = 'דוח טעימות עבור התאריך';
    static reportsMonthlyAnalysisReportTitle_string = 'סיכום ערוץ דיול חודשי';
    static reportsHumanResourcesReportTitle_string = 'דוח כוח אדם';
    static reportsMonthlyUserHoursReportTitle_string = 'גאנט דיול ערוץ חודשי';
    static reportsShowReport_string = 'הצג דוח';
    static totalSalesmanHours_string = 'סך שעות דיול';


    static reportSale_string = 'דווח מכירה';
    static reportOpen_string = 'דווח פתיחה';

    static product_category =
    {
        'ספיריט': 'ספיריט',
        'יין' : 'יין'
    };

    static product_subCategory =
    {
        'בלנד ויסקי סקוטי': 'בלנד ויסקי סקוטי',
        'סינגל מאלט סקוטי': 'סינגל מאלט סקוטי',
        'וויסקי אמריקאי/קנדי': 'וויסקי אמריקאי/קנדי',
        'ויסקי אירי': 'ויסקי אירי',
        'ג\'ין': 'ג\'ין',
        'וודקה': 'וודקה',
        'רום': 'רום',
        'טקילה': 'טקילה',
        'קוניאק': 'קוניאק',
        'אפרטיף-אניס': 'אפרטיף-אניס',
        'אפרטיף-ביטר': 'אפרטיף-ביטר',
        'אפרטיף-וורמוט': 'אפרטיף-וורמוט',
        'מונין': 'מונין',
        'פיבר טרי' : 'פיבר טרי',
        'אדמה' : 'אדמה',
        'פנינים' : 'פנינים',
        'הר' : 'הר',
        'פרמיום' : 'פרמיום',
        'סינגל וויניארד' : 'סינגל וויניארד',
        'L.E/מלכיה' : 'L.E/מלכיה'
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
        'מרכז': 'מרכז',
        'שפלה': 'שפלה',
        'ירושלים': 'ירושלים',
        'השרון': 'השרון'
    };

    static store_channel =
     {
         'תדמית יום': 'תדמית יום',
         'מסורתי - חם': 'מסורתי - חם',
         'מסורתי - מאורגן': 'מסורתי - מאורגן'
     };

    //salesman
    static startShift_string = 'התחל משמרת';
    static endShift_string = 'סיים משמרת';
    static continueShift_string = 'המשך משמרת';
    static salesmanNoShifts_string = 'אין לך משמרות היום';
    static genderForDropdown = ["נקבה", "זכר"];

    static channelForDropdown = ["מסורתי - חם", "מסורתי - מאורגן", "תדמית יום"];

    static areaForDropdown = ["צפון", "דרום", "מרכז", "שפלה", "ירושלים", "השרון"];

    static categoryForDropdown = ["ספיריט", "יין"];

    static subCategoryForDropdown = ["בלנד ויסקי סקוטי", "סינגל מאלט סקוטי", "וויסקי אמריקאי/קנדי", "ויסקי אירי",
        "ג'ין", "וודקה","רום", "טקילה", "קוניאק", "אפרטיף-אניס", "אפרטיף-ביטר","אפרטיף-וורמוט", "מונין", "פיבר טרי",
        "אדמה", "הר", "פנינים", "פרמיום","סינגל וויניארד" , "L.E/מלכיה"];

    static subCategoryForDropdown_wine =  ["אדמה", "הר", "פנינים", "פרמיום","סינגל וויניארד" , "L.E/מלכיה"];

    static subCategoryForDropdown_spirit =["בלנד ויסקי סקוטי", "סינגל מאלט סקוטי", "וויסקי אמריקאי/קנדי", "ויסקי אירי",
    "ג'ין", "וודקה","רום", "טקילה", "קוניאק", "אפרטיף-אניס", "אפרטיף-ביטר","אפרטיף-וורמוט", "מונין", "פיבר טרי"];

    static userRoleForDropDown =
        [
            ['salesman', 'דייל'],
            ['agent', 'סוכן שטח'],
            ['manager', 'מנהל']
        ];

    static shiftType_taste = 'טעימה';
    static shiftType_learning = 'הדרכה';
    static shiftType_event = 'אירוע';
    static shiftType = [ConstantStrings.shiftType_taste, ConstantStrings.shiftType_event,  ConstantStrings.shiftType_learning] ;


    //  static userRoleForDropDown = ["דייל", "סוכן שטח"];

    static dropDownChooseString = 'בחר...';

    static email_string = 'אימייל';

    static select_product_for_sale = 'בחר מוצר אשר נמכר/נפתח:'
    static press_quantity_for_edit = 'לחץ על כמות על מנת לערוך אותה:';
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
    static shiftWillNotPublish_string = 'משמרת זו לא תפורסם';
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
    static cancel_string = 'ביטול';
    static mustChooseSalesman_string = 'עליך לבחור דייל לכל משמרת';

     //salesman menu
    static addSale_string = 'דיווח מכירה';
    static editSales_string = 'סיכום מכירות';
    static addComment_string = 'הוספת הערה';
    static addCommentContent_string = 'הוספת הערה:';
    static comments_string = 'הערות';
    static commentsFromShift_string = 'הערות מהמשמרת';
    static encouragements_string = 'תמריצים';
    static updateExpenses_string = 'עדכן נסיעות';
    static noCommentsFromShift_string = 'לא קיימות הערות במשמרת זו';
    //shift expenses
    static km_string = 'ק"מ';
    static parking_string = 'חנייה';
    static store_string = 'חנות';

    //encouragements
    static ils_string = 'ש"ח';
    static encouragementsStatus_string ='מצב תגמול נוכחי';

    //salesman base
    static currentShift_string = 'משמרת נוכחית';
    static profile_string ='פרופיל';
    static shiftSchedule_string ='לוח משמרות';
    static expenses_string ='הוצאות';
    static assignShifts_string ='לחץ כאן לשיבוץ משמרות';

    static numberToMonth = {
        '1': 'ינואר',
        '2': 'פברואר',
        '3': 'מרץ',
        '4': 'אפריל',
        '5': 'מאי',
        '6': 'יוני',
        '7': 'יולי',
        '8': 'אוגוסט',
        '9': 'ספטמבר',
        '10': 'אוקטובר',
        '11': 'נובמבר',
        '12': 'דצמבר',
    };
    static dictionary = {
        'organized': 'תדמית - יום',
        'traditionalHot': 'ערוץ מסורתי',
        'traditionalOrganized': 'ערוץ מאורגן',
        'totalHours': 'שעות דיול',
        'salesmanCost': 'ללא תמריצי תקציב דיול',
        'shiftsCount': 'כמות דיולים בחנויות',
        'uniqueCount': 'מס נק דיול',
        'saleBottlesCount': 'כמות בק שנמכרו',
        'openedCount': 'כמות בק שנפתחו',
        'saleAverage': 'ממוצע מכירות בק לשעה'
    };
}

module.exports = ConstantStrings;