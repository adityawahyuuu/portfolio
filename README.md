# Dynamic Portfolio with Admin Panel

This is a dynamic portfolio website built using **Next.js**, **TypeScript**, **Tailwind CSS**, **Firebase**, and **Realtime Database**. The website includes a fully functional **Admin Panel** that allows the portfolio owner to manage and update portfolio sections in real-time without the need to modify the codebase. Authentication is powered by **Firebase** with email/password login and signup functionality.

## Features

- **Dynamic Portfolio**: Easily editable sections, including About Me, Projects, Skills, and more, directly through the Admin Panel.
- **Admin Panel**: A secure and responsive Admin Panel where you can manage and update your portfolio content.
- **Firebase Authentication**: Implemented with **email/password** authentication for secure access to the Admin Panel.
- **Firebase Realtime Database**: All portfolio data (text, images, and projects) is stored in **Firebase's Realtime Database**, allowing for seamless updates in real time.
- **Responsive Design**: Built with **Tailwind CSS** to ensure the portfolio looks great on all screen sizes.

## Tech Stack

- **Next.js**: A powerful React framework for building fast and scalable websites.
- **TypeScript**: Provides type safety and better tooling for a robust development experience.
- **Tailwind CSS**: A utility-first CSS framework for creating fast and flexible designs.
- **Firebase**: Provides backend services, including authentication and real-time data storage.
  - **Firebase Authentication**: For secure user login and signup.
  - **Firebase Realtime Database**: For storing and managing data dynamically.
  
## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version >= 14.x)
- **npm** or **yarn** package manager
- A **Firebase account** (to set up authentication and database)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Tahasaif3/My-Dynamic-Portfolio.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd My-Dynamic-Portfolio
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

4. **Set up Firebase**:
   - Create a project on [Firebase Console](https://console.firebase.google.com/).
   - Enable **Email/Password Authentication** in the Firebase console under the Authentication section.
   - Set up **Firebase Realtime Database** and configure the structure as per your portfolio's needs (you can find an example structure in the database).

5. **Configure Firebase in your app**:
   - Go to `firebase.js` (or wherever you have initialized Firebase) and add your Firebase config credentials. You can find this information in the Firebase console under Project Settings > Web App.
   ```js
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     databaseURL: "your-database-url",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };
   ```

6. **Run the development server**:
   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

   Your app should now be running at `http://localhost:3000`.

## Admin Panel Features

- **Login/Signup**: Secure login and signup using Firebase Authentication (email/password).
- **Edit Portfolio Sections**: Once logged in, the admin can update text, images, and other content from the **About Me**, **Projects**, **Skills**, and other sections.
- **Real-time Updates**: All changes made in the Admin Panel are immediately reflected on the live portfolio website, thanks to Firebase Realtime Database.

## Folder Structure

```plaintext
├── components/
│   ├── AdminPanel.tsx
│   ├── Header.tsx
│   ├── PortfolioSection.tsx
│   └── ...
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── ...
├── styles/
│   └── globals.css
├── firebase/
│   └── firebase.ts
└── utils/
    └── auth.ts
```

- **components**: Contains all the reusable components, including the Admin Panel, Portfolio sections, and others.
- **pages**: Contains the main pages like the homepage (`index.tsx`) and Admin Panel (`admin.tsx`).
- **firebase**: Contains the Firebase configuration and functions for authentication and data handling.
- **styles**: Contains global CSS and Tailwind configuration.
- **utils**: Contains utility functions like authentication helpers.

## How It Works

- The **Admin Panel** provides a form to update the sections of the portfolio.
- Once logged in, the user can update content, which gets stored in the Firebase Realtime Database.
- The changes are fetched from the database in real-time, ensuring the content displayed on the public portfolio is always up-to-date.

## Deployment

You can deploy this portfolio using services like **Vercel** or **Netlify**, which have built-in support for Next.js. The Firebase configuration will work seamlessly in production as well.

### Deploy with Vercel

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/).
3. Connect your GitHub repository to Vercel and deploy your site.

## Contributing

If you would like to contribute to this project, feel free to open a pull request! Any improvements or bug fixes are welcome.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
