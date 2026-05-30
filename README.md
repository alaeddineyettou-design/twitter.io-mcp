# TwitterAPI.io MCP Server

A comprehensive MCP (Model Context Protocol) server wrapping all 58 endpoints of the [twitterapi.io](https://docs.twitterapi.io) API. Built with Python and FastMCP for use with AI agents, n8n workflows, and any MCP-compatible client.

## Features

- **58 MCP tools** covering every twitterapi.io endpoint
- **12 categories**: User, Tweet, Actions, Bookmarks, Follow, DM/Media, Account, List, Community, Spaces/Trends/Article, Webhook, Monitor
- **Streamable HTTP transport** for reliable connections
- **Systemd service** for production deployment

## Tool Categories

| Category | Tools | Description |
|---|---|---|
| 👤 User | 12 | Profile info, followers, followings, timeline, search |
| 🐦 Tweet | 7 | Get tweets, replies, quotes, retweeters, thread, advanced search |
| ✍️ Actions | 7 | Create/delete tweet, like/unlike, retweet, bookmark/unbookmark |
| 📚 Bookmarks | 1 | Get bookmarked tweets |
| 👥 Follow | 2 | Follow/unfollow users |
| 💬 DM & Media | 2 | Send DMs, upload media |
| 🔐 Account | 5 | Login, profile info, update profile/avatar/banner |
| 📋 List | 3 | List timeline, members, followers |
| 🏘️ Community | 9 | Info, tweets, members, create/delete/join/leave |
| 🌐 Spaces/Trends | 3 | Space details, trending topics, articles |
| 🔔 Webhook | 4 | Add/get/update/delete filter rules |
| 📡 Monitor | 3 | Add/remove/get monitored users |

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/twitter-mcp-server.git
cd twitter-mcp-server
python3 -m venv venv
source venv/bin/activate
pip install mcp httpx
```

### 2. Configure API Key

Edit `server.py` and set your twitterapi.io API key:

```python
API_KEY = "your_api_key_here"
```

### 3. Run

```bash
python server.py
```

The server starts on `http://0.0.0.0:3100/mcp`

### 4. Production (Systemd)

```ini
[Unit]
Description=TwitterAPI MCP Server
After=network.target

[Service]
WorkingDirectory=/opt/twitter-mcp
Environment="PATH=/opt/twitter-mcp/venv/bin:$PATH"
ExecStart=/opt/twitter-mcp/venv/bin/python server.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

## Usage with n8n

Add this MCP server in n8n's MCP node configuration:
- **URL**: `http://YOUR_SERVER_IP:3100/mcp`
- **Transport**: Streamable HTTP

## Usage with AI Agents

Connect any MCP-compatible AI agent to `http://YOUR_SERVER_IP:3100/mcp`.

## API Documentation

Full API documentation: [docs.twitterapi.io](https://docs.twitterapi.io)

## License

MIT
