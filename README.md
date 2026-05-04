Complaint Management System

A full-stack web application to efficiently submit, track, and manage complaints. Built with a modern tech stack and deployed using cloud platforms for real-world usability.

Links

Features
[*] User complaint submission
[*] Secure admin login and authentication
[*] Admin dashboard for complaint management
[*] REST API integration
[*] Cloud deployment (Vercel + Render)
[*] MongoDB Atlas database
Tech Stack
Frontend
React (Vite)
TypeScript
Axios
Tailwind CSS
Backend
Node.js
Express.js
MongoDB (Mongoose)
Deployment
Vercel
Render
MongoDB Atlas
Project Structure
Complaint-Management-System/
│
├── frontend/        # React frontend
├── backend/         # Node.js + Express backend
├── README.md
Installation and Setup
1. Clone Repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
2. Backend Setup
cd backend
npm install

Create a .env file:

MONGO_URI=your_mongodb_connection_string
PORT=5000

Run backend:

npm start
3. Frontend Setup
cd frontend
npm install
npm run dev
Environment Variables
Variable	Description
MONGO_URI	MongoDB Atlas connection string
PORT	Backend server port
Common Issues
MongoDB connection error
Ensure IP is whitelisted in MongoDB Atlas
Verify connection string
CORS issues
Enable CORS in backend
500 server error
Check backend logs on Render
Future Improvements
Role-based access control
Email notifications
Complaint status tracking
Author

Radhika Gupta
GitHub : https://github.com/Radhikaa45

LinkedIn : https://www.linkedin.com/in/radhika-gupta

Support

If you find this project useful, consider giving it a star on GitHub.
