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
import pytest
from time import sleep
import random
import screenMap

class randomActions(unittest.TestCase):
    MAX_RUNNING_TIME = 600
    NUM_OF_ACTIONS = 150

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

    # random tests
    @pytest.mark.timeout(MAX_RUNNING_TIME)
    def test_randomActions(self):
        driver = self.driver
        screen = 1
        for x in range(0, self.NUM_OF_ACTIONS):
            screens = screenMap.navigate[screen]
            nextScreenKey, btn = random.choice(list(screens.items()))
            print(btn)
            driver.find_element_by_xpath(btn).click()
            sleep(2)
            if ((btn != containers.managerHome.reportsTab) & (btn != containers.managerHome.ShiftsTab)):
                self.assertEqual(driver.current_url, screenMap.screens.get(nextScreenKey))
            screen = int(nextScreenKey)

        driver.find_element_by_xpath(containers.managerHome.logoutTab).click()
        sleep(2)
        self.assertEqual(driver.current_url, helper.url)
        print("-------- done! --------")

    def tearDown(self):
        self.driver.close()
