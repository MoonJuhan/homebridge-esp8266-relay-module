'use strict'

const axios = require('axios')
const dayjs = require('dayjs')

const setup = (homebridge) => {
  homebridge.registerAccessory('homebridge-esp8266-relay-module', 'ESP8266RelayModule', ESP8266RelayModule)
}

class ESP8266RelayModule {
  constructor(log, config, api) {
    log('ESP8266RelayModule start.')

    const { Service, Characteristic } = api.hap

    const { name, ip, cacheTime } = config
    this.log = log
    this.ip = ip
    this.cacheTime = cacheTime || 20

    log(`Name : ${name}, IP : ${ip}`)

    this.informationService = new Service.AccessoryInformation()
      .setCharacteristic(Characteristic.Manufacturer, 'Custom Manufacturer')
      .setCharacteristic(Characteristic.Model, 'Custom Model')

    this.switchService = new Service.Switch(name)
    this.switchService
      .getCharacteristic(Characteristic.On)
      .onGet(this.getOnHandler.bind(this))
      .onSet(this.setOnHandler.bind(this))

    this.getRelayStatusTime = null
    this.relayOn = false

    this.setOnHandler(false)
  }

  getServices() {
    return [this.informationService, this.switchService]
  }

  async getOnHandler() {
    this.log.info('Get relay module status.')

    if (dayjs().diff(this.getRelayStatusTime, 'second', true) < cacheTime) {
      return this.relayOn
    }

    try {
      this.log.info('Call get relay status api.')

      this.getRelayStatusTime = new Date()
      await axios({
        url: '/relay',
        baseURL: `http://${this.ip}`,
        method: 'get',
      })
    } catch (error) {
      this.log.error('Axios Error')
      this.relayOn = false
    } finally {
      return this.relayOn
    }
  }

  async setOnHandler(value) {
    this.log.info('Set relay module:', value)

    try {
      await axios({
        url: '/relay',
        baseURL: `http://${this.ip}`,
        method: 'put',
        data: { relayOn: value },
      })

      this.relayOn = value
      this.log.info('Set relay module success.')
    } catch (error) {
      this.log.error('Set relay module failed.')
    }
  }
}

module.exports = setup
