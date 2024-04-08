<!-- prettier-ignore-start -->
# Flocker

A Twitter clone built from scratch with Next.js + TypeScript. \
Deployed on <a href="https://flocker.top" target="_blank">flocker.top</a>

<img src="https://github.com/chulev/project/assets/5923025/63e2e13d-9791-401c-8f2f-cdec0d5440dc" alt="Flocker home light theme" height="250" />
<img src="https://github.com/chulev/project/assets/5923025/d3bea6a1-0dec-4592-9b52-0cdf4d1c0145" alt="Flocker home dark theme" height="250" />
<img src="https://github.com/chulev/project/assets/5923025/8236585e-4f84-45d4-94e7-8032a93911a0" alt="Flocker profile page" height="250" />
<img src="https://github.com/chulev/project/assets/5923025/bf583aeb-5dae-4e0f-b879-e6757bdcf3f7" alt="Flocker home mobile" height="250" />

## Features

- **Authentication**: Users can sign up, log in, and log out securely using credentials (username/password) or Google sign-in. Forgot password and email verification flows are also implemented for enhanced security. Emails are sent using Resend. 🛡️📧
- **Tweeting and Replying with Images**: Users can create new tweets and replies, including the option to upload an image. Images are uploaded through Cloudinary for seamless integration. 🖼️
- **Interactions**: Users can also retweet, like, and bookmark tweets. Likes can also be applied to replies. Additionally, users can follow other users to stay updated with their tweets. ❤️🔁🔖
- **Hashtags**: Tweets can contain hashtags, which allow users to categorize and discover content easily by adding relevant keywords or phrases to their posts. Users can click on a hashtag to view all tweets containing it. 🔖
- **Personalized Profile Page**: Every user has a personalized profile page with the option to add an avatar, cover image, and a bio section. ✅
- **Real-time Updates**: Real-time updates are achieved through Server-Sent Events (SSE) and Redis Publish/Subscribe, providing instant notifications for interactions such as tweeting, retweeting, liking, and following. 🔄⚡
- **Form Validation**: Zod is used for validating form input both client-side and server-side, providing robust validation for improved user experience and security. ✅
- **Rate Limiting**: Interactions are rate-limited, ensuring that users cannot excessively perform actions like tweeting, retweeting, or liking within a short period of time. 🕒
- **Infinite Scroll**: All feeds feature infinite scrolling, implemented with cursor-based pagination, providing a seamless browsing experience for users as they explore tweets, replies, or users. 🔄📜 
- **Responsive design**: Built with Tailwind CSS, the application is responsive and works well on various screen sizes.
- **Light and Dark Theme**: Users can switch between light and dark themes according to their preferences for a personalized user experience. 🌞🌚
- **Dockerized Development + Hot Reload**: The project is "dockerized" for local development, with Redis and Postgres instances included, ensuring consistency across different environments. Migrations and seeds are applied on startup. 🐳
- **Configured for Unit Testing**: Bun test runner and React Testing Library are used for writing unit tests (example tests included).
- **Sensible Linting and Formatting**: The project comes pre-configured with sensible ESLint and Prettier defaults out of the box, ensuring code quality and consistency. ✨🧹

## Technologies

- **TypeScript**: A statically typed superset of JavaScript.
- **Next.js + App Router**: A React framework for server-side rendering, static site generation, and more.
- **Auth.js**: A library for user authentication.
- **Tailwind CSS**: A utility-first CSS framework for quickly building custom designs.
- **Kysely**: A TypeScript-first SQL query builder.
- **Resend**: A lightweight HTTP client for making API requests and sending emails.
- **Redis**: An in-memory data structure store used for caching real-time updates.
- **Postgres**: A powerful, open-source relational database system.
- **Docker**: A platform for developing, shipping, and running applications using containerization.
- **Cloudinary**: A cloud-based image and video management service for uploading, storing, and manipulating media assets.
- **SSE (Server-Sent Events)**: A standard allowing servers to push updates to web clients over HTTP.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **Bun**: A fast all-in-one JavaScript runtime. Bun is used for installing dependencies, running unit tests, and production builds.
- **React Testing Library**: A light-weight solution for testing React components and hooks.
- **GitHub Actions**: GitHub's CI/CD solution. 
- **Render**: Production build is deployed to Render.com via a manually triggered GitHub Workflow.

## Getting Started

*Prerequisites:* Docker

To get started with this project, follow these steps:

1. Clone the repository:

```
git clone https://github.com/chulev/flocker.git
```

2. Navigate to the project directory:

```
cd flocker
```

3. Create a `.env.local` file based on the `.env.example` file.

4. Start the local development environment:

```
docker-compose up -d
```

5. Open your browser and navigate to `http://localhost:3000` to view the application. 

6. Use your favorite editor to make changes and see them apply instantly!

## License

This project is licensed under the [MIT License](LICENSE). 📝🎉
<!-- prettier-ignore-end -->
