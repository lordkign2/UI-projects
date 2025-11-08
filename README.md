# Palette Pigeon

A collaborative design tool focused on color palette creation, accessibility validation, and team-based workflow management.

## 🎨 Overview

Palette Pigeon is a modern web application that empowers designers and developers to create, validate, and share color palettes with their teams. With real-time collaboration features, accessibility validation tools, and seamless export options, Palette Pigeon streamlines the color design workflow.

## 🚀 Features

- **Accessibility Validation Dashboard**: Analyzes color contrast, simulates colorblindness, and generates compliance reports
- **Collaborative Palette Canvas**: Real-time shared canvas for designing color schemes with live cursors and tools
- **Palette Library Organization**: Manages saved palettes with search, filters, bulk actions, and view toggles
- **Export Integration Hub**: Exports palettes in multiple formats, generates style guides, and ensures quality assurance
- **Team Workspace Management**: Handles team invitations, member roles, permissions, and workspace settings
- **Authentication System**: Supports login, registration, social auth, and password recovery

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Redux Toolkit, Tailwind CSS, React Router v6
- **UI Components**: Reusable component library with Button, Input, Select, Sidebar, etc.
- **Data Visualization**: D3.js and Recharts for accessibility metrics
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS with utility-first approach
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form
- **Backend**: Supabase (authentication, database)

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
palette-pigeon/
├── public/                          # Static assets
├── src/
│   ├── components/                  # Shared components
│   │   ├── ui/                      # Reusable UI components
│   │   └── ...                      # Other shared components
│   ├── contexts/                    # React contexts
│   ├── lib/                         # Utility libraries
│   ├── pages/                       # Feature-specific pages
│   │   ├── accessibility-validation-dashboard/
│   │   ├── authentication-login-register/
│   │   ├── collaborative-palette-canvas/
│   │   ├── export-integration-hub/
│   │   ├── palette-library-organization/
│   │   └── team-workspace-management/
│   ├── services/                    # Business logic APIs
│   ├── styles/                      # Global styles
│   ├── utils/                       # Utility functions
│   ├── App.jsx                      # Main application component
│   ├── Routes.jsx                   # Application routes
│   └── index.jsx                    # Application entry point
├── supabase/migrations/             # Database schema migrations
├── .env                             # Environment variables
├── index.html                       # HTML template
├── package.json                     # Project dependencies and scripts
├── tailwind.config.js               # Tailwind CSS configuration
└── vite.config.mjs                  # Vite configuration
```

## 🧪 Testing

Run tests with:
```bash
npm test
# or
yarn test
```

## 📦 Deployment

Build the application for production:
```bash
npm run build
# or
yarn build
```

Preview the production build:
```bash
npm run serve
# or
yarn serve
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Powered by React and Vite
- Styled with Tailwind CSS
