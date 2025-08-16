megatron-store-ui/
├── public/
│ └── index.html
├── src/
│ ├── assets/ # Images, logos, svgs (abhi khaali ya future use ke liye)
│ ├── components/ # Reusable UI components
│ │ ├── Header.tsx
│ │ └── Sidebar.tsx
│ ├── context/
│ │ └── ColorModeContext.tsx # MUI theme light/dark toggle
│ ├── hooks/ # Custom hooks (abhi khaali placeholder)
│ ├── layouts/
│ │ └── SidebarLayout.tsx # Sidebar + Header + Content layout with resizing
│ ├── pages/
│ │ ├── Login.tsx # Login screen
│ │ └── Dashboard.tsx # Dashboard screen with welcome msg
│ ├── routes/
│ │ └── AppRoutes.tsx # Optional if you later want to isolate route config
│ ├── styles/
│ │ └── index.css # Currently minimal/global reset CSS
│ ├── theme/ # Optional theme config (currently handled in ColorModeContext)
│ ├── types/ # TypeScript types/interfaces (abhi khaali placeholder)
│ ├── utils/ # Utility functions (abhi khaali placeholder)
│ ├── App.tsx # App layout, theme provider, routing
│ └── index.tsx # Entry point
├── .gitignore
├── package.json
├── tsconfig.json
