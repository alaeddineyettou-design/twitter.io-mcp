import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Telegram Twitter Monitor Adder
// Nodes   : 6  |  Connections: 5
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// TelegramTrigger                    telegramTrigger            [creds]
// ExtractUsername                    code
// IfValidUsername                    if
// AddUserToMonitor                   httpRequest
// TelegramConfirmAlert               telegram                   [creds]
// TelegramErrorAlert                 telegram                   [creds]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// TelegramTrigger
//    → ExtractUsername
//      → IfValidUsername
//        → AddUserToMonitor
//          → TelegramConfirmAlert
//       .out(1) → TelegramErrorAlert
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'RtieR0PxOTrwf0P1',
    name: 'Telegram Twitter Monitor Adder',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: false },
})
export class TelegramTwitterMonitorAdderWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '6c0ed956-2504-4cce-9db4-3229db01141f',
        webhookId: '78c9fb15-ad30-4f58-b077-fbe4786f073a',
        name: 'Telegram Trigger',
        type: 'n8n-nodes-base.telegramTrigger',
        version: 1.1,
        position: [100, 300],
        credentials: { telegramApi: { id: '2t0pRriHieDdFngY', name: 'BUY-TOKEN' } },
    })
    TelegramTrigger = {
        updates: ['message'],
        additionalFields: {},
    };

    @node({
        id: '42c7a010-4683-443f-af28-0c5df0066459',
        name: 'Extract Username',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [300, 300],
    })
    ExtractUsername = {
        jsCode: `const message = items[0].json.message || {};
const text = message.text || "";
const chatId = message.chat?.id || "";

// Regex to extract Twitter/X username from links or raw text
// E.g. https://x.com/elonmusk -> elonmusk
const twitterRegex = /(?:https?:\\/\\/(?:twitter|x)\\.com\\/)?@?([a-zA-Z0-9_]{1,15})/i;
const match = text.match(twitterRegex);
const username = match ? match[1] : null;

// Ignore standard command tags
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
        id: 'a1e1f3cd-d81b-465b-aa31-48f4a9490258',
        name: 'If Valid Username',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [500, 300],
    })
    IfValidUsername = {
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
        id: '8b047346-ef06-46ff-b7af-2bb69b49f499',
        name: 'Add User To Monitor',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [700, 200],
    })
    AddUserToMonitor = {
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
        id: 'dc2782ad-1593-4b0d-a14c-622960ced01e',
        webhookId: '58f7d027-3a84-4246-b641-7fdc8b440127',
        name: 'Telegram Confirm Alert',
        type: 'n8n-nodes-base.telegram',
        version: 1.2,
        position: [920, 200],
        credentials: { telegramApi: { id: '2t0pRriHieDdFngY', name: 'BUY-TOKEN' } },
    })
    TelegramConfirmAlert = {
        chatId: '={{ $("Extract Username").item.json.chatId }}',
        text: '=✅ Successfully added @{{ $("Extract Username").item.json.username }} to your Twitter Stream Monitor! 🚀',
        additionalFields: {
            parse_mode: 'HTML',
        },
    };

    @node({
        id: 'db0245aa-0b38-4360-9132-b6ff691f2311',
        webhookId: 'f601f933-d20f-4245-9e41-53b75851f6e8',
        name: 'Telegram Error Alert',
        type: 'n8n-nodes-base.telegram',
        version: 1.2,
        position: [920, 400],
        credentials: { telegramApi: { id: '2t0pRriHieDdFngY', name: 'BUY-TOKEN' } },
    })
    TelegramErrorAlert = {
        chatId: '={{ $("Extract Username").item.json.chatId }}',
        text: '=❌ Could not extract a valid Twitter username from your message. Please send a valid link (e.g., https://x.com/elonmusk).',
        additionalFields: {
            parse_mode: 'HTML',
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.TelegramTrigger.out(0).to(this.ExtractUsername.in(0));
        this.ExtractUsername.out(0).to(this.IfValidUsername.in(0));
        this.IfValidUsername.out(0).to(this.AddUserToMonitor.in(0));
        this.IfValidUsername.out(1).to(this.TelegramErrorAlert.in(0));
        this.AddUserToMonitor.out(0).to(this.TelegramConfirmAlert.in(0));
    }
}
