# GeekUp Web App

A modern web application built with React, TypeScript, and Vite, designed for managing and organizing tech events and meetups.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/) (recommended)
- [GitHub CLI](https://cli.github.com/) (optional, for easier GitHub integration)

## Environment Setup

1. **Install Node.js**
   - Download and install from [Node.js official website](https://nodejs.org/)
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **Configure Git**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/geekup-web-app.git
cd web-app
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install

# If you encounter any issues, try clearing npm cache
npm cache clean --force
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Required environment variables:
```
VITE_API_URL=your_api_url
VITE_APP_ENV=development
```

### 4. Start Development Server

```bash
# Start the development server
npm run dev

# The application will be available at:
# http://localhost:5173
```

### 5. Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run unit tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run format` - Format code with Prettier

## Test Results and Screenshots

### Web Application Screenshots
<details>
<summary>Click to view Web App Screenshots</summary>

#### Home Page
![Home Page](result/Web/home.jpeg)

#### Albums
![Albums Grid View](result/Web/Albums_GridView.jpeg)
![Albums List View](result/Web/Album_ListView.jpeg)
![Album Details](result/Web/Album_Details.jpeg)
![Photo Preview](result/Web/Photo_Preview.jpeg)

#### Users
![Users List](result/Web/User.jpeg)
![User Details](result/Web/User_Details.jpeg)
</details>

### Mobile Application Screenshots
<details>
<summary>Click to view Mobile App Screenshots</summary>

#### Home Page
![Home Page](result/App/Home_app.jpeg)

#### Albums
![Albums Grid View](result/App/Album_GridView_app.jpeg)
![Albums List View](result/App/Album_Listview_app.jpeg)
![Album Details](result/App/Album_Details_app.jpeg)

#### Users
![Users List](result/App/User_app.jpeg)
![User Details](result/App/User_Details_app.jpeg)
![Search Users](result/App/Search_User_app.jpeg)
</details>

## Troubleshooting

1. **Node Modules Issues**
   ```bash
   # Remove node_modules and reinstall
   rm -rf node_modules
   npm install
   ```

2. **Port Already in Use**
   ```bash
   # Kill process using port 5173
   npx kill-port 5173
   ```

3. **TypeScript Errors**
   ```bash
   # Clear TypeScript cache
   rm -rf node_modules/.cache/typescript
   ```

## Support

For any issues or questions:
1. Check the [documentation](docs/)
2. Open an issue on GitHub
3. Contact the development team

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
