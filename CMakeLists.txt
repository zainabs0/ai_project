cmake_minimum_required(VERSION 3.10)
project(ai_chatbot_backend)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find required packages
find_package(CURL REQUIRED)
find_package(OpenSSL REQUIRED)

# Add cpp-httplib and nlohmann/json as subdirectories
add_subdirectory(deps/cpp-httplib)
add_subdirectory(deps/json)

# Add executable
add_executable(ai_chatbot_backend main.cpp)

# Link libraries
target_link_libraries(ai_chatbot_backend
    PRIVATE
    ${CURL_LIBRARIES}
    ${OPENSSL_LIBRARIES}
    httplib
    nlohmann_json::nlohmann_json
)

# Include directories
target_include_directories(ai_chatbot_backend
    PRIVATE
    ${CURL_INCLUDE_DIRS}
    ${OPENSSL_INCLUDE_DIR}
    deps/cpp-httplib
    deps/json/include
) 
