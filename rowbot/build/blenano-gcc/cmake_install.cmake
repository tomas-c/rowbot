# Install script for directory: /home/tomas/Tests/yotta/rowbot/rowbot/build/blenano-gcc

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "/usr/local")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "RelWithDebInfo")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for each subdirectory.
  include("/home/tomas/Tests/yotta/rowbot/rowbot/build/blenano-gcc/ym/mbed-hal-nrf51822-mcu/cmake_install.cmake")
  include("/home/tomas/Tests/yotta/rowbot/rowbot/build/blenano-gcc/ym/ble/cmake_install.cmake")
  include("/home/tomas/Tests/yotta/rowbot/rowbot/build/blenano-gcc/source/cmake_install.cmake")

endif()

if(CMAKE_INSTALL_COMPONENT)
  set(CMAKE_INSTALL_MANIFEST "install_manifest_${CMAKE_INSTALL_COMPONENT}.txt")
else()
  set(CMAKE_INSTALL_MANIFEST "install_manifest.txt")
endif()

file(WRITE "/home/tomas/Tests/yotta/rowbot/rowbot/build/blenano-gcc/${CMAKE_INSTALL_MANIFEST}" "")
foreach(file ${CMAKE_INSTALL_MANIFEST_FILES})
  file(APPEND "/home/tomas/Tests/yotta/rowbot/rowbot/build/blenano-gcc/${CMAKE_INSTALL_MANIFEST}" "${file}\n")
endforeach()
