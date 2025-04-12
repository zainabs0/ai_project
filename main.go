package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/sashabaranov/go-openai"
)

type ChatRequest struct {
	Message string `json:"message"`
}

func main() {
	// Get OpenAI API key from environment variable
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		log.Fatal("OPENAI_API_KEY environment variable is not set")
	}

	// Create OpenAI client
	client := openai.NewClient(apiKey)

	// Create HTTP handler
	http.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
		// Enable CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		if r.Method != "POST" {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var chatReq ChatRequest
		if err := json.NewDecoder(r.Body).Decode(&chatReq); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Make a call to OpenAI
		resp, err := client.CreateChatCompletion(
			context.Background(),
			openai.ChatCompletionRequest{
				Model: openai.GPT3Dot5Turbo,
				Messages: []openai.ChatCompletionMessage{
					{
						Role:    openai.ChatMessageRoleUser,
						Content: chatReq.Message,
					},
				},
			},
		)

		if err != nil {
			http.Error(w, fmt.Sprintf("Error calling OpenAI API: %v", err), http.StatusInternalServerError)
			return
		}

		// Return the response
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	})

	// Start the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
} 
