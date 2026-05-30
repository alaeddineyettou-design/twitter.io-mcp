import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Untitled-1780166912451
// Nodes   : 16  |  Connections: 14
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// TriggerManualExecution             manualTrigger
// SetupTwitterCredentials            set
// GetMonitoredUsersList              httpRequest
// AddTwitterMonitorRule              httpRequest
// ActivateTwitterMonitorRule         httpRequest
// TweetWebhookReceiver               webhook
// ExtractSolanaToken                 code
// IfTokenFound                       if
// FetchDexscreenerInfo               httpRequest
// FormatTelegramAlert                set
// TelegramTwitterMonitor             telegramTrigger            [creds]
// ExtractTelegramHandle              code
// IfValidHandle                      if
// AddUserToMonitorStream             httpRequest
// TelegramConfirmAdd                 telegram                   [creds]
// TelegramErrorAdd                   telegram                   [creds]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// TriggerManualExecution
//    → SetupTwitterCredentials
//      → GetMonitoredUsersList
//      → AddTwitterMonitorRule
//        → ActivateTwitterMonitorRule
// TweetWebhookReceiver
//    → ExtractSolanaToken
//      → IfTokenFound
//        → FetchDexscreenerInfo
//          → FormatTelegramAlert
//       .out(1) → FormatTelegramAlert (↩ loop)
// TelegramTwitterMonitor
//    → ExtractTelegramHandle
//      → IfValidHandle
//        → AddUserToMonitorStream
//          → TelegramConfirmAdd
//       .out(1) → TelegramErrorAdd
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'QWmr4ySpKdC7gmGO',
    name: 'Untitled-1780166912451',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: false },
})
export class Untitled1780166912451Workflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'trigger-manual-execution-id',
        name: 'Trigger Manual Execution',
        type: 'n8n-nodes-base.manualTrigger',
        version: 1,
        position: [-400, -16],
    })
    TriggerManualExecution = {};

    @node({
        id: 'setup-twitter-creds-id',
        name: 'Setup Twitter Credentials',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-208, -16],
    })
    SetupTwitterCredentials = {
        assignments: {
            assignments: [
                {
                    id: 'apikey-assignment',
                    name: 'X_API_KEY',
                    value: 'new1_c84536b2f31c4ec79e20cd49b4ef029e',
                    type: 'string',
                },
                {
                    id: 'tag-assignment',
                    name: 'tag',
                    value: 'solana-kols',
                    type: 'string',
                },
                {
                    id: 'rule-assignment',
                    name: 'rule_value',
                    value: 'from:ansem OR from:cobie OR from:solana OR from:pumpdotfun',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'get-monitored-users-id',
        name: 'Get Monitored Users List',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.1,
        position: [80, -128],
    })
    GetMonitoredUsersList = {
        url: 'https://api.twitterapi.io/oapi/x_user_stream/get_user_to_monitor_tweet',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'X-API-Key',
                    value: '={{ $json.X_API_KEY }}',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'add-twitter-rule-id',
        name: 'Add Twitter Monitor Rule',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.1,
        position: [80, 64],
    })
    AddTwitterMonitorRule = {
        method: 'POST',
        url: 'https://api.twitterapi.io/oapi/tweet_filter/add_rule',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'X-API-Key',
                    value: '={{ $json.X_API_KEY }}',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "tag": "{{ $json.tag }}",
  "value": "{{ $json.rule_value }}",
  "interval_seconds": 30
}`,
        options: {},
    };

    @node({
        id: 'activate-twitter-rule-id',
        name: 'Activate Twitter Monitor Rule',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.1,
        position: [304, 64],
    })
    ActivateTwitterMonitorRule = {
        method: 'POST',
        url: 'https://api.twitterapi.io/oapi/tweet_filter/update_rule',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'X-API-Key',
                    value: "={{ $('Setup Twitter Credentials').item.json.X_API_KEY }}",
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "rule_id": "{{ $json.rule_id }}",
  "tag": "{{ $('Setup Twitter Credentials').item.json.tag }}",
  "value": "{{ $('Setup Twitter Credentials').item.json.rule_value }}",
  "interval_seconds": 30,
  "is_effect": 1
}`,
        options: {},
    };

    @node({
        id: 'tweet-webhook-receiver-id',
        webhookId: 'c96fd413-c9f1-4d55-ab48-540e395ab180',
        name: 'Tweet Webhook Receiver',
        type: 'n8n-nodes-base.webhook',
        version: 1,
        position: [-400, 256],
    })
    TweetWebhookReceiver = {
        path: 'twitter-stream',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        options: {},
    };

    @node({
        id: 'extract-solana-token-id',
        name: 'Extract Solana Token',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-208, 256],
    })
    ExtractSolanaToken = {
        jsCode: `// Extract the tweet text from the incoming Webhook body
const payload = items[0].json.body || {};

// Handle both direct and nested formats from twitterapi.io stream
const tweetText = payload.text || payload.tweet?.text || "";
const user = payload.user?.screen_name || payload.tweet?.user?.screen_name || "Unknown";
const name = payload.user?.name || payload.tweet?.name || "Unknown";
const idStr = payload.id_str || payload.tweet?.id_str || "";

// Regex for Solana mint address (base58 format, length 32-44)
const solanaRegex = /\\b[1-9A-HJ-NP-Za-km-z]{32,44}\\b/g;
const matches = tweetText.match(solanaRegex) || [];

// Exclude false positives
const uniqueMints = [...new Set(matches)];

return [{
  json: {
    rawPayload: payload,
    tweetText,
    user,
    name,
    tweetUrl: \`https://x.com/\${user}/status/\${idStr}\`,
    mints: uniqueMints,
    tokenFound: uniqueMints.length > 0,
    firstMint: uniqueMints[0] || null
  }
}];`,
    };

    @node({
        id: 'if-token-found-id',
        name: 'If Token Found',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [32, 256],
    })
    IfTokenFound = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    id: 'cond-token-found',
                    leftValue: '={{ $json.tokenFound }}',
                    rightValue: 'true',
                    operator: {
                        type: 'boolean',
                        operation: 'equal',
                        name: 'filter.operator.equal',
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: 'fetch-dexscreener-info-id',
        name: 'Fetch DexScreener Info',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.1,
        position: [240, 160],
    })
    FetchDexscreenerInfo = {
        url: '=https://api.dexscreener.com/latest/dex/tokens/{{ $json.firstMint }}',
        options: {},
    };

    @node({
        id: 'format-telegram-alert-id',
        name: 'Format Telegram Alert',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [480, 256],
    })
    FormatTelegramAlert = {
        assignments: {
            assignments: [
                {
                    id: 'telegram-alert-title',
                    name: 'alert_title',
                    value: "=🚨 NEW TWEET FROM @{{ $('Extract Solana Token').item.json.user }}",
                    type: 'string',
                },
                {
                    id: 'telegram-alert-msg',
                    name: 'alert_message',
                    value: `=🐦 Author: {{ $('Extract Solana Token').item.json.name }} (@{{ $('Extract Solana Token').item.json.user }})
💬 Text: {{ $('Extract Solana Token').item.json.tweetText }}

🔗 Link: {{ $('Extract Solana Token').item.json.tweetUrl }}

{{ $('Extract Solana Token').item.json.tokenFound ? "🪙 Solana Token Detected: " + $('Extract Solana Token').item.json.firstMint : "" }}
{{ $json.pairs && $json.pairs[0] ? "\\n📊 DexScreener Stats:\\n- Pair: " + $json.pairs[0].baseToken.symbol + "/" + $json.pairs[0].quoteToken.symbol + "\\n- Price USD: $" + $json.pairs[0].priceUsd + "\\n- Liquidity: $" + $json.pairs[0].liquidity.usd.toLocaleString() + "\\n- 24h Volume: $" + $json.pairs[0].volume.h24.toLocaleString() + "\\n- Chart: " + $json.pairs[0].url : "" }}`,
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '86b1fbb4-32db-4fa6-add6-c6ca68014c19',
        webhookId: '62aed72f-35c9-4755-be1b-7971f34ab36d',
        name: 'Telegram Twitter Monitor',
        type: 'n8n-nodes-base.telegramTrigger',
        version: 1.3,
        position: [-432, -256],
        credentials: { telegramApi: { id: 'MwYIbmO61cjEu6oe', name: 'Telegram account 2' } },
    })
    TelegramTwitterMonitor = {
        updates: ['message'],
        additionalFields: {},
    };

    @node({
        id: 'extract-telegram-handle-id',
        name: 'Extract Telegram Handle',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-208, -256],
    })
    ExtractTelegramHandle = {
        jsCode: `const message = items[0].json.message || {};
const text = message.text || "";
const chatId = message.chat?.id || "";

// Regex to extract Twitter/X username from links or raw text
const twitterRegex = /(?:https?:\\/\\/(?:twitter|x)\\.com\\/)?@?([a-zA-Z0-9_]{1,15})/i;
const match = text.match(twitterRegex);
const username = match ? match[1] : null;

const ignored = ["start", "help", "settings"];
const isValid = username && !ignored.includes(username.toLowerCase());

return [{
  json: {
    text,
    chatId,
    username,
    isValid: !!isValid
  }
}];`,
    };

    @node({
        id: 'if-valid-handle-id',
        name: 'If Valid Handle',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [32, -256],
    })
    IfValidHandle = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    id: 'valid-cond',
                    leftValue: '={{ $json.isValid }}',
                    rightValue: 'true',
                    operator: {
                        type: 'boolean',
                        operation: 'equal',
                        name: 'filter.operator.equal',
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: 'add-user-to-monitor-id',
        name: 'Add User to Monitor Stream',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.1,
        position: [240, -352],
    })
    AddUserToMonitorStream = {
        method: 'POST',
        url: 'https://api.twitterapi.io/oapi/x_user_stream/add_user_to_monitor_tweet',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'X-API-Key',
                    value: 'new1_c84536b2f31c4ec79e20cd49b4ef029e',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "x_user_name": "{{ $json.username }}"
}`,
        options: {},
    };

    @node({
        id: 'telegram-confirm-add-id',
        webhookId: '0fba3ac7-0628-4a60-8c95-abb97d164266',
        name: 'Telegram Confirm Add',
        type: 'n8n-nodes-base.telegram',
        version: 1.2,
        position: [480, -352],
        credentials: { telegramApi: { id: 'MwYIbmO61cjEu6oe', name: 'Telegram account 2' } },
    })
    TelegramConfirmAdd = {
        chatId: '={{ $("Extract Telegram Handle").item.json.chatId }}',
        text: '=✅ Successfully added @{{ $("Extract Telegram Handle").item.json.username }} to your Twitter Stream Monitor! 🚀',
        additionalFields: {
            parse_mode: 'HTML',
        },
    };

    @node({
        id: 'telegram-error-add-id',
        webhookId: 'b323145a-517f-4497-8306-a2bb5843c33f',
        name: 'Telegram Error Add',
        type: 'n8n-nodes-base.telegram',
        version: 1.2,
        position: [480, -160],
        credentials: { telegramApi: { id: 'MwYIbmO61cjEu6oe', name: 'Telegram account 2' } },
    })
    TelegramErrorAdd = {
        chatId: '={{ $("Extract Telegram Handle").item.json.chatId }}',
        text: '=❌ Could not extract a valid Twitter username from your message. Please send a valid Twitter URL (e.g., https://x.com/elonmusk).',
        additionalFields: {
            parse_mode: 'HTML',
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.TriggerManualExecution.out(0).to(this.SetupTwitterCredentials.in(0));
        this.SetupTwitterCredentials.out(0).to(this.GetMonitoredUsersList.in(0));
        this.SetupTwitterCredentials.out(0).to(this.AddTwitterMonitorRule.in(0));
        this.AddTwitterMonitorRule.out(0).to(this.ActivateTwitterMonitorRule.in(0));
        this.TweetWebhookReceiver.out(0).to(this.ExtractSolanaToken.in(0));
        this.ExtractSolanaToken.out(0).to(this.IfTokenFound.in(0));
        this.IfTokenFound.out(0).to(this.FetchDexscreenerInfo.in(0));
        this.IfTokenFound.out(1).to(this.FormatTelegramAlert.in(0));
        this.FetchDexscreenerInfo.out(0).to(this.FormatTelegramAlert.in(0));
        this.TelegramTwitterMonitor.out(0).to(this.ExtractTelegramHandle.in(0));
        this.ExtractTelegramHandle.out(0).to(this.IfValidHandle.in(0));
        this.IfValidHandle.out(0).to(this.AddUserToMonitorStream.in(0));
        this.IfValidHandle.out(1).to(this.TelegramErrorAdd.in(0));
        this.AddUserToMonitorStream.out(0).to(this.TelegramConfirmAdd.in(0));
    }
}
