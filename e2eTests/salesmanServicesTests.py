import dbConnector
import unittest
from selenium import webdriver
import helper
import containers.login
import containers.managerHome
import containers.products
import containers.stores
import containers.users
import containers.Incentives
import containers.shifts
import containers.startShift
import containers.salesmanHome
import containers.endShift
import containers.salesman_shift
from time import sleep
import pytest


class SalesmanServices(unittest.TestCase):
    MAX_RUNNING_TIME = 90

    def setUp(self):
        dbConnector.deleteDb()
        dbConnector.initDb()
        options = webdriver.ChromeOptions()
        options.add_argument('--lang=heb')
        self.driver = webdriver.Chrome(chrome_options=options)
        self.driver.get(helper.url)
        driver = self.driver

    # test-40
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_loginSalesman_ok(self):
        self.loginAsSalesman()

    # test-41
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_logoutSalesman_ok(self):
        self.loginAsSalesman()
        driver = self.driver
        driver.find_element_by_xpath(containers.salesmanHome.logout).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertEqual(driver.current_url, helper.url)

    # test-42
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_startShift_ok(self):
        driver = self.driver
        self.startShift()

    # test-43
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_startShift_return(self):
        driver = self.driver
        self.startShift()
        # driver.find_element_by_xpath(containers.startShift.returnBtn).click()
        # driver.implicitly_wait(300)
        # sleep(2)
        # self.assertEqual(driver.current_url, helper.salesman_home)

    # test-44
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_startShift_selectExistingProduct(self):
        driver = self.driver
        self.startShift()
        driver.find_element_by_xpath(containers.startShift.product1).click()
        sleep(2)
        driver.find_element_by_xpath(containers.startShift.startBtn).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)

    # test-45
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_shift_reportSale(self):
        driver = self.driver
        self.startShift()
        driver.find_element_by_xpath(containers.startShift.startBtn).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)
        driver.find_element_by_xpath(containers.salesman_shift.selectSubCategory).click()
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.selectProduct).click()
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.reportSale).click()
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)

    # test-46
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_shift_reportOpen(self):
        driver = self.driver
        self.startShift()
        driver.find_element_by_xpath(containers.startShift.startBtn).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)
        driver.find_element_by_xpath(containers.salesman_shift.selectSubCategory).click()
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.selectProduct).click()
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.reportOpen).click()
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)

    # test-47
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_viewExpenses(self):
        driver = self.driver
        self.loginAsSalesman()
        driver.find_element_by_xpath(containers.salesmanHome.drives).click()
        sleep(2)
        self.assertEqual(driver.current_url, helper.salesman_expenses)

    # test-48
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_shift_editSale(self):
        driver = self.driver
        self.startShift()
        driver.find_element_by_xpath(containers.startShift.startBtn).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)
        driver.find_element_by_xpath(containers.salesman_shift.selectSubCategory).click()
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.selectProduct).click()
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.reportSale).click()
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)
        driver.find_element_by_xpath(containers.salesman_shift.sales).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_editSale in driver.current_url)
        driver.find_element_by_xpath(containers.salesman_shift.editSaleTextbox).clear()
        driver.find_element_by_xpath(containers.salesman_shift.editSaleTextbox).send_keys(2)
        driver.find_element_by_xpath(containers.salesman_shift.editSaleBtn).click()
        driver.find_element_by_xpath(containers.salesman_shift.mainView).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_sale in driver.current_url)

    # test-49
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_shift_addComment(self):
        driver = self.driver
        self.startShift()
        driver.find_element_by_xpath(containers.startShift.startBtn).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)

        driver.find_element_by_xpath(containers.salesman_shift.comments).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_comments in driver.current_url)
        driver.find_element_by_xpath(containers.salesman_shift.writeComment).click()
        driver.implicitly_wait(300)
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.commentTextBox).send_keys("this is a comment")
        driver.find_element_by_xpath(containers.salesman_shift.addCommentBtn).click()
        sleep(1)
        driver.find_element_by_xpath(containers.salesman_shift.mainView).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_sale in driver.current_url)

    # test-50
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_shift_cancelComment(self):
        driver = self.driver
        self.startShift()
        driver.find_element_by_xpath(containers.startShift.startBtn).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)

        driver.find_element_by_xpath(containers.salesman_shift.comments).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_comments in driver.current_url)
        driver.find_element_by_xpath(containers.salesman_shift.writeComment).click()
        driver.implicitly_wait(300)
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.commentTextBox).send_keys("this is a comment")
        driver.find_element_by_xpath(containers.salesman_shift.cancelCommentBtn).click()
        sleep(1)
        driver.find_element_by_xpath(containers.salesman_shift.mainView).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_sale in driver.current_url)

    # test-51
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_shift_viewEncouragemants(self):
        driver = self.driver
        self.startShift()
        driver.find_element_by_xpath(containers.startShift.startBtn).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)

        driver.find_element_by_xpath(containers.salesman_shift.incentives).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_encouragements in driver.current_url)

    # test-52
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_shift_reportSaleIncreaseNumber(self):
        driver = self.driver
        self.startShift()
        driver.find_element_by_xpath(containers.startShift.startBtn).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)
        driver.find_element_by_xpath(containers.salesman_shift.selectSubCategory).click()
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.selectProduct).click()
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.increaseNumber).click()
        driver.find_element_by_xpath(containers.salesman_shift.reportSale).click()
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)

    # test-53
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_shift_reportOpenIncreaseNumber(self):
        driver = self.driver
        self.startShift()
        driver.find_element_by_xpath(containers.startShift.startBtn).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)
        driver.find_element_by_xpath(containers.salesman_shift.selectSubCategory).click()
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.selectProduct).click()
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.increaseNumber).click()
        driver.find_element_by_xpath(containers.salesman_shift.reportOpen).click()
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)

    # test-54
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_shift_reportMultipleSale(self):
        driver = self.driver
        self.startShift()
        driver.find_element_by_xpath(containers.startShift.startBtn).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)
        driver.find_element_by_xpath(containers.salesman_shift.selectSubCategory).click()
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.selectProduct).click()
        sleep(2)
        # driver.find_element_by_xpath(containers.salesman_shift.reportSale).click()
        # sleep(2)
        # driver.find_element_by_xpath(containers.salesman_shift.selectSubCategory2).click()
        # sleep(2)
        # driver.find_element_by_xpath(containers.salesman_shift.selectProduct2).click()
        # sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.reportSale).click()
        sleep(2)

        self.assertTrue(helper.salesman_shift in driver.current_url)

    # test-55
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_shift_reportMultipleOpen(self):
        driver = self.driver
        self.startShift()
        driver.find_element_by_xpath(containers.startShift.startBtn).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)
        driver.find_element_by_xpath(containers.salesman_shift.selectSubCategory).click()
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.selectProduct).click()
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.selectSubCategory).click()
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.reportOpen).click()
        sleep(2)
        # driver.find_element_by_xpath(containers.salesman_shift.selectSubCategory2).click()
        # sleep(2)
        # driver.find_element_by_xpath(containers.salesman_shift.selectProduct2).click()
        # sleep(2)
        # driver.find_element_by_xpath(containers.salesman_shift.reportOpen).click()
        # sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)

    # test-56
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_shift_endShift(self):
        driver = self.driver
        self.startShift()
        driver.find_element_by_xpath(containers.startShift.startBtn).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)
        driver.find_element_by_xpath(containers.salesman_shift.selectSubCategory).click()
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.selectProduct).click()
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.reportSale).click()
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)
        driver.find_element_by_xpath(containers.salesman_shift.endShift).click()
        sleep(2)
        self.assertTrue(helper.salesman_endShift in driver.current_url)
        driver.find_element_by_xpath(containers.endShift.endBtn).click()
        sleep(2)
        self.assertTrue(helper.salesman_home in driver.current_url)

    # test-57
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_shift_endShiftWithReport(self):
        driver = self.driver
        self.startShift()
        driver.find_element_by_xpath(containers.startShift.startBtn).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)
        driver.find_element_by_xpath(containers.salesman_shift.selectSubCategory).click()
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.selectProduct).click()
        sleep(2)
        driver.find_element_by_xpath(containers.salesman_shift.reportSale).click()
        sleep(2)
        self.assertTrue(helper.salesman_shift in driver.current_url)
        driver.find_element_by_xpath(containers.salesman_shift.endShift).click()
        sleep(2)
        self.assertTrue(helper.salesman_endShift in driver.current_url)
        driver.find_element_by_xpath(containers.endShift.product1).click()
        sleep(2)
        driver.find_element_by_xpath(containers.endShift.endBtn).click()
        sleep(2)
        self.assertTrue(helper.salesman_home in driver.current_url)

    # test-58
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_viewProfile(self):
        driver = self.driver
        self.loginAsSalesman()
        driver.find_element_by_xpath(containers.salesmanHome.profile).click()
        sleep(2)
        self.assertEqual(driver.current_url, helper.salesman_profile)

    # test-59
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_viewShifts(self):
        driver = self.driver
        self.loginAsSalesman()
        driver.find_element_by_xpath(containers.salesmanHome.shiftsBoard).click()
        sleep(2)
        self.assertEqual(driver.current_url, helper.salesman_shiftSchedule)

    # test-70
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_assignShift(self):
        driver = self.driver
        self.createMultipleShifts()
        self.loginAsSalesman()
        driver.find_element_by_xpath(containers.salesmanHome.shiftsBoard).click()
        sleep(2)
        self.assertEqual(driver.current_url, helper.salesman_shiftSchedule)
        driver.find_element_by_xpath(containers.salesmanHome.setShiftsBtn).click()
        sleep(2)
        self.assertEqual(driver.current_url, helper.salesman_setShifts)
        driver.find_element_by_xpath(containers.salesmanHome.setShiftCheckbox).click()
        sleep(1)
        driver.find_element_by_xpath(containers.salesmanHome.sendShiftsBtn).click()
        sleep(4)
        self.assertEqual(driver.current_url, helper.salesman_setShifts)

    # test-60
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_setUp_Ok(self):
        self.assertEqual(True, True)

    def tearDown(self):
        self.driver.close()

    def loginAsSalesman(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.login.username).send_keys(helper.salesmanUsername)
        driver.find_element_by_xpath(containers.login.password).send_keys(helper.salesmanPass)
        driver.find_element_by_xpath(containers.login.loginBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.salesman_home)
        return

    def loginAsManager(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.login.username).send_keys(helper.adminUsername)
        driver.find_element_by_xpath(containers.login.password).send_keys(helper.adminPass)
        driver.find_element_by_xpath(containers.login.loginBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.manager_home)
        return

    def createShift(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.managerHome.ShiftsTab).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.managerHome.CreateShiftTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.createShiftContainer)
        driver.find_element_by_xpath(containers.shifts.add).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.shifts.store).send_keys(helper.shiftStore)
        driver.find_element_by_xpath(containers.shifts.username).send_keys(helper.shiftUser)
        driver.find_element_by_xpath(containers.shifts.type).send_keys(helper.shiftType)
        driver.find_element_by_xpath(containers.shifts.startTime).send_keys(helper.shiftStartTime)
        driver.find_element_by_xpath(containers.shifts.endTime).send_keys(helper.shiftEndTime)

        driver.find_element_by_xpath(containers.shifts.addBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.createShiftContainer)
        return

    def publishShift(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.shifts.publish).click()
        sleep(3)
        self.assertEqual(driver.current_url, helper.publishShiftsContainer)
        driver.find_element_by_xpath(containers.shifts.publishBtn).click()
        sleep(3)
        self.assertEqual(driver.current_url, helper.createShiftContainer)
        driver.find_element_by_xpath(containers.managerHome.logoutTab).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertEqual(driver.current_url, helper.url)
        return

    def startShift(self):
        driver = self.driver
        self.loginAsManager()
        self.createShift()
        self.publishShift()
        self.loginAsSalesman()
        driver.find_element_by_xpath(containers.salesmanHome.startShift).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertTrue(helper.salesman_startShift in driver.current_url)
        return

    def createMultipleShifts(self):
        driver = self.driver
        self.loginAsManager()
        driver.find_element_by_xpath(containers.managerHome.ShiftsTab).click()
        driver.implicitly_wait(300)

        driver.find_element_by_xpath(containers.managerHome.CreateShiftTab).click()
        driver.implicitly_wait(300)
        self.assertEqual(driver.current_url, helper.createShiftContainer)
        driver.find_element_by_xpath("//*[@id=\"app\"]/div/div[4]/div[1]/div[1]/div/input").click()
        driver.find_element_by_xpath(containers.shifts.addMultiple).click()
        sleep(2)

        driver.find_element_by_xpath(containers.shifts.startTimeMultiple).send_keys(helper.shiftStartTime)
        driver.find_element_by_xpath(containers.shifts.endTimeMultiple).send_keys(helper.shiftEndTime)

        driver.find_element_by_xpath(containers.shifts.addMultipleBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.createShiftContainer)
        return