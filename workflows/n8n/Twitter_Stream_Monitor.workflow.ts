import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Twitter Stream Monitor (Solana & Memecoins)
// Nodes   : 10  |  Connections: 9
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
// FetchDexscreenerInfo               httpRequest                [onError→regular]
// FormatTelegramAlert                set
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
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'H3kuD1wdqdjo2hZM',
    name: 'Twitter Stream Monitor (Solana & Memecoins)',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false },
})
export class TwitterStreamMonitorSolanaMemecoinsWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '25c86422-517c-409b-a029-e56950563363',
        name: 'Trigger Manual Execution',
        type: 'n8n-nodes-base.manualTrigger',
        version: 1,
        position: [-400, -200],
    })
    TriggerManualExecution = {};

    @node({
        id: '5c4db752-a417-4f7d-b150-c73af71a85f6',
        name: 'Setup Twitter Credentials',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-200, -200],
    })
    SetupTwitterCredentials = {
        assignments: {
            assignments: [
                {
                    id: 'apikey-id',
                    name: 'X_API_KEY',
                    value: 'new1_c84536b2f31c4ec79e20cd49b4ef029e',
                    type: 'string',
                },
                {
                    id: 'tag-id',
                    name: 'tag',
                    value: 'solana-kols',
                    type: 'string',
                },
                {
                    id: 'rule-value-id',
                    name: 'rule_value',
                    value: 'from:ansem OR from:cobie OR from:solana OR from:pumpdotfun',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '2d7592f3-1148-46e9-a49e-a55f09156404',
        name: 'Get Monitored Users List',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [80, -320],
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
        id: '36dc3757-49d2-404f-a348-874d0ceb5bb3',
        name: 'Add Twitter Monitor Rule',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [80, -120],
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
        id: '00744c30-a45b-42e3-8d40-7396bd3f0256',
        name: 'Activate Twitter Monitor Rule',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [300, -120],
    })
    ActivateTwitterMonitorRule = {
        method: 'POST',
        url: 'https://api.twitterapi.io/oapi/tweet_filter/update_rule',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'X-API-Key',
                    value: '={{ $parent.item.json.X_API_KEY }}',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "rule_id": "{{ $json.rule_id }}",
  "tag": "{{ $parent.item.json.tag }}",
  "value": "{{ $parent.item.json.rule_value }}",
  "interval_seconds": 30,
  "is_effect": 1
}`,
        options: {},
    };

    @node({
        id: '24d4d5e9-2618-44f6-b626-c5dfd5066a23',
        webhookId: 'de46a13e-1615-4748-8963-eee3618a1c8f',
        name: 'Tweet Webhook Receiver',
        type: 'n8n-nodes-base.webhook',
        version: 1,
        position: [-400, 200],
    })
    TweetWebhookReceiver = {
        path: 'twitter-stream',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        options: {},
    };

    @node({
        id: '26ee909b-2e44-441f-8e5e-46f5ce249f24',
        name: 'Extract Solana Token',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-200, 200],
    })
    ExtractSolanaToken = {
        jsCode: `// Extract the tweet text from the incoming Webhook body
const payload = items[0].json.body || {};

// Handle both direct and nested formats from twitterapi.io stream
const tweetText = payload.text || payload.tweet?.text || "";
const user = payload.user?.screen_name || payload.tweet?.user?.screen_name || "Unknown";
const name = payload.user?.name || payload.tweet?.user?.name || "Unknown";
const idStr = payload.id_str || payload.tweet?.id_str || "";

// Regex for Solana mint address (base58 format, length 32-44)
const solanaRegex = /\\b[1-9A-HJ-NP-Za-km-z]{32,44}\\b/g;
const matches = tweetText.match(solanaRegex) || [];

// Exclude false positives (common words or other known non-mint patterns if any)
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
        id: '6c324751-7887-4bf7-8ada-084f793a2cbd',
        name: 'If Token Found',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [20, 200],
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
                    id: 'token-found-cond',
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
        id: 'a1d2ba61-9c30-4201-9c52-00bd3dfe29b0',
        name: 'Fetch DexScreener Info',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [240, 100],
        onError: 'continueRegularOutput',
    })
    FetchDexscreenerInfo = {
        url: '=https://api.dexscreener.com/latest/dex/tokens/{{ $json.firstMint }}',
        options: {},
    };

    @node({
        id: '0f5d8ea6-2bd0-46ab-90ec-a12977ef729c',
        name: 'Format Telegram Alert',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [480, 200],
    })
    FormatTelegramAlert = {
        assignments: {
            assignments: [
                {
                    id: 'alert-title',
                    name: 'alert_title',
                    value: '=🚨 NEW TWEET FROM @{{ $("Extract Solana Token").item.json.user }}',
                    type: 'string',
                },
                {
                    id: 'alert-body',
                    name: 'alert_message',
                    value: `=🐦 Author: {{ $("Extract Solana Token").item.json.name }} (@{{ $("Extract Solana Token").item.json.user }})
💬 Text: {{ $("Extract Solana Token").item.json.tweetText }}

🔗 Link: {{ $("Extract Solana Token").item.json.tweetUrl }}

{{ $("Extract Solana Token").item.json.tokenFound ? "🪙 Solana Token Detected: " + $("Extract Solana Token").item.json.firstMint : "" }}
{{ $json.pairs && $json.pairs[0] ? "\\n📊 DexScreener Stats:\\n- Pair: " + $json.pairs[0].baseToken.symbol + "/" + $json.pairs[0].quoteToken.symbol + "\\n- Price USD: $" + $json.pairs[0].priceUsd + "\\n- Liquidity: $" + $json.pairs[0].liquidity.usd.toLocaleString() + "\\n- 24h Volume: $" + $json.pairs[0].volume.h24.toLocaleString() + "\\n- Chart: " + $json.pairs[0].url : "" }}`,
                    type: 'string',
                },
            ],
        },
        options: {},
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
    }
}
