#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_log.h"
#include "esp_system.h"
#include "nvs_flash.h"
#include "esp_netif.h"
#include "esp_http_client.h"
#include "cJSON.h"

#include "dht.h" // ต้องมีไลบรารี DHT สำหรับ ESP-IDF

#define DHT_GPIO 4
#define DHT_TYPE DHT_TYPE_DHT11

#define WIFI_SSID "vivo 1938"
#define WIFI_PASS "1234567890"
#define SERVER_URL "http://10.41.23.124:3001/api/data"

static const char *TAG = "ESP32_SENSOR";

void wifi_init(void)
{
    esp_netif_init();
    esp_event_loop_create_default();
    esp_netif_create_default_wifi_sta();

    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    esp_wifi_init(&cfg);

    wifi_config_t wifi_config = {};
    strcpy((char*)wifi_config.sta.ssid, WIFI_SSID);
    strcpy((char*)wifi_config.sta.password, WIFI_PASS);

    esp_wifi_set_mode(WIFI_MODE_STA);
    esp_wifi_set_config(WIFI_IF_STA, &wifi_config);
    esp_wifi_start();
    esp_wifi_connect();

    ESP_LOGI(TAG, "Connecting to WiFi...");
}

void send_data(float temperature, float humidity)
{
    cJSON *root = cJSON_CreateObject();
    cJSON_AddNumberToObject(root, "temperature", temperature);
    cJSON_AddNumberToObject(root, "humidity", humidity);
    char *json_data = cJSON_Print(root);

    esp_http_client_config_t config = {
        .url = SERVER_URL,
        .method = HTTP_METHOD_POST,
    };
    esp_http_client_handle_t client = esp_http_client_init(&config);
    esp_http_client_set_header(client, "Content-Type", "application/json");
    esp_http_client_set_post_field(client, json_data, strlen(json_data));

    esp_err_t err = esp_http_client_perform(client);
    if (err == ESP_OK) {
        ESP_LOGI(TAG, "HTTP POST Status = %d", esp_http_client_get_status_code(client));
    } else {
        ESP_LOGE(TAG, "HTTP POST failed: %s", esp_err_to_name(err));
    }

    esp_http_client_cleanup(client);
    free(json_data);
    cJSON_Delete(root);
}

void app_main(void)
{
    nvs_flash_init();
    wifi_init();

    dht_sensor_type_t sensor_type = DHT_TYPE;

    while (1) {
        float temperature = 0, humidity = 0;
        if (dht_read_float_data(sensor_type, DHT_GPIO, &humidity, &temperature) == ESP_OK) {
            ESP_LOGI(TAG, "Temp: %.1f C, Hum: %.1f %%", temperature, humidity);
            send_data(temperature, humidity);
        } else {
            ESP_LOGE(TAG, "Failed to read from DHT sensor");
        }
        vTaskDelay(pdMS_TO_TICKS(5000));
    }
}
