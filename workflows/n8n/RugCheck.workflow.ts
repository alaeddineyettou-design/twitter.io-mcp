import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : RugCheck
// Nodes   : 29  |  Connections: 16
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// WhenClickingExecuteWorkflow        manualTrigger
// Recent                             httpRequest
// Trending24h                        httpRequest
// HttpRequest                        httpRequest
// HttpRequest1                       httpRequest
// SolWallat                          httpRequest
// TokenReportSummary                 httpRequest
// TokenSummary                       httpRequest
// TokenEligible                      httpRequest
// TokenLpLocker                      httpRequest
// TokenReport1                       httpRequest
// TokenLpFluxLoker                   httpRequest
// IfFluxDoCheckTher                  if
// FormatNumberWithTotalHolder        code
// Key                                set
// JwtExpiresat                       code
// InsiderData                        httpRequest
// HttpRequest2                       httpRequest
// Key1                               set
// JwtExpiresat1                      code
// TokenEligible1                     httpRequest
// TokenReportSummary1                httpRequest
// TokenReport                        httpRequest
// HttpRequest3                       httpRequest
// TokenLpLocker1                     httpRequest
// GetVerifedToken                    httpRequest
// HttpRequest4                       httpRequest
// InsiderData1                       httpRequest                [onError→out(1)] [retry]
// TokenReportSummary2                httpRequest
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// WhenClickingExecuteWorkflow
//    → Key
//      → HttpRequest1
//        → TokenSummary
//        → TokenEligible
//        → TokenReportSummary
//        → TokenLpLocker
//          → IfFluxDoCheckTher
//        → InsiderData
//          → HttpRequest2
//        → TokenReport1
//          → FormatNumberWithTotalHolder
//      → JwtExpiresat
//    → Recent
//    → HttpRequest
//    → SolWallat
// Key1
//    → JwtExpiresat1
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'eZ5YFZQ46ZhZfJMZ6zEAw',
    name: 'RugCheck',
    active: false,
    isArchived: false,
    projectId: 'LbqdeByYTM8pCArF',
    settings: { executionOrder: 'v1', availableInMCP: false, binaryMode: 'separate' },
})
export class RugcheckWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '8c5768af-2e8e-4293-a763-f2f51d04881f',
        name: 'When clicking ‘Execute workflow’',
        type: 'n8n-nodes-base.manualTrigger',
        version: 1,
        position: [-1280, -496],
    })
    WhenClickingExecuteWorkflow = {};

    @node({
        id: 'c3a7725e-7e9b-4856-9e27-4c408d8727ed',
        name: 'Recent',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [-1008, -736],
    })
    Recent = {
        url: 'https://api.rugcheck.xyz/v1/stats/recent',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Accept',
                    value: 'application/json',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '6b278692-bb02-4c7c-a925-dba16cd3182b',
        name: 'Trending 24H',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [-1024, -512],
    })
    Trending24h = {
        url: 'https://api.rugcheck.xyz/v1/stats/trending',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Accept',
                    value: 'application/json',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'be3d1872-ca02-4436-961c-760653744f8e',
        name: 'HTTP Request',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [-1024, -320],
    })
    HttpRequest = {
        url: 'https://api.rugcheck.xyz/v1/stats/verified',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Accept',
                    value: 'application/json',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '65aefcb5-c8da-4e2f-98a8-14421c33c6dd',
        name: 'HTTP Request1',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [-464, -208],
    })
    HttpRequest1 = {
        method: 'POST',
        url: 'https://api.rugcheck.xyz/v1/bulk/tokens/report',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'X-API-KEY',
                    value: '={{ $json.Key.trim() }}',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "mints": [
    "{{ $json.token.trim() }}"
  ]
}`,
        options: {},
    };

    @node({
        id: 'fad25b25-ff0b-41b5-8005-2cc362670ea1',
        name: 'Sol wallat',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [-1024, -144],
    })
    SolWallat = {
        method: 'POST',
        url: 'https://api.mainnet-beta.solana.com',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getBalance",
  "params": [
    "BFK1nKLGRSinqVTKRDP3aogiaBjWRygpfS7hShRQrAm8"
  ]
}`,
        options: {},
    };

    @node({
        id: '681ead94-9797-43f8-96f3-95d04439b4e6',
        name: 'Token Report Summary',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [-192, -560],
    })
    TokenReportSummary = {
        url: "=https://api.rugcheck.xyz/v1/tokens/{{ $('Key').item.json.token.trim() }}/report/summary",
        options: {},
    };

    @node({
        id: 'ed9638a6-b422-4489-b0df-345135ed86f5',
        name: 'Token Summary',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [-192, -32],
    })
    TokenSummary = {
        method: 'POST',
        url: 'https://api.rugcheck.xyz/v1/bulk/tokens/summary',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Authorization',
                    value: "={{ $('Key').item.json.Key }}",
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "cacheOnly": true,
  "tokens": [
  "{{ $('Key').item.json.token.trim() }}"
  ]
} `,
        options: {},
    };

    @node({
        id: 'ca513efa-2f45-49ab-bb51-d7ee19667abf',
        name: 'Token eligible',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [-192, -416],
    })
    TokenEligible = {
        method: 'POST',
        url: 'https://api.rugcheck.xyz/v1/tokens/verify/eligible',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Authorization',
                    value: "={{ $('Key').item.json.Key }}",
                },
            ],
        },
        sendBody: true,
        bodyParameters: {
            parameters: [
                {
                    name: 'mint',
                    value: "={{ $('Key').item.json.token.trim() }}",
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'a7803c22-670f-407f-8bb9-887d95df1b81',
        name: 'Token LP Locker',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [-192, 128],
    })
    TokenLpLocker = {
        url: "=https://api.rugcheck.xyz/v1/tokens/{{ $('Key').item.json.token.trim() }}/lockers",
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Authorization',
                    value: "={{ $('Key').item.json.Key }}",
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'e9e8207f-8884-4cc7-a4cc-1ca12a40b7c0',
        name: 'Token Report1',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [-192, 272],
    })
    TokenReport1 = {
        url: "=https://api.rugcheck.xyz/v1/tokens/{{ $('Key').item.json.token.trim() }}/report",
        options: {},
    };

    @node({
        id: '1a10426b-2ce2-425d-85c4-394b0fa735de',
        name: 'Token LP Flux Loker',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [304, 112],
    })
    TokenLpFluxLoker = {
        url: 'https://api.rugcheck.xyz/v1/tokens/4YiLHDR4B4pE4R5GUMA8HG8YunyeLwcobtEtvwMupump/lockers/flux',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'accept',
                    value: 'application/json',
                },
                {
                    name: 'X-API-KEY',
                    value: 'f83e99c2-8ee5-4359-a2f2-4e0512f0a340',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '82773e92-e84e-4afa-85bc-a78876f59526',
        name: 'If flux do check ther',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [32, 128],
    })
    IfFluxDoCheckTher = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    id: 'fcdab107-e701-4a3b-8d2a-41a8c90a70b0',
                    leftValue: '',
                    rightValue: '',
                    operator: {
                        type: 'string',
                        operation: 'equals',
                        name: 'filter.operator.equals',
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: 'd2ce5ac3-8f22-4881-9332-1b1066e3f829',
        name: 'Format Number with Total Holder',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [16, 272],
    })
    FormatNumberWithTotalHolder = {
        jsCode: `// استقبال بيانات Token Report1
const tokenReport = items[0].json;

// دوال مساعدة للتنسيق
const formatNumber = (num) => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\\.0$/, '') + 'B';
  if (num >= 1000000)    return (num / 1000000).toFixed(1).replace(/\\.0$/, '') + 'M';
  if (num >= 1000)       return (num / 1000).toFixed(1).replace(/\\.0$/, '') + 'K';
  return num.toString();
};

const formatPct = (pct) => {
  return pct.toFixed(1).replace(/\\.0$/, '') + '%';
};

// استخراج معلومات التوكن
const tokenInfo = {
  mint: tokenReport.token?.mint || tokenReport.token,
  name: tokenReport.tokenMeta?.name || 'Unknown',
  symbol: tokenReport.tokenMeta?.symbol || 'Unknown',
  decimals: tokenReport.decimals || 6,
};

// معالجة الحيتان مع تنسيق مختصر + description
const holdersAnalysis = (tokenReport.topHolders || []).map((holder, index) => {
  const uiAmount = parseFloat(holder.uiAmount) || 0;
  const pct = parseFloat(holder.pct) || 0;

  const ownerShort = holder.owner.slice(0, 4) + '...' + holder.owner.slice(-4);
  const uiShort = formatNumber(uiAmount);   // مثال: 127.7M
  const pctShort = formatPct(pct);          // مثال: 12.8%

  return {
    rank: index + 1,
    ownerWallet: holder.owner,
    ownerShort,

    // القيم الأصلية (للحسابات)
    uiAmount: uiAmount,
    percentage: pct,

    // القيم المختصرة (للعرض)
    uiAmountShort: uiShort,                 // "127.7M"
    uiAmountFull: uiAmount.toFixed(1),      // "127736636.0"
    pctShort: pctShort,                     // "12.8%"
    pctRounded: Math.round(pct) + '%',      // "13%"

    // ملخص نصي مختصر (Description)
    description: \`\${ownerShort} holds \${uiShort} (\${pctShort})\`,

    isInsider: holder.insider === true,
    insiderTag: holder.insider ? ' [INSIDER]' : '',
  };
});

// الناتج النهائي
const output = {
  token: tokenInfo,

  // أكبر حوت - تنسيق مختصر
  largestHolder: {
    wallet: holdersAnalysis[0]?.ownerWallet,
    walletShort: holdersAnalysis[0]?.ownerShort,
    amount: holdersAnalysis[0]?.uiAmountShort,      // "127.7M"
    percentage: holdersAnalysis[0]?.pctShort,       // "12.8%"
    display: \`\${holdersAnalysis[0]?.uiAmountShort} (\${holdersAnalysis[0]?.pctShort})\`,  // "127.7M (12.8%)"
    description: holdersAnalysis[0]?.description,   // "ABCD...WXYZ holds 127.7M (12.8%)"
  },

  // قائمة الحيتان بتنسيق مختصر
  holdersShort: holdersAnalysis.map((h) => ({
    rank: h.rank,
    wallet: h.ownerShort,
    amount: h.uiAmountShort,    // "127.7M"
    pct: h.pctShort,            // "12.8%"
    insider: h.isInsider,
    description: h.description, // "ABCD...WXYZ holds 127.7M (12.8%)"
  })),

  // ملخص سريع للمخاطر
  riskSummary: {
    topHolderPct: holdersAnalysis[0]?.pctShort,
    isWhale: (holdersAnalysis[0]?.percentage || 0) > 10,
    riskLevel: (holdersAnalysis[0]?.percentage || 0) > 20 ? 'HIGH' : 'MEDIUM',
  },
};

return [{ json: output }];
`,
    };

    @node({
        id: 'b59a4884-e56a-4ae0-9357-05409af56d48',
        name: 'Key',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-848, 32],
    })
    Key = {
        assignments: {
            assignments: [
                {
                    id: 'da643e49-73d8-4bad-98da-0067bf5fae78',
                    name: 'Key',
                    value: '30a07cd9-01c4-4cf4-895b-5d7a01d2f6f6',
                    type: 'string',
                },
                {
                    id: '99029b5c-aaba-4537-a2c6-5c28c138f2b6',
                    name: 'token',
                    value: 'FJ2Qko2wyHfFLcMfY4nZXPoXEpnUKS7W3GRsnMhkpump',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '34b1851f-226c-477f-8223-c9ee0eae690d',
        name: 'JWT expiresAT',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-592, 32],
    })
    JwtExpiresat = {
        jsCode: `const keyNodeName = 'Key';

// 1) قراءة الـ JWT من Key node (حقل "Key" فيه Bearer ...)
const keyData = $items(keyNodeName)[0].json;
const bearer = keyData.Key; // مثال: "Bearer eyJ..."
if (!bearer) {
  throw new Error('Key field is empty or missing');
}
const token = bearer.replace(/^Bearer\\s+/i, '');

// 2) فك الـ JWT
const parts = token.split('.');
if (parts.length !== 3) {
  throw new Error('Invalid JWT');
}

const payloadB64 = parts[1];

function padBase64(str) {
  return str + '='.repeat((4 - (str.length % 4)) % 4);
}

const payloadJson = Buffer.from(padBase64(payloadB64), 'base64').toString('utf8');
const payload = JSON.parse(payloadJson);

// 3) حساب الوقت
const exp = payload.exp;                      // Unix (seconds)
const nowSec = Math.floor(Date.now() / 1000);
const secondsLeft = exp - nowSec;

// إذا منتهي أصلاً
if (secondsLeft <= 0) {
  return [
    {
      json: {
        token,
        payload,
        exp,
        expiresAtISO: new Date(exp * 1000).toISOString(),
        expired: true,
        message: 'JWT انتهى بالفعل',
      },
    },
  ];
}

// تحويل الباقي إلى أيام / ساعات / دقائق / ثواني
let remaining = secondsLeft;

const days = Math.floor(remaining / (24 * 3600));
remaining -= days * 24 * 3600;

const hours = Math.floor(remaining / 3600);
remaining -= hours * 3600;

const minutes = Math.floor(remaining / 60);
remaining -= minutes * 60;

const seconds = remaining;

// 4) بناء نص عربي واضح
const humanReadable =
  \`ينتهي التوكن في \${new Date(exp * 1000).toISOString()} (UTC).\\n\` +
  \`المتبقي: \${days} يوم, \${hours} ساعة, \${minutes} دقيقة, \${seconds} ثانية.\`;

// يمكنك أيضًا حساب وقت الانتهاء بتوقيت أوروبا/برلين تقريبياً
const expDateLocal = new Date(exp * 1000);
const expiresAtLocal = expDateLocal.toLocaleString('de-DE', {
  timeZone: 'Europe/Berlin',
});

return [
  {
    json: {
      token,
      payload,
      exp,
      expiresAtISO: new Date(exp * 1000).toISOString(), // وقت الانتهاء UTC
      expiresAtLocal,                                   // وقت الانتهاء بتوقيتك (كولن)
      secondsLeft,
      minutesLeft: secondsLeft / 60,
      hoursLeft: secondsLeft / 3600,
      daysLeft: secondsLeft / (24 * 3600),
      days,
      hours,
      minutes,
      seconds,
      humanReadable,
    },
  },
];
`,
    };

    @node({
        id: '5b464bf4-3cae-4174-b98c-ca75cb0dce4d',
        name: 'Insider Data',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [-192, -768],
    })
    InsiderData = {
        url: '=https://api.rugcheck.xyz/v1/tokens/eL5fUxj2J4CiQsmW85k5FG9DvuQjjUoBHoQBi2Kpump/insiders/graph',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'accept',
                    value: 'application/json',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '4a3554ff-c81f-4c62-b7b4-2e9ada60975d',
        name: 'HTTP Request2',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [16, -768],
    })
    HttpRequest2 = {
        url: '=https://solana-gateway.moralis.io/account/mainnet/eL5fUxj2J4CiQsmW85k5FG9DvuQjjUoBHoQBi2Kpump/swaps',
        sendQuery: true,
        queryParameters: {
            parameters: [
                {
                    name: 'limit',
                    value: '25',
                },
                {
                    name: 'order',
                    value: 'DESC',
                },
                {
                    name: 'fromDate',
                    value: '=2025-12-17T00:00:00.000Z',
                },
                {
                    name: 'toDate',
                    value: '={{ $now }}',
                },
                {
                    name: 'transactionTypes',
                    value: 'buy,sell',
                },
                {
                    name: 'tokenAddress',
                    value: 'eL5fUxj2J4CiQsmW85k5FG9DvuQjjUoBHoQBi2Kpump',
                },
            ],
        },
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'accept',
                    value: 'application/json',
                },
                {
                    name: 'X-API-Key',
                    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjY2NzdjZWJkLTI0NmItNDEwNy1hZjkzLTY1MWIwYzRjZTVkNCIsIm9yZ0lkIjoiNDk3Mjk4IiwidXNlcklkIjoiNTExNzI0IiwidHlwZUlkIjoiN2IxYTc1ZWUtMzY0OC00YmE3LTlhNDEtZmIyMmU5NzlhYmI0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Njk2MzA5MjAsImV4cCI6NDkyNTM5MDkyMH0.xBrj6C87ffW8MXrd8PHOk5kvkQCW1llN3EFzgfox7us',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'b3a11707-f3b6-4b82-bcff-2850f99feba6',
        name: 'Key1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-1136, 144],
    })
    Key1 = {
        assignments: {
            assignments: [
                {
                    id: 'da643e49-73d8-4bad-98da-0067bf5fae78',
                    name: 'Key',
                    value: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzEwOTIxMTksImlkIjoiQkZLMW5LTEdSU2lucVZUS1JEUDNhb2dpYUJqV1J5Z3BmUzdoU2hSUXJBbTgifQ.BpcIC5SiD1WwuKVeM1ZsqABTWaVAvd-swWuCD4VwhIA',
                    type: 'string',
                },
                {
                    id: '99029b5c-aaba-4537-a2c6-5c28c138f2b6',
                    name: 'token',
                    value: 'Hoi9Lo8s2PP7EM9mv9bZjQ3aSB7ijyS238sTqQjbpump',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'ed23d03e-b5ce-4f71-bba5-238b6547b408',
        name: 'JWT expiresAT1',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-976, 144],
    })
    JwtExpiresat1 = {
        jsCode: `const keyNodeName = 'Key';

// 1) قراءة الـ JWT من Key node (حقل "Key" فيه Bearer ...)
const keyData = $items(keyNodeName)[0].json;
const bearer = keyData.Key; // مثال: "Bearer eyJ..."
if (!bearer) {
  throw new Error('Key field is empty or missing');
}
const token = bearer.replace(/^Bearer\\s+/i, '');

// 2) فك الـ JWT
const parts = token.split('.');
if (parts.length !== 3) {
  throw new Error('Invalid JWT');
}

const payloadB64 = parts[1];

function padBase64(str) {
  return str + '='.repeat((4 - (str.length % 4)) % 4);
}

const payloadJson = Buffer.from(padBase64(payloadB64), 'base64').toString('utf8');
const payload = JSON.parse(payloadJson);

// 3) حساب الوقت
const exp = payload.exp;                      // Unix (seconds)
const nowSec = Math.floor(Date.now() / 1000);
const secondsLeft = exp - nowSec;

// إذا منتهي أصلاً
if (secondsLeft <= 0) {
  return [
    {
      json: {
        token,
        payload,
        exp,
        expiresAtISO: new Date(exp * 1000).toISOString(),
        expired: true,
        message: 'JWT انتهى بالفعل',
      },
    },
  ];
}

// تحويل الباقي إلى أيام / ساعات / دقائق / ثواني
let remaining = secondsLeft;

const days = Math.floor(remaining / (24 * 3600));
remaining -= days * 24 * 3600;

const hours = Math.floor(remaining / 3600);
remaining -= hours * 3600;

const minutes = Math.floor(remaining / 60);
remaining -= minutes * 60;

const seconds = remaining;

// 4) بناء نص عربي واضح
const humanReadable =
  \`ينتهي التوكن في \${new Date(exp * 1000).toISOString()} (UTC).\\n\` +
  \`المتبقي: \${days} يوم, \${hours} ساعة, \${minutes} دقيقة, \${seconds} ثانية.\`;

// يمكنك أيضًا حساب وقت الانتهاء بتوقيت أوروبا/برلين تقريبياً
const expDateLocal = new Date(exp * 1000);
const expiresAtLocal = expDateLocal.toLocaleString('de-DE', {
  timeZone: 'Europe/Berlin',
});

return [
  {
    json: {
      token,
      payload,
      exp,
      expiresAtISO: new Date(exp * 1000).toISOString(), // وقت الانتهاء UTC
      expiresAtLocal,                                   // وقت الانتهاء بتوقيتك (كولن)
      secondsLeft,
      minutesLeft: secondsLeft / 60,
      hoursLeft: secondsLeft / 3600,
      daysLeft: secondsLeft / (24 * 3600),
      days,
      hours,
      minutes,
      seconds,
      humanReadable,
    },
  },
];
`,
    };

    @node({
        id: '067cd254-0e38-4c53-aad0-d41a83b03aee',
        name: 'Token eligible1',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [176, -48],
    })
    TokenEligible1 = {
        method: 'POST',
        url: 'https://api.rugcheck.xyz/v1/tokens/verify/eligible',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Authorization',
                    value: '=Bearer f83e99c2-8ee5-4359-a2f2-4e0512f0a340',
                },
                {
                    name: 'Content-Type',
                    value: 'application/json',
                },
            ],
        },
        sendBody: true,
        bodyParameters: {
            parameters: [
                {
                    name: 'mint',
                    value: '=7c5gm5fqvQuyteJ9G4pFaubqRVHuegsFXtfHJXBBpump',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '9ac1f93e-bbc7-41dd-afc1-ff1f2c3d2a11',
        name: 'Token Report Summary1',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [176, -208],
    })
    TokenReportSummary1 = {
        url: "=https://api.rugcheck.xyz/v1/tokens/{{ $('Key').item.json.token.trim() }}/report/summary",
        options: {},
    };

    @node({
        id: 'f4febd30-318c-4a2b-ba33-22fc59de1381',
        name: 'Token Report',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [176, -384],
    })
    TokenReport = {
        method: 'POST',
        url: 'https://api.rugcheck.xyz/v1/tokens/k3tctkQRpeJAGTMxg9ohDZ1A5sKfjEajTJLxwCwpump/report?key=30a07cd9-01c4-4cf4-895b-5d7a01d2f6f6',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'X-API-KEY',
                    value: '30a07cd9-01c4-4cf4-895b-5d7a01d2f6f6',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'b2e5517d-21a9-49af-a273-54daea33bb05',
        name: 'HTTP Request3',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [-720, -256],
    })
    HttpRequest3 = {
        method: 'POST',
        url: 'https://mainnet.helius-rpc.com',
        sendQuery: true,
        queryParameters: {
            parameters: [
                {
                    name: 'api-key',
                    value: '665b7c32-6ac9-4017-bb33-f32cc96ca22d',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "getAccountInfo",
  "params": [
    "Fvx8p2MdkeSkj1stBUYiarv48nUJw2JCQc8VqHZ25pn4",
    {"encoding": "jsonParsed"}
  ]
}
`,
        options: {},
    };

    @node({
        id: 'ac804f66-0340-4214-ac73-a5f9207a8c56',
        name: 'Token LP Locker1',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [416, -464],
    })
    TokenLpLocker1 = {
        url: 'https://api.rugcheck.xyz/v1/stats/trending',
        options: {},
    };

    @node({
        id: '64a77ddb-93a6-4184-be73-455ecaa19053',
        name: 'Get Verifed token',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [-144, -240],
    })
    GetVerifedToken = {
        url: 'https://api.rugcheck.xyz/v1/stats/verified',
        options: {},
    };

    @node({
        id: 'fbdd1f7e-764a-4e47-b855-33ce1ffd42a0',
        name: 'HTTP Request4',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [-1552, -128],
    })
    HttpRequest4 = {
        method: 'POST',
        url: 'https://api.rugcheck.xyz/v1/tokens/verify',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'X-API-KEY',
                    value: 'YOUR_API_KEY',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `{
  "mint": "TokenMintAddress",
  "payer": "PayerAddress",
  "signature": "TransactionSignature",
  "data": {
    "solDomain": "mytoken.token",
    "description": "My amazing token",
    "termsAccepted": true,
    "dataIntegrityAccepted": true
  }
}`,
        options: {},
    };

    @node({
        id: 'f9cb4e97-6c18-4a5f-8074-1964b94430e7',
        name: 'Insider Data1',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [-560, 416],
        onError: 'continueErrorOutput',
        retryOnFail: true,
        waitBetweenTries: 2000,
    })
    InsiderData1 = {
        url: '=https://api.rugcheck.xyz/v1/tokens/5z5npiRKKhHM12kbZGAPs5YQNSm8VLPJb8ggdSAWpump/insiders/graph',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'accept',
                    value: 'application/json',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '3dd2c76a-23d3-402b-8bc5-2b042d79332a',
        name: 'Token Report Summary2',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [400, -624],
    })
    TokenReportSummary2 = {
        url: '=https://api.rugcheck.xyz/v1/tokens/2ayDAJoiYd5nRkMoWaZeQ9vUiGjcmQazkQFkFMrTpump/report/summary',
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.WhenClickingExecuteWorkflow.out(0).to(this.Key.in(0));
        this.WhenClickingExecuteWorkflow.out(0).to(this.Recent.in(0));
        this.WhenClickingExecuteWorkflow.out(0).to(this.HttpRequest.in(0));
        this.WhenClickingExecuteWorkflow.out(0).to(this.SolWallat.in(0));
        this.HttpRequest1.out(0).to(this.TokenSummary.in(0));
        this.HttpRequest1.out(0).to(this.TokenEligible.in(0));
        this.HttpRequest1.out(0).to(this.TokenReportSummary.in(0));
        this.HttpRequest1.out(0).to(this.TokenLpLocker.in(0));
        this.HttpRequest1.out(0).to(this.InsiderData.in(0));
        this.HttpRequest1.out(0).to(this.TokenReport1.in(0));
        this.TokenLpLocker.out(0).to(this.IfFluxDoCheckTher.in(0));
        this.TokenReport1.out(0).to(this.FormatNumberWithTotalHolder.in(0));
        this.Key.out(0).to(this.HttpRequest1.in(0));
        this.Key.out(0).to(this.JwtExpiresat.in(0));
        this.InsiderData.out(0).to(this.HttpRequest2.in(0));
        this.Key1.out(0).to(this.JwtExpiresat1.in(0));
    }
}
