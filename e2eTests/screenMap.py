import containers.managerHome
import containers.products
import containers.stores
import containers.users
import containers.Incentives
import containers.reports
import containers.shifts

screens = {
    "0": "http://localhost:3000/#/manager/home",
    "1": "http://localhost:3000/#/manager/changePassword",
    "2": "http://localhost:3000/#/manager/products",
    "3": "http://localhost:3000/#/manager/stores",
    "4": "http://localhost:3000/#/manager/users",
    "5": "http://localhost:3000/#/manager/shifts",
    "6": "http://localhost:3000/#/manager/reports",
    "7": "http://localhost:3000/#/manager/incentives",
    "8": "http://localhost:3000/#/manager/salesReport",
    "9": "http://localhost:3000/#/manager/monthlyHoursReport",
    "10": "http://localhost:3000/#/manager/monthlyAnalysisReport",
    "11": "http://localhost:3000/#/manager/humanResourcesReport",
}

navigate = [
    {
        "1": containers.managerHome.changePass,
        "2": containers.managerHome.productsTab,
        "3": containers.managerHome.storesTab,
        "4": containers.managerHome.usersTab,
        "5": containers.managerHome.ShiftsTab,
        "6": containers.managerHome.reportsTab,
        "7": containers.managerHome.incentivesTab
     },
    {
        "0": containers.managerHome.mainTab,
        "1": containers.managerHome.changePass,
        "2": containers.managerHome.productsTab,
        "3": containers.managerHome.storesTab,
        "4": containers.managerHome.usersTab,
        "5": containers.managerHome.ShiftsTab,
        "6": containers.managerHome.reportsTab,
        "7": containers.managerHome.incentivesTab
    },
    {
        "0": containers.managerHome.mainTab,
        "1": containers.managerHome.changePass,
        "2": containers.managerHome.productsTab,
        "3": containers.managerHome.storesTab,
        "4": containers.managerHome.usersTab,
        "5": containers.managerHome.ShiftsTab,
        "6": containers.managerHome.reportsTab,
        "7": containers.managerHome.incentivesTab
    },
    {
        "0": containers.managerHome.mainTab,
        "1": containers.managerHome.changePass,
        "2": containers.managerHome.productsTab,
        "3": containers.managerHome.storesTab,
        "4": containers.managerHome.usersTab,
        "5": containers.managerHome.ShiftsTab,
        "6": containers.managerHome.reportsTab,
        "7": containers.managerHome.incentivesTab
    },
    {
        "0": containers.managerHome.mainTab,
        "1": containers.managerHome.changePass,
        "2": containers.managerHome.productsTab,
        "3": containers.managerHome.storesTab,
        "4": containers.managerHome.usersTab,
        "5": containers.managerHome.ShiftsTab,
        "6": containers.managerHome.reportsTab,
        "7": containers.managerHome.incentivesTab
    } ,
    {
        "0": containers.managerHome.mainTab,
        "1": containers.managerHome.changePass,
        "2": containers.managerHome.productsTab,
        "3": containers.managerHome.storesTab,
        "4": containers.managerHome.usersTab,
        "5": containers.managerHome.ShiftsTab,
        "6": containers.managerHome.reportsTab,
        "7": containers.managerHome.incentivesTab
    },
    {
        "0": containers.managerHome.mainTab,
        "1": containers.managerHome.changePass,
        "2": containers.managerHome.productsTab,
        "3": containers.managerHome.storesTab,
        "4": containers.managerHome.usersTab,
        "5": containers.managerHome.ShiftsTab,
        "6": containers.managerHome.reportsTab,
        "7": containers.managerHome.incentivesTab,
        "8": containers.reports.shiftReport,
        "9": containers.reports.monthlyGant,
        "10": containers.reports.monthlySales,
        "11": containers.reports.salesmanReports
    },
    {
        "0": containers.managerHome.mainTab,
        "1": containers.managerHome.changePass,
        "2": containers.managerHome.productsTab,
        "3": containers.managerHome.storesTab,
        "4": containers.managerHome.usersTab,
        "5": containers.managerHome.ShiftsTab,
        "6": containers.managerHome.reportsTab,
        "7": containers.managerHome.incentivesTab
    },
    {
        "0": containers.managerHome.mainTab,
        "1": containers.managerHome.changePass,
        "2": containers.managerHome.productsTab,
        "3": containers.managerHome.storesTab,
        "4": containers.managerHome.usersTab,
        "5": containers.managerHome.ShiftsTab,
        "6": containers.managerHome.reportsTab,
        "7": containers.managerHome.incentivesTab
    },
    {
        "0": containers.managerHome.mainTab,
        "1": containers.managerHome.changePass,
        "2": containers.managerHome.productsTab,
        "3": containers.managerHome.storesTab,
        "4": containers.managerHome.usersTab,
        "5": containers.managerHome.ShiftsTab,
        "6": containers.managerHome.reportsTab,
        "7": containers.managerHome.incentivesTab
    },
    {
        "0": containers.managerHome.mainTab,
        "1": containers.managerHome.changePass,
        "2": containers.managerHome.productsTab,
        "3": containers.managerHome.storesTab,
        "4": containers.managerHome.usersTab,
        "5": containers.managerHome.ShiftsTab,
        "6": containers.managerHome.reportsTab,
        "7": containers.managerHome.incentivesTab
    },
    {
        "0": containers.managerHome.mainTab,
        "1": containers.managerHome.changePass,
        "2": containers.managerHome.productsTab,
        "3": containers.managerHome.storesTab,
        "4": containers.managerHome.usersTab,
        "5": containers.managerHome.ShiftsTab,
        "6": containers.managerHome.reportsTab,
        "7": containers.managerHome.incentivesTab
    }
]

#     "10": "",
#   "11": "",
#    "12": "",
#    "13": "",
#    "14": "",
#    "15": "",
#    "16": "",
#    "17": "",
#    "18": "",
#    "19": "",
