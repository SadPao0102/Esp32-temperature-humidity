# Distributed under the OSI-approved BSD 3-Clause License.  See accompanying
# file Copyright.txt or https://cmake.org/licensing for details.

cmake_minimum_required(VERSION 3.5)

file(MAKE_DIRECTORY
  "C:/Espressif/frameworks/esp-idf-v5.3.1/components/bootloader/subproject"
  "C:/Users/thany/esp32-mongodb-webapp/esp32-sensor/build/bootloader"
  "C:/Users/thany/esp32-mongodb-webapp/esp32-sensor/build/bootloader-prefix"
  "C:/Users/thany/esp32-mongodb-webapp/esp32-sensor/build/bootloader-prefix/tmp"
  "C:/Users/thany/esp32-mongodb-webapp/esp32-sensor/build/bootloader-prefix/src/bootloader-stamp"
  "C:/Users/thany/esp32-mongodb-webapp/esp32-sensor/build/bootloader-prefix/src"
  "C:/Users/thany/esp32-mongodb-webapp/esp32-sensor/build/bootloader-prefix/src/bootloader-stamp"
)

set(configSubDirs )
foreach(subDir IN LISTS configSubDirs)
    file(MAKE_DIRECTORY "C:/Users/thany/esp32-mongodb-webapp/esp32-sensor/build/bootloader-prefix/src/bootloader-stamp/${subDir}")
endforeach()
if(cfgdir)
  file(MAKE_DIRECTORY "C:/Users/thany/esp32-mongodb-webapp/esp32-sensor/build/bootloader-prefix/src/bootloader-stamp${cfgdir}") # cfgdir has leading slash
endif()
