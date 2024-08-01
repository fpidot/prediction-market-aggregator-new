# Prediction Market Aggregator - Environment Setup Documentation

## Node.js and npm Versions
- Node.js version: v20.13.1
- npm version: 10.5.2

To check your versions, run:
```
node --version
npm --version
```

## Global npm Packages
The following global npm packages are used in this project:
1. react-native-cli@2.0.1
2. ts-node@10.9.2
3. typescript@5.5.4
4. yarn@1.22.22

To list global npm packages, run:
```
npm list -g --depth=0
```

## Development Environment Setup Steps
1. Clone the repository:
   ```
   git clone https://github.com/fpidot/prediction-market-aggregator-new.git
   cd prediction-market-aggregator-new
   ```

2. Install dependencies:
   ```
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   - Copy the `.env.example` files in both frontend and backend directories to `.env`
   - Fill in the necessary values in both `.env` files

4. Set up MongoDB:
   - Install MongoDB Community Edition version 7.0.12
   - Start the MongoDB service
   - Create a new database named "prediction_market_aggregator"
   - Import the data from the JSON files as described in the MongoDB Export Documentation

5. Install global npm packages if not already installed:
   ```
   npm install -g react-native-cli@2.0.1 ts-node@10.9.2 typescript@5.5.4 yarn@1.22.22
   ```

## Running the Application
1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Access the application at http://localhost:3000

## MongoDB Connection
- Host: localhost
- Port: 27017
- Database Name: prediction_market_aggregator

## Additional Tools
- MongoDB Compass (for database management and data import/export)

## Common Issues and Troubleshooting
- No common issues reported at this time. If you encounter any problems, please document them here for future reference.

## Additional Notes
- This project uses yarn in addition to npm. Make sure you have yarn installed globally.
- TypeScript is used in this project. Ensure you're familiar with TypeScript basics.
- The backend runs in development mode using the `npm run dev` command, which likely uses a tool like nodemon for hot reloading.
