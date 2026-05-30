import httpx
from mcp.server.fastmcp import FastMCP
from mcp.server.transport_security import TransportSecuritySettings

API_KEY = "new1_c84536b2f31c4ec79e20cd49b4ef029e"
BASE = "https://api.twitterapi.io"

mcp = FastMCP("twitterapi-mcp")
mcp.settings.host = "0.0.0.0"
mcp.settings.port = 3100
mcp.settings.transport_security = TransportSecuritySettings(enable_dns_rebinding_protection=False)


def call(path, params=None, data=None, method="GET"):
    """Make an API call to twitterapi.io"""
    try:
        url = f"{BASE}/{path}"
        headers = {"X-API-Key": API_KEY}
        if method == "GET":
            r = httpx.get(url, params=params, headers=headers, timeout=30.0)
        else:
            r = httpx.post(url, json=data, params=params, headers=headers, timeout=30.0)
        return r.json()
    except Exception as e:
        return {"error": str(e)}


# ============================================================
# 👤 USER ENDPOINTS (12 tools)
# ============================================================

@mcp.tool()
def get_user_info(userName: str) -> dict:
    """Get detailed user profile information by username."""
    return call("twitter/user/info", {"userName": userName})


@mcp.tool()
def batch_get_users_by_ids(userIds: str) -> dict:
    """Batch get user info by user IDs (comma-separated, e.g. '123,456,789')."""
    return call("twitter/user/batch_info_by_ids", {"userIds": userIds})


@mcp.tool()
def get_user_timeline(userId: str, cursor: str = "") -> dict:
    """Get a user's tweet timeline by userId. Supports pagination via cursor."""
    return call("twitter/user/tweet_timeline", {"userId": userId, "cursor": cursor})


@mcp.tool()
def get_user_last_tweets(userName: str) -> dict:
    """Get a user's last/recent tweets by username (quick fetch without pagination)."""
    return call("twitter/user/last_tweets", {"userName": userName})


@mcp.tool()
def get_user_followers(userName: str, cursor: str = "") -> dict:
    """Get a user's followers list by username. Supports pagination via cursor."""
    return call("twitter/user/followers", {"userName": userName, "cursor": cursor})


@mcp.tool()
def get_user_followers_ids(userId: str, cursor: str = "") -> dict:
    """Get a user's follower IDs in bulk by userId. Returns IDs only for efficiency."""
    return call("twitter/user/followers_ids", {"userId": userId, "cursor": cursor})


@mcp.tool()
def get_user_followings(userName: str, cursor: str = "") -> dict:
    """Get who a user is following by username. Supports pagination via cursor."""
    return call("twitter/user/followings", {"userName": userName, "cursor": cursor})


@mcp.tool()
def get_user_mentions(userId: str, cursor: str = "") -> dict:
    """Get tweets mentioning a user by userId. Supports pagination via cursor."""
    return call("twitter/user/mentions", {"userId": userId, "cursor": cursor})


@mcp.tool()
def check_follow_relationship(sourceUserName: str, targetUserName: str) -> dict:
    """Check if sourceUserName follows targetUserName and vice versa."""
    return call("twitter/user/check_follow_relationship", {"sourceUserName": sourceUserName, "targetUserName": targetUserName})


@mcp.tool()
def search_users(query: str, cursor: str = "") -> dict:
    """Search for users by keyword/query string. Supports pagination via cursor."""
    return call("twitter/user/search", {"query": query, "cursor": cursor})


@mcp.tool()
def get_user_verified_followers(userName: str, cursor: str = "") -> dict:
    """Get a user's verified/blue-check followers. Supports pagination via cursor."""
    return call("twitter/user/verifiedFollowers", {"userName": userName, "cursor": cursor})


@mcp.tool()
def get_user_about(userName: str) -> dict:
    """Get user's profile 'About' section with additional details."""
    return call("twitter/user_about", {"userName": userName})


# ============================================================
# 🐦 TWEET ENDPOINTS (7 tools)
# ============================================================

@mcp.tool()
def get_tweets_by_ids(tweet_ids: str) -> dict:
    """Get tweet details by tweet IDs (comma-separated, e.g. '123,456')."""
    return call("twitter/tweets", {"tweet_ids": tweet_ids})


@mcp.tool()
def get_tweet_replies(tweetId: str, cursor: str = "") -> dict:
    """Get replies to a tweet. Supports pagination via cursor."""
    return call("twitter/tweet/replies", {"tweetId": tweetId, "cursor": cursor})


@mcp.tool()
def get_tweet_replies_v2(tweetId: str, cursor: str = "", sinceId: str = "", untilId: str = "") -> dict:
    """Get tweet replies V2 with sinceId/untilId filtering. Supports pagination via cursor."""
    params = {"tweetId": tweetId, "cursor": cursor}
    if sinceId:
        params["sinceId"] = sinceId
    if untilId:
        params["untilId"] = untilId
    return call("twitter/tweet/replies/v2", params)


@mcp.tool()
def get_tweet_quotes(tweetId: str, cursor: str = "") -> dict:
    """Get quote tweets of a specific tweet. Supports pagination via cursor."""
    return call("twitter/tweet/quotes", {"tweetId": tweetId, "cursor": cursor})


@mcp.tool()
def get_tweet_retweeters(tweetId: str, cursor: str = "") -> dict:
    """Get users who retweeted a specific tweet. Supports pagination via cursor."""
    return call("twitter/tweet/retweeters", {"tweetId": tweetId, "cursor": cursor})


@mcp.tool()
def get_tweet_thread(tweetId: str) -> dict:
    """Get full thread context for a tweet (parent + children in conversation)."""
    return call("twitter/tweet/thread_context", {"tweetId": tweetId})


@mcp.tool()
def tweet_advanced_search(queryString: str, cursor: str = "") -> dict:
    """Advanced tweet search using Twitter's advanced search syntax.
    
    Examples of queryString:
    - 'from:elonmusk' — tweets from a specific user
    - 'bitcoin min_faves:100' — popular tweets about bitcoin
    - '#AI lang:en since:2024-01-01' — hashtag with date filter
    """
    return call("twitter/tweet/advanced_search", {"queryString": queryString, "cursor": cursor})


# ============================================================
# ✍️ TWEET ACTION V2 ENDPOINTS (7 tools) — ⚠️ WRITE OPERATIONS
# ============================================================

@mcp.tool()
def create_tweet(text: str, reply_to_tweet_id: str = "", media_ids: str = "", quote_tweet_id: str = "") -> dict:
    """⚠️ Create/post a new tweet. Can include media, reply to tweet, or quote tweet.
    
    Args:
        text: Tweet text content (required)
        reply_to_tweet_id: Tweet ID to reply to (optional)
        media_ids: Comma-separated media IDs from upload_media (optional)
        quote_tweet_id: Tweet ID to quote (optional)
    """
    payload = {"text": text}
    if reply_to_tweet_id:
        payload["reply_to_tweet_id"] = reply_to_tweet_id
    if media_ids:
        payload["media_ids"] = media_ids.split(",")
    if quote_tweet_id:
        payload["quote_tweet_id"] = quote_tweet_id
    return call("twitter/create_tweet_v2", data=payload, method="POST")


@mcp.tool()
def delete_tweet(tweetId: str) -> dict:
    """⚠️ Delete a tweet by its ID."""
    return call("twitter/delete_tweet_v2", data={"tweetId": tweetId}, method="POST")


@mcp.tool()
def like_tweet(tweetId: str) -> dict:
    """⚠️ Like a tweet by its ID."""
    return call("twitter/like_tweet_v2", data={"tweetId": tweetId}, method="POST")


@mcp.tool()
def unlike_tweet(tweetId: str) -> dict:
    """⚠️ Unlike a previously liked tweet by its ID."""
    return call("twitter/unlike_tweet_v2", data={"tweetId": tweetId}, method="POST")


@mcp.tool()
def retweet(tweetId: str) -> dict:
    """⚠️ Retweet a tweet by its ID."""
    return call("twitter/retweet_tweet_v2", data={"tweetId": tweetId}, method="POST")


@mcp.tool()
def bookmark_tweet(tweetId: str) -> dict:
    """⚠️ Bookmark a tweet by its ID."""
    return call("twitter/bookmark_tweet_v2", data={"tweetId": tweetId}, method="POST")


@mcp.tool()
def unbookmark_tweet(tweetId: str) -> dict:
    """⚠️ Remove a tweet from bookmarks by its ID."""
    return call("twitter/unbookmark_tweet_v2", data={"tweetId": tweetId}, method="POST")


# ============================================================
# 📚 BOOKMARKS ENDPOINT (1 tool)
# ============================================================

@mcp.tool()
def get_bookmarks(cursor: str = "") -> dict:
    """Get your bookmarked tweets. Supports pagination via cursor."""
    return call("twitter/bookmarks_v2", {"cursor": cursor})


# ============================================================
# 👥 FOLLOW/UNFOLLOW V2 ENDPOINTS (2 tools) — ⚠️ WRITE OPERATIONS
# ============================================================

@mcp.tool()
def follow_user(userId: str) -> dict:
    """⚠️ Follow a user by their userId."""
    return call("twitter/follow_user_v2", data={"userId": userId}, method="POST")


@mcp.tool()
def unfollow_user(userId: str) -> dict:
    """⚠️ Unfollow a user by their userId."""
    return call("twitter/unfollow_user_v2", data={"userId": userId}, method="POST")


# ============================================================
# 💬 DM & MEDIA ENDPOINTS (2 tools) — ⚠️ WRITE OPERATIONS
# ============================================================

@mcp.tool()
def send_dm(receiverId: str, text: str) -> dict:
    """⚠️ Send a direct message to a user by their userId.
    
    Args:
        receiverId: The userId of the recipient (required)
        text: Message text content (required)
    """
    return call("twitter/send_dm_to_user", data={"receiverId": receiverId, "text": text}, method="POST")


@mcp.tool()
def upload_media(media_data: str) -> dict:
    """⚠️ Upload media (image/video) for use in tweets. Provide base64-encoded media data.
    Returns a media_id to use with create_tweet.
    """
    return call("twitter/upload_media_v2", data={"media_data": media_data}, method="POST")


# ============================================================
# 🔐 ACCOUNT/PROFILE ENDPOINTS (5 tools)
# ============================================================

@mcp.tool()
def user_login(username: str, password: str, email: str = "", totp_secret: str = "") -> dict:
    """⚠️ Login to a Twitter account. Returns auth tokens for account-level operations.
    
    Args:
        username: Twitter username (required)
        password: Twitter password (required)
        email: Email associated with account (optional, for verification)
        totp_secret: 2FA TOTP secret if enabled (optional)
    """
    payload = {"username": username, "password": password}
    if email:
        payload["email"] = email
    if totp_secret:
        payload["totp_secret"] = totp_secret
    return call("twitter/user_login_v2", data=payload, method="POST")


@mcp.tool()
def get_my_info() -> dict:
    """Get your own account information (the account linked to the API key)."""
    return call("oapi/my/info")


@mcp.tool()
def update_profile(name: str = "", description: str = "", location: str = "", url: str = "") -> dict:
    """⚠️ Update your Twitter profile information.
    
    Args:
        name: Display name (optional)
        description: Bio text (optional)
        location: Location string (optional)
        url: Website URL (optional)
    """
    payload = {}
    if name:
        payload["name"] = name
    if description:
        payload["description"] = description
    if location:
        payload["location"] = location
    if url:
        payload["url"] = url
    return call("twitter/update_profile_v2", data=payload, method="POST")


@mcp.tool()
def update_avatar(media_data: str) -> dict:
    """⚠️ Update your Twitter profile avatar. Provide base64-encoded image data."""
    return call("twitter/update_avatar_v2", data={"media_data": media_data}, method="POST")


@mcp.tool()
def update_banner(media_data: str) -> dict:
    """⚠️ Update your Twitter profile banner. Provide base64-encoded image data."""
    return call("twitter/update_banner_v2", data={"media_data": media_data}, method="POST")


# ============================================================
# 📋 LIST ENDPOINTS (3 tools)
# ============================================================

@mcp.tool()
def get_list_timeline(listId: str, cursor: str = "") -> dict:
    """Get tweets from a Twitter List timeline. Supports pagination via cursor."""
    return call("twitter/list/tweets_timeline", {"listId": listId, "cursor": cursor})


@mcp.tool()
def get_list_members(listId: str, cursor: str = "") -> dict:
    """Get members of a Twitter List. Supports pagination via cursor."""
    return call("twitter/list/members", {"listId": listId, "cursor": cursor})


@mcp.tool()
def get_list_followers(listId: str, cursor: str = "") -> dict:
    """Get followers of a Twitter List. Supports pagination via cursor."""
    return call("twitter/list/followers", {"listId": listId, "cursor": cursor})


# ============================================================
# 🏘️ COMMUNITY ENDPOINTS (9 tools)
# ============================================================

@mcp.tool()
def get_community_info(communityId: str) -> dict:
    """Get community details by community ID."""
    return call("twitter/community/info", {"communityId": communityId})


@mcp.tool()
def get_community_tweets(communityId: str, cursor: str = "") -> dict:
    """Get tweets from a specific community. Supports pagination via cursor."""
    return call("twitter/community/tweets", {"communityId": communityId, "cursor": cursor})


@mcp.tool()
def get_all_community_tweets(cursor: str = "") -> dict:
    """Get tweets from all communities you're in. Supports pagination via cursor."""
    return call("twitter/community/get_tweets_from_all_community", {"cursor": cursor})


@mcp.tool()
def get_community_members(communityId: str, cursor: str = "") -> dict:
    """Get members of a community. Supports pagination via cursor."""
    return call("twitter/community/members", {"communityId": communityId, "cursor": cursor})


@mcp.tool()
def get_community_moderators(communityId: str, cursor: str = "") -> dict:
    """Get moderators of a community. Supports pagination via cursor."""
    return call("twitter/community/moderators", {"communityId": communityId, "cursor": cursor})


@mcp.tool()
def create_community(name: str, description: str = "") -> dict:
    """⚠️ Create a new Twitter community.
    
    Args:
        name: Community name (required)
        description: Community description (optional)
    """
    payload = {"name": name}
    if description:
        payload["description"] = description
    return call("twitter/create_community_v2", data=payload, method="POST")


@mcp.tool()
def delete_community(communityId: str) -> dict:
    """⚠️ Delete a community by its ID. You must be the community owner."""
    return call("twitter/delete_community_v2", data={"communityId": communityId}, method="POST")


@mcp.tool()
def join_community(communityId: str) -> dict:
    """⚠️ Join a community by its ID."""
    return call("twitter/join_community_v2", data={"communityId": communityId}, method="POST")


@mcp.tool()
def leave_community(communityId: str) -> dict:
    """⚠️ Leave a community by its ID."""
    return call("twitter/leave_community_v2", data={"communityId": communityId}, method="POST")


# ============================================================
# 🌐 SPACES, TRENDS, ARTICLE ENDPOINTS (3 tools)
# ============================================================

@mcp.tool()
def get_space_detail(spaceId: str) -> dict:
    """Get details about a Twitter Space by space ID."""
    return call("twitter/spaces/detail", {"spaceId": spaceId})


@mcp.tool()
def get_trends(woeid: int = 1) -> dict:
    """Get current trending topics on Twitter.
    
    Args:
        woeid: Yahoo Where On Earth ID. 1 = Worldwide (default). Common values:
               23424977 = USA, 23424975 = UK, 23424848 = India, 23424938 = Saudi Arabia
    """
    return call("twitter/trends", {"woeid": woeid})


@mcp.tool()
def get_article(articleId: str) -> dict:
    """Get a Twitter article by its article ID."""
    return call("twitter/article", {"articleId": articleId})


# ============================================================
# 🔔 WEBHOOK / TWEET FILTER ENDPOINTS (4 tools)
# ============================================================

@mcp.tool()
def add_webhook_rule(tag: str, value: str) -> dict:
    """Add a webhook filter rule for real-time tweet streaming.
    
    Args:
        tag: A label/name for this rule (required)
        value: The filter rule value using Twitter filter syntax (required)
              e.g., 'from:elonmusk', '#bitcoin', 'keyword1 keyword2'
    """
    return call("oapi/tweet_filter/add_rule", data={"tag": tag, "value": value}, method="POST")


@mcp.tool()
def get_webhook_rules() -> dict:
    """Get all configured webhook filter rules."""
    return call("oapi/tweet_filter/get_rules")


@mcp.tool()
def update_webhook_rule(ruleId: str, tag: str = "", value: str = "") -> dict:
    """Update an existing webhook filter rule.
    
    Args:
        ruleId: The rule ID to update (required)
        tag: Updated label/name (optional)
        value: Updated filter value (optional)
    """
    payload = {"ruleId": ruleId}
    if tag:
        payload["tag"] = tag
    if value:
        payload["value"] = value
    return call("oapi/tweet_filter/update_rule", data=payload, method="POST")


@mcp.tool()
def delete_webhook_rule(ruleId: str) -> dict:
    """Delete a webhook filter rule by its ID."""
    return call("oapi/tweet_filter/delete_rule", data={"ruleId": ruleId}, method="POST")


# ============================================================
# 📡 MONITOR / USER STREAM ENDPOINTS (3 tools)
# ============================================================

@mcp.tool()
def add_user_to_monitor(userId: str) -> dict:
    """Add a user to the tweet monitoring stream by userId.
    You will receive real-time notifications when this user tweets.
    """
    return call("oapi/x_user_stream/add_user_to_monitor_tweet", data={"userId": userId}, method="POST")


@mcp.tool()
def remove_user_from_monitor(userId: str) -> dict:
    """Remove a user from the tweet monitoring stream by userId."""
    return call("oapi/x_user_stream/remove_user_to_monitor_tweet", data={"userId": userId}, method="POST")


@mcp.tool()
def get_monitored_users() -> dict:
    """Get all users currently being monitored in the tweet stream."""
    return call("oapi/x_user_stream/get_user_to_monitor_tweet")


# ============================================================
# 🚀 SERVER STARTUP
# ============================================================

if __name__ == "__main__":
    mcp.run(transport="streamable-http")
