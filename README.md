# Phantom 👻

**Private conversations that vanish into thin air.**

Phantom is a secure, anonymous, and ephemeral chat application built for privacy. Create a room, share the passcode, and chat. When you're done, or after 10 minutes of inactivity, everything disappears forever. No sign-up. No history. No trace.

![Phantom Preview](/opengraph-image)

## ✨ Features

- **👻 Anonymous**: No accounts, no sign-ups, no tracking.
- **💨 Ephemeral**: Rooms and messages self-destruct after 10 minutes of inactivity.
- **🔐 Secure**: Rooms are protected by a random 6-digit passcode.
- **⚡ Real-Time**: Instant messaging and live typing indicators.
- **🎨 Beautiful UI**: Modern, dark-mode first design with smooth GSAP animations.
- **📱 Responsive**: Fully optimized for mobile and desktop devices.
- **⛔ Room Destruction**: Explicitly destroy a room to wipe data instantly.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database**: [Upstash Redis](https://upstash.com/) (Ephemeral storage)
- **Realtime**: [Upstash Realtime](https://upstash.com/docs/realtime/overall/getstarted) (WebSockets)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [GSAP](https://greensock.com/gsap/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- An [Upstash](https://upstash.com/) account (for Redis and Realtime)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/phantom-chat.git
    cd phantom-chat
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root directory and add your Upstash credentials:
    ```env
    UPSTASH_REDIS_REST_URL="your_redis_url"
    UPSTASH_REDIS_REST_TOKEN="your_redis_token"
    NEXT_PUBLIC_APP_URL="http://localhost:3000"
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Built with ❤️ by [Zahid](https://devzahid.vercel.app/)
