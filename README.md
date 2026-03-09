# 🎮 Discord Game Deals Bot (Node.js)

![Game Deals Bot Banner](https://raw.githubusercontent.com/user-attachments/assets/game_deals_bot_banner_1772959838978.png)

A high-performance, feature-rich Discord bot designed to keep gamers updated with the latest deals, freebies, and historical lows, all with **INR (Indian Rupee)** currency support.

---

## 🚀 Features

- **🇮🇳 Real-time INR Conversion**: Automatically converts all USD prices to INR using live exchange rates.
- **🎁 Free Game Tracker**: Dedicated monitoring for **Epic Games Store** and **Steam** freebies.
- **🔥 "Worth It?" (Historical Lows)**: Compares current sale prices with the lowest price ever recorded.
- **📉 Savings Filter**: Admins can configure channels to only show deals above a certain discount percentage (25%, 50%, 75%).
- **📄 Interactive Pagination**: Browse hundreds of deals effortlessly using Discord buttons.
- **🛡️ Webhook Logging**: Real-time error and status logging sent directly to your private Discord channel.
- **🗄️ Database Backed**: Powered by **Prisma** and **SQLite** for high scalability and reliability.
- **🖱️ Modern Slash Commands**: Fully compatible with the latest Discord interaction features.

---

## 🛠️ Commands

| Command | Description |
| :--- | :--- |
| `/deals` | Browse current hot deals from Steam, GOG, and Epic. |
| `/freebies` | List all currently available free games. |
| `/best` | Fetch the highest-rated games currently on sale. |
| `/search` | Find the best deal for a specific game title. |
| `/all` | Access a paginated list of every available game deal. |
| `/setup` | Configure auto-upload channels and savings filters. |
| `/developer` | Learn more about the bot's creator and support the project. |

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [Discord Developer Portal](https://discord.com/developers/applications) - Create an app and get your **Bot Token** and **Client ID**.

### 2. Installation
```bash
git clone https://github.com/albertodrake/discord-game-deals-bot.git
cd discord-game-deals-bot
npm install
```

### 3. Configuration
Rename `.env.example` to `.env` and fill in your details:
```env
BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN
CLIENT_ID=YOUR_BOT_CLIENT_ID
LOG_WEBHOOK_URL=YOUR_DISCORD_LOGGING_WEBHOOK
DATABASE_URL="file:./dev.db"
```

### 4. Database Setup
Run the following command to initialize the MySQL database:
```bash
npx prisma db push
```

### 5. Start the Bot
```bash
npm start
```

---

## 👨‍💻 Developed by **Alberto Drake**
Created with a passion for gaming and automation. 🎮
- **GitHub**: [github.com/albertodrake](https://github.com/albertodrake)
- **Support**: If you find this bot useful, consider giving it a ⭐ on GitHub!

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
