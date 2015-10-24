/* mbed Microcontroller Library
 * Copyright (c) 2006-2014 ARM Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "mbed.h"
#include "ble/BLE.h"
#include "ble/Gap.h"
#include "ble/services/BatteryService.h"

DigitalOut led1(LED1, 1);

// UUIDs
uint16_t rowbotServiceUUID          = 0xA000;

uint16_t accelerationCharUUID       = 0xA001;
uint16_t angvelocityCharUUID        = 0xA002;
uint16_t timeCharUUID               = 0xA004;

const static char     DEVICE_NAME[] = "rowbot";
static const uint16_t uuid16_list[] = {rowbotServiceUUID}; // DEBUG


// Custom characteristics 
static float accValue[4] = {0, 0, 0, 0};
//ReadOnlyArrayGattCharacteristic<float, sizeof(accValue)> accChar(accelerationCharUUID, accValue, GattCharacteristic::BLE_GATT_CHAR_PROPERTIES_NOTIFY);
GattCharacteristic accChar(accelerationCharUUID, reinterpret_cast<uint8_t*>(accValue), sizeof(accValue), sizeof(accValue) * 32, GattCharacteristic::BLE_GATT_CHAR_PROPERTIES_READ | GattCharacteristic::BLE_GATT_CHAR_PROPERTIES_NOTIFY, NULL, 0);
static float angValue[4] = {0, 0, 0, 0};
//ReadOnlyArrayGattCharacteristic<float, sizeof(angValue)> angChar(angvelocityCharUUID, angValue, GattCharacteristic::BLE_GATT_CHAR_PROPERTIES_NOTIFY);
GattCharacteristic angChar(angvelocityCharUUID, reinterpret_cast<uint8_t*>(angValue), sizeof(angValue), sizeof(angValue) * 32, GattCharacteristic::BLE_GATT_CHAR_PROPERTIES_READ | GattCharacteristic::BLE_GATT_CHAR_PROPERTIES_NOTIFY, NULL, 0);
static uint32_t timeValue = 0;
ReadOnlyArrayGattCharacteristic<uint32_t, sizeof(timeValue)> timeChar(timeCharUUID, &timeValue);

// Custom service
GattCharacteristic *characteristics[] = {&accChar, &angChar, &timeChar};
GattService        rowbotService(rowbotServiceUUID, characteristics, sizeof(characteristics) / sizeof(GattCharacteristic *));

void disconnectionCallback(const Gap::DisconnectionCallbackParams_t *params)
{
    BLE::Instance().gap().startAdvertising();
}

extern uint32_t SystemCoreClock;

void updateSensorValue() {
    BLE &ble = BLE::Instance();

    static int i = 0;
    i++;

    float acc[] = {1, 2, 3, 0, 4, 5, 6, 0};
    uint32_t acc_time = 10054;
    memcpy(&acc[3], &acc_time, sizeof(acc_time));
    memcpy(&acc[7], &++acc_time, sizeof(acc_time));

    if(i%2 == 0) {
        acc[0] = 0;
        ble.updateCharacteristicValue(accChar.getValueHandle(), reinterpret_cast<const uint8_t*>(acc), sizeof(acc));
    }
    else {
        ble.updateCharacteristicValue(accChar.getValueHandle(), reinterpret_cast<const uint8_t*>(acc), sizeof(acc)/2);
    }

    float ang[] = {1, 2, 3, 0, 1, 2, 3, 0};
    uint32_t ang_time = 32158;
    memcpy(&ang[3], &ang_time, sizeof(ang_time));
    memcpy(&ang[7], &++ang_time, sizeof(ang_time));

    if(i%2 == 0) {
        ang[0] = 0;
        ble.updateCharacteristicValue(angChar.getValueHandle(), reinterpret_cast<const uint8_t*>(ang), sizeof(ang));
    }
    else {
        ble.updateCharacteristicValue(angChar.getValueHandle(), reinterpret_cast<const uint8_t*>(ang), sizeof(ang)/2);
    }

    uint32_t time = SystemCoreClock; 
    ble.updateCharacteristicValue(timeChar.getValueHandle(), reinterpret_cast<const uint8_t*>(&time), sizeof(time));
}

void blinkCallback(void)
{
    led1 = !led1; /* Do blinky on LED1 while we're waiting for BLE events */

    if (BLE::Instance().getGapState().connected) {
        minar::Scheduler::postCallback(updateSensorValue);
    }
}

void app_start(int, char**)
{
    minar::Scheduler::postCallback(blinkCallback).period(minar::milliseconds(500));

    BLE &ble = BLE::Instance();
    ble.init();

    uint8_t address[] = {0xAB, 0xCD, 0xAB, 0xCD, 0xAB, 0xCF};
    ble.gap().setAddress(Gap::ADDR_TYPE_PUBLIC, address);
    

    ble.gap().onDisconnection(disconnectionCallback);

    ble.addService(rowbotService);

    /* Setup advertising */
    ble.gap().accumulateAdvertisingPayload(GapAdvertisingData::BREDR_NOT_SUPPORTED | GapAdvertisingData::LE_GENERAL_DISCOVERABLE);
    ble.gap().accumulateAdvertisingPayload(GapAdvertisingData::COMPLETE_LIST_16BIT_SERVICE_IDS, (uint8_t *)uuid16_list, sizeof(uuid16_list));
    ble.gap().accumulateAdvertisingPayload(GapAdvertisingData::COMPLETE_LOCAL_NAME, (uint8_t *)DEVICE_NAME, sizeof(DEVICE_NAME));
    ble.gap().setAdvertisingType(GapAdvertisingParams::ADV_CONNECTABLE_UNDIRECTED);
    ble.gap().setAdvertisingInterval(200); /* 1000ms */
    ble.gap().startAdvertising();
}
