import unittest
import dbConnector
from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait

import helper
import containers.login
import containers.retrievePass
import containers.managerHome
import containers.changePass
from selenium.webdriver.support import expected_conditions as EC
from time import sleep


class UserService(unittest.TestCase):
    usernameField = None
    passwordField = None
    loginBtn = None
    retrievePass = None

    def setUp(self):
        dbConnector.deleteDb()
        dbConnector.initDb()
        self.driver = webdriver.Chrome()
        self.driver.get(helper.url)
        driver = self.driver
        self.usernameField = driver.find_element_by_xpath(containers.login.username)
        self.passwordField = driver.find_element_by_xpath(containers.login.password)
        self.loginBtn = driver.find_element_by_xpath(containers.login.loginBtn)
        self.retrievePass = driver.find_element_by_xpath(containers.login.retrieveBtn)
        self.usernameField.clear()
        self.passwordField.clear()

    # test-1
    def test_login_Ok(self):
        driver = self.driver
        self.usernameField.send_keys(helper.adminUsername)
        self.passwordField.send_keys(helper.adminPass)
        self.loginBtn.click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.manager_home)

    # test-2
    def test_login_wrongUsername(self):
        driver = self.driver
        self.usernameField.send_keys(helper.wrongUsername)
        self.passwordField.send_keys(helper.adminPass)
        self.loginBtn.click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.url)

    # test-3
    def test_login_wrongPass(self):
        driver = self.driver
        self.usernameField.send_keys(helper.adminUsername)
        self.passwordField.send_keys(helper.wrongPass)
        self.loginBtn.click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.url)

    # test-4
    def test_logout_Ok(self):
        driver = self.driver
        self.usernameField.send_keys(helper.adminUsername)
        self.passwordField.send_keys(helper.adminPass)
        self.loginBtn.click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.manager_home)
        driver.find_element_by_xpath(containers.managerHome.logoutTab).click()
        driver.implicitly_wait(300)
        sleep(2)
        self.assertEqual(driver.current_url, helper.url)

    # test-5
    def test_retrievePass_ok(self):
        driver = self.driver
        self.retrievePass.click()
        driver.implicitly_wait(300)
        sleep(3)
        usernameField = driver.find_element_by_xpath(containers.retrievePass.username)
        emailField = driver.find_element_by_xpath(containers.retrievePass.email)
        retrieveBtn = driver.find_element_by_xpath(containers.retrievePass.retrieveBtn)
        usernameField.send_keys(helper.adminUsername)
        emailField.send_keys(helper.adminEmail)
        retrieveBtn.click()
        driver.implicitly_wait(300)
        # driver.find_element_by_xpath("//*[@id=\"app\"]/div/div[3]/div/div/span").click()
        # wait = WebDriverWait(driver, 1000)
        sleep(3)
        # wait.until(EC.element_to_be_clickable(self.retrievePass))
        self.assertEqual(driver.current_url, helper.url)

    # test-6
    def test_retrievePass_wrongUsername(self):
        driver = self.driver
        self.retrievePass.click()
        driver.implicitly_wait(300)
        sleep(3)
        usernameField = driver.find_element_by_xpath(containers.retrievePass.username)
        emailField = driver.find_element_by_xpath(containers.retrievePass.email)
        retrieveBtn = driver.find_element_by_xpath(containers.retrievePass.retrieveBtn)
        usernameField.send_keys(helper.wrongUsername)
        emailField.send_keys(helper.adminEmail)
        retrieveBtn.click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.retrieve_page)

    # test-7
    def test_retrievePass_wrongEmail(self):
        driver = self.driver
        self.retrievePass.click()
        driver.implicitly_wait(300)
        sleep(3)
        usernameField = driver.find_element_by_xpath(containers.retrievePass.username)
        emailField = driver.find_element_by_xpath(containers.retrievePass.email)
        retrieveBtn = driver.find_element_by_xpath(containers.retrievePass.retrieveBtn)
        usernameField.send_keys(helper.adminUsername)
        emailField.send_keys(helper.wrongEmail)
        retrieveBtn.click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.retrieve_page)

    # test-8
    def test_changePass_ok(self):
        driver = self.driver
        self.usernameField.send_keys(helper.adminUsername)
        self.passwordField.send_keys(helper.adminPass)
        self.loginBtn.click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.manager_home)
        changePassBtn = driver.find_element_by_xpath(containers.managerHome.changePass)
        changePassBtn.click()

        currPass = driver.find_element_by_xpath(containers.changePass.currPass)
        newPass1 = driver.find_element_by_xpath(containers.changePass.newPass1)
        newPass2 = driver.find_element_by_xpath(containers.changePass.newPass2)
        changeBtn = driver.find_element_by_xpath(containers.changePass.changeBtn)

        currPass.send_keys(helper.adminPass)
        newPass1.send_keys(helper.adminPass)
        newPass2.send_keys(helper.adminPass)
        changeBtn.click()

        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.manager_home)

    # test-9
    def test_changePass_wrongPass(self):
        driver = self.driver
        self.usernameField.send_keys(helper.adminUsername)
        self.passwordField.send_keys(helper.adminPass)
        self.loginBtn.click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.manager_home)
        changePassBtn = driver.find_element_by_xpath(containers.managerHome.changePass)
        changePassBtn.click()

        currPass = driver.find_element_by_xpath(containers.changePass.currPass)
        newPass1 = driver.find_element_by_xpath(containers.changePass.newPass1)
        newPass2 = driver.find_element_by_xpath(containers.changePass.newPass2)
        changeBtn = driver.find_element_by_xpath(containers.changePass.changeBtn)

        currPass.send_keys(helper.wrongPass)
        newPass1.send_keys(helper.adminPass)
        newPass2.send_keys(helper.adminPass)
        changeBtn.click()

        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.change_page)

    # test-10
    def test_changePass_differentPass(self):
        driver = self.driver
        self.usernameField.send_keys(helper.adminUsername)
        self.passwordField.send_keys(helper.adminPass)
        self.loginBtn.click()
        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.manager_home)
        changePassBtn = driver.find_element_by_xpath(containers.managerHome.changePass)
        changePassBtn.click()

        currPass = driver.find_element_by_xpath(containers.changePass.currPass)
        newPass1 = driver.find_element_by_xpath(containers.changePass.newPass1)
        newPass2 = driver.find_element_by_xpath(containers.changePass.newPass2)
        changeBtn = driver.find_element_by_xpath(containers.changePass.changeBtn)

        currPass.send_keys(helper.adminPass)
        newPass1.send_keys(helper.adminPass)
        newPass2.send_keys(helper.wrongPass)
        changeBtn.click()

        driver.implicitly_wait(300)
        sleep(3)
        self.assertEqual(driver.current_url, helper.change_page)

    def tearDown(self):
        self.driver.close()
