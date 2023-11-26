# Threads Clone

This project is a clone of the popular social media platform Threads, built using Next.js, Tailwind CSS, TypeScript, MongoDB, and Clerk. It provides a user-friendly interface for creating, viewing, and commenting on threads, as well as managing user profiles and communities.

## Features
- User authentication and authorization using Clerk
- Real-time thread creation, deletion, and replies
- Real-time activity notifications
- Profile customization and community management

## Technologies
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: MongoDB
- **Authentication**: Clerk

## Installation
1. Clone the repository:
```bash
git clone https://github.com/sheharyarahmad842/threads.git
```
2. Navigate to the project directory:
```bash
cd threads
```
3. Install the dependencies:
```bash
npm install
```
4. Create a .env.local file in the root directory and add the following environment variables:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
MONGO_URI=YOUR_MONGODB_URI
UPLOADTHING_SECRET=YOUR_UPLOADTHING_SECRET_KEY
UPLOADTHING_APP_ID=YOUR_UPLOADTHING_APP_ID
NEXT_CLERK_WEBHOOK_SECRET=YOUR_NEXT_CLERK_WEBHOOK_SECRET
```  

## Development
1. Start the MongoDB server if it's not already running.
2. Run the development server:
```bash
npm run dev
```  
3. Open your browser and visit: http://localhost:3000
   
## Contributing
Please feel free to contribute to the project by adding new features, fixing bugs, or enhancing the user experience. To get started, fork the repository and create a new branch for your feature. Once your changes are complete, submit a pull request.
