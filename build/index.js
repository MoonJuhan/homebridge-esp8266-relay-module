'use strict';

import axios from 'axios';
const setup = homebridge => {
  homebridge.registerAccessory('homebridge-esp8266-relay-module', 'ESP8266RelayModule', ESP8266RelayModule);
};
class ESP8266RelayModule {
  constructor(log, config, api) {
    log('ESP8266RelayModule Start!');
    this.log = log;
    this.config = config;
    this.api = api;
    const {
      Service,
      Characteristic
    } = api.hap;
    this.Service = Service;
    this.Characteristic = Characteristic;
    const {
      name,
      ip
    } = config;
    this.name = name;
    this.ip = ip;
    this.log(`Name : ${this.name}, IP : ${this.ip}`);
    this.relayService = new Service(Service.Switch);
    this.relayService.getCharacteristic(Characteristic.On).onGet(this.handleOnGet.bind(this)).onSet(this.handleOnSet.bind(this));
  }
  handleOnGet() {
    this.log.debug('Triggered GET On');
    const currentValue = 1;
    return currentValue;
  }
  async handleOnSet(value) {
    this.log.debug('Triggered SET On:', value);
  }
}
module.exports = setup;