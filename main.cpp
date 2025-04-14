#include <iostream>
#include <string>
#include <httplib.h>
#include <nlohmann/json.hpp>
#include <cstdlib>
#include <curl/curl.h>

using json = nlohmann::json;

// Callback function for CURL
size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* userp) {
    userp->append((char*)contents, size * nmemb);
    return size * nmemb;
}

std::string callOpenAI(const std::string& message) {
    CURL* curl = curl_easy_init();
    std::string response_string;
    std::string header_string;
    
    if (curl) {
        const char* api_key = std::getenv("OPENAI_API_KEY");
        if (!api_key) {
            throw std::runtime_error("OPENAI_API_KEY environment variable is not set");
        }

        std::string auth_header = "Authorization: Bearer " + std::string(api_key);
        
        struct curl_slist* headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        headers = curl_slist_append(headers, auth_header.c_str());

        json request_body = {
            {"model", "gpt-3.5-turbo"},
            {"messages", {
                {
                    {"role", "user"},
                    {"content", message}
                }
            }}
        };

        curl_easy_setopt(curl, CURLOPT_URL, "https://api.openai.com/v1/chat/completions");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, request_body.dump().c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response_string);

        CURLcode res = curl_easy_perform(curl);
        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);

        if (res != CURLE_OK) {
            throw std::runtime_error("Failed to call OpenAI API: " + std::string(curl_easy_strerror(res)));
        }
    }

    return response_string;
}

int main() {
    const char* port_str = std::getenv("PORT");
    int port = port_str ? std::stoi(port_str) : 8080;

    httplib::Server svr;

    // Enable CORS
    svr.set_base_dir("./");
    svr.set_mount_point("/", "./");
    svr.set_default_headers({
        {"Access-Control-Allow-Origin", "*"},
        {"Access-Control-Allow-Methods", "POST, OPTIONS"},
        {"Access-Control-Allow-Headers", "Content-Type"}
    });

    svr.Options("/test", [](const httplib::Request&, httplib::Response& res) {
        res.status = 200;
    });

    svr.Post("/test", [](const httplib::Request& req, httplib::Response& res) {
        try {
            auto json_body = json::parse(req.body);
            std::string message = json_body["message"];
            
            std::string openai_response = callOpenAI(message);
            res.set_content(openai_response, "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(json({{"error", e.what()}}).dump(), "application/json");
        }
    });

    std::cout << "Server starting on port " << port << std::endl;
    svr.listen("0.0.0.0", port);

    return 0;
} 
