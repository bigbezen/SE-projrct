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
import containers.reports
import containers.shifts
import pytest
from time import sleep


class ReportsServices(unittest.TestCase):
    MAX_RUNNING_TIME = 90

    def setUp(self):
        dbConnector.deleteDb()
        dbConnector.initDb()
        options = webdriver.ChromeOptions()
        options.add_argument('--lang=heb')
        self.driver = webdriver.Chrome(chrome_options=options)
        self.driver.get(helper.url)
        driver = self.driver
        driver.find_element_by_xpath(containers.login.username).send_keys(helper.adminUsername)
        driver.find_element_by_xpath(containers.login.password).send_keys(helper.adminPass)
        driver.find_element_by_xpath(containers.login.loginBtn).click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.manager_home)
        driver.find_element_by_xpath(containers.managerHome.reportsTab).click()
        sleep(1)
        self.assertEqual(driver.current_url, helper.reportsContainer)

    # test-61
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_viewShiftReport_Ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.reports.shiftReport).click()
        sleep(2)
        driver.find_element_by_xpath(containers.reports.salesman).send_keys("אבירם אדירי")
        sleep(1)
        driver.find_element_by_xpath(containers.reports.shift).send_keys("27-4-2017")
        sleep(1)
        self.assertEqual(driver.current_url, helper.salesReportContainer)

    # test-62
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_sendShiftReport_Ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.reports.shiftReport).click()
        sleep(2)
        driver.find_element_by_xpath(containers.reports.salesman).send_keys("אבירם אדירי")
        sleep(1)
        driver.find_element_by_xpath(containers.reports.shift).send_keys("27-4-2017")
        sleep(1)

        driver.find_element_by_xpath(containers.reports.sendMail).click()
        sleep(2)
        self.assertEqual(driver.current_url, helper.salesReportContainer)

    # test-63
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_editShiftReport_Ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.reports.shiftReport).click()
        sleep(2)
        driver.find_element_by_xpath(containers.reports.salesman).send_keys("אבירם אדירי")
        sleep(1)
        driver.find_element_by_xpath(containers.reports.shift).send_keys("27-4-2017")
        sleep(1)
        driver.find_element_by_xpath(containers.reports.editOpen).send_keys("1")
        sleep(1)
        driver.find_element_by_xpath(containers.reports.editShiftBtn).click()
        sleep(1)
        self.assertEqual(driver.current_url, helper.salesReportContainer)

    # test-64
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_viewMonthlyReport_Ok(self):
        driver = self.driver
        driver.find_element_by_xpath(containers.reports.monthlySales).click()
        sleep(2)
        driver.find_element_by_xpath(containers.reports.showReportBtn).click()
        sleep(1)
        self.assertEqual(driver.current_url, helper.monthlyReportContainer)

    # test-65
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_setup_ok(self):
        self.assertTrue(True)

    def tearDown(self):
        self.driver.close()
