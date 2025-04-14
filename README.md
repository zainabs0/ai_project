# AI Chatbot Application

A simple chat application with a React frontend and C++ backend that integrates with the OpenAI API.

## Prerequisites

- C++17 compatible compiler (gcc 8+, clang 7+, MSVC 2019+)
- CMake 3.10 or higher
- libcurl
- OpenSSL
- Node.js 16 or higher
- npm or yarn
- OpenAI API key

## Setup

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ai_project
```

2. Set up environment variables:
```bash
# Create a .env file in the root directory
echo "OPENAI_API_KEY=your-api-key-here" > .env
echo "PORT=8080" >> .env
```

3. Install dependencies:
```bash
# Create dependencies directory
mkdir -p deps
cd deps

# Clone required dependencies
git clone https://github.com/yhirose/cpp-httplib.git
git clone https://github.com/nlohmann/json.git

# Install system dependencies (Ubuntu/Debian)
sudo apt-get install libcurl4-openssl-dev libssl-dev

# Install system dependencies (macOS)
brew install curl openssl
```

4. Build the backend:
```bash
# Create build directory
mkdir build
cd build

# Configure and build
cmake ..
make
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Start the Backend

1. In the build directory, run:
```bash
./ai_chatbot_backend
```

The backend server will start on port 8080 (or the port specified in your .env file).

### Start the Frontend

1. In a new terminal, navigate to the frontend directory:
```bash
cd frontend
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173` (or the URL shown in your terminal)

## Features

- Modern, responsive chat interface
- Real-time message display
- Loading states and error handling
- Auto-scrolling to latest messages
- Support for sending messages via button click or Enter key
- Integration with OpenAI's GPT-3.5 Turbo model

## API Endpoints

- `POST /test`: Sends a message to the OpenAI API and returns the response
  - Request body: `{ "message": "your message here" }`
  - Response: OpenAI API response in JSON format

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: Port number for the backend server (default: 8080)

## Troubleshooting

If you encounter any issues:

1. Ensure your OpenAI API key is valid and properly set in the .env file
2. Check that both the backend and frontend servers are running
3. Verify that the frontend is making requests to the correct backend URL
4. Check the browser's developer console for any frontend errors
5. Check the terminal running the backend for any server errors
6. For C++ build issues:
   - Ensure all dependencies are properly installed
   - Check that CMake can find all required libraries
   - Verify your compiler supports C++17
