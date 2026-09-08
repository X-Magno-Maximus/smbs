// Illustrative fixtures only. Never use this dataset for authorization.
window.MarxiaSettingsSample={
  "approvals": [
    {
      "change": "IT SuperUser access",
      "id": "APR-001",
      "personId": "mateo",
      "requesterId": "ana",
      "status": "Pending approval"
    },
    {
      "change": "Management Admin access",
      "id": "APR-002",
      "personId": "sofia",
      "requesterId": "lucia",
      "status": "Pending approval"
    },
    {
      "change": "Promotion to Supervisor",
      "id": "APR-003",
      "personId": "luis",
      "requesterId": "ana",
      "status": "Pending approval"
    }
  ],
  "asOf": "2026-09-08",
  "audit": [
    {
      "id": "EVT-001",
      "personId": "ana",
      "date": "2026-09-08",
      "time": "10:00 UTC−05:00",
      "event": "Sample role assignment",
      "result": "Approved"
    },
    {
      "id": "EVT-002",
      "personId": "isaac",
      "date": "2026-09-08",
      "time": "10:04 UTC−05:00",
      "event": "Sample role assignment",
      "result": "Approved"
    },
    {
      "id": "EVT-003",
      "personId": "luis",
      "date": "2026-09-08",
      "time": "10:08 UTC−05:00",
      "event": "Sample role assignment",
      "result": "Approved"
    },
    {
      "id": "EVT-004",
      "personId": "maria",
      "date": "2026-09-08",
      "time": "10:12 UTC−05:00",
      "event": "Sample role assignment",
      "result": "Approved"
    },
    {
      "id": "EVT-005",
      "personId": "carlos",
      "date": "2026-09-08",
      "time": "10:16 UTC−05:00",
      "event": "Sample role assignment",
      "result": "Approved"
    },
    {
      "id": "EVT-006",
      "personId": "diego",
      "date": "2026-09-08",
      "time": "10:20 UTC−05:00",
      "event": "Sample role assignment",
      "result": "Approved"
    },
    {
      "id": "EVT-007",
      "personId": "lucia",
      "date": "2026-09-08",
      "time": "10:24 UTC−05:00",
      "event": "Sample role assignment",
      "result": "Approved"
    },
    {
      "id": "EVT-008",
      "personId": "pedro",
      "date": "2026-09-08",
      "time": "10:28 UTC−05:00",
      "event": "Sample role assignment",
      "result": "Approved"
    },
    {
      "id": "EVT-009",
      "personId": "rosa",
      "date": "2026-09-08",
      "time": "10:32 UTC−05:00",
      "event": "Sample role assignment",
      "result": "Approved"
    },
    {
      "id": "EVT-010",
      "personId": "mateo",
      "approvalId": "APR-001",
      "date": "2026-09-08",
      "time": "11:00 UTC−05:00",
      "event": "IT SuperUser access",
      "result": "Pending approval"
    },
    {
      "id": "EVT-011",
      "personId": "sofia",
      "approvalId": "APR-002",
      "date": "2026-09-08",
      "time": "11:05 UTC−05:00",
      "event": "Management Admin access",
      "result": "Pending approval"
    },
    {
      "id": "EVT-012",
      "personId": "luis",
      "approvalId": "APR-003",
      "date": "2026-09-08",
      "time": "11:10 UTC−05:00",
      "event": "Promotion to Supervisor",
      "result": "Pending approval"
    }
  ],
  "business": {
    "address": "Sample business address, Quito, Ecuador",
    "email": "owner@example.com",
    "name": "Cacao & Más — Sample",
    "phone": "",
    "taxId": "SAMPLE-NOT-VALID"
  },
  "people": [
    {
      "active": true,
      "activity": {
        "branch": "Quito",
        "device": "Desktop / Edge",
        "lastLogin": "2026-09-08 08:00 UTC−05:00",
        "location": "Quito, Ecuador",
        "session": "Active"
      },
      "address": "Sample address — Quito",
      "branch": "Quito",
      "email": "ana@example.com",
      "firstName": "Ana",
      "id": "ana",
      "job": "Operations management",
      "lastName": "Pérez",
      "permissions": {
        "Inventory": [
          "Read"
        ],
        "Orders": [
          "Read",
          "Write",
          "Approve"
        ],
        "Overview": [
          "Read"
        ],
        "Reports": [
          "Read"
        ]
      },
      "phone": "",
      "position": "Manager",
      "status": "Active"
    },
    {
      "active": true,
      "activity": {
        "branch": "Quito",
        "device": "Tablet / Chrome",
        "lastLogin": "2026-09-08 08:05 UTC−05:00",
        "location": "Quito, Ecuador",
        "session": "Signed out"
      },
      "address": "Sample address — Quito",
      "branch": "Quito",
      "email": "isaac@example.com",
      "firstName": "Isaac",
      "id": "isaac",
      "job": "Inventory supervision",
      "lastName": "Silva",
      "permissions": {
        "Inventory": [
          "Read",
          "Write",
          "Approve"
        ],
        "Products": [
          "Read"
        ],
        "Reports": [
          "Read"
        ]
      },
      "phone": "",
      "position": "Supervisor",
      "status": "Active"
    },
    {
      "active": true,
      "activity": {
        "branch": "Quito",
        "device": "Tablet / Chrome",
        "lastLogin": "2026-09-08 08:10 UTC−05:00",
        "location": "Quito, Ecuador",
        "session": "Signed out"
      },
      "address": "Sample address — Quito",
      "branch": "Quito",
      "email": "luis@example.com",
      "firstName": "Luis",
      "id": "luis",
      "job": "Order taking and fulfillment",
      "lastName": "Mora",
      "permissions": {
        "Logistics": [
          "Read"
        ],
        "Orders": [
          "Read",
          "Write"
        ]
      },
      "phone": "",
      "position": "Employee / Staff",
      "status": "Active"
    },
    {
      "active": true,
      "activity": {
        "branch": "Guayaquil",
        "device": "Desktop / Chrome",
        "lastLogin": "2026-09-08 08:15 UTC−05:00",
        "location": "Guayaquil, Ecuador",
        "session": "Active"
      },
      "address": "Sample address — Guayaquil",
      "branch": "Guayaquil",
      "email": "maria@example.com",
      "firstName": "María",
      "id": "maria",
      "job": "Customer orders",
      "lastName": "López",
      "permissions": {
        "Orders": [
          "Read",
          "Write"
        ],
        "Products": [
          "Read"
        ]
      },
      "phone": "",
      "position": "Employee / Staff",
      "status": "Active"
    },
    {
      "active": true,
      "activity": {
        "branch": "Guayaquil",
        "device": "Mobile / Chrome",
        "lastLogin": "2026-09-08 08:20 UTC−05:00",
        "location": "Guayaquil, Ecuador",
        "session": "Signed out"
      },
      "address": "Sample address — Guayaquil",
      "branch": "Guayaquil",
      "email": "carlos@example.com",
      "firstName": "Carlos",
      "id": "carlos",
      "job": "Assigned deliveries",
      "lastName": "Vega",
      "permissions": {
        "Logistics": [
          "Read",
          "Write"
        ]
      },
      "phone": "",
      "position": "Independent contractor",
      "status": "Active"
    },
    {
      "active": false,
      "activity": {
        "branch": "Quito",
        "device": null,
        "lastLogin": null,
        "location": null,
        "session": "No session"
      },
      "address": "Sample address — Quito",
      "branch": "Quito",
      "email": "elena@example.com",
      "firstName": "Elena",
      "id": "elena",
      "job": "Product catalog",
      "lastName": "Ruiz",
      "permissions": {},
      "phone": "",
      "position": "Employee / Staff",
      "status": "Invited"
    },
    {
      "active": true,
      "activity": {
        "branch": "Quito",
        "device": "Desktop / Edge",
        "lastLogin": "2026-09-08 09:30 UTC−05:00",
        "location": "Quito, Ecuador",
        "session": "Active"
      },
      "address": "Sample address — Quito",
      "branch": "Quito",
      "email": "diego@example.com",
      "firstName": "Diego",
      "id": "diego",
      "job": "Accounting reconciliation",
      "lastName": "Paz",
      "permissions": {
        "Accounting": [
          "Read",
          "Write"
        ],
        "Reports": [
          "Read"
        ]
      },
      "phone": "",
      "position": "Employee / Staff",
      "status": "Active"
    },
    {
      "active": true,
      "activity": {
        "branch": "Quito",
        "device": "Desktop / Edge",
        "lastLogin": "2026-09-08 09:35 UTC−05:00",
        "location": "Quito, Ecuador",
        "session": "Signed out"
      },
      "address": "Sample address — Quito",
      "branch": "Quito",
      "email": "lucia@example.com",
      "firstName": "Lucía",
      "id": "lucia",
      "job": "Business oversight",
      "lastName": "Torres",
      "permissions": {
        "Accounting": [
          "Read"
        ],
        "Orders": [
          "Read"
        ],
        "Overview": [
          "Read"
        ],
        "Reports": [
          "Read",
          "Audit"
        ]
      },
      "phone": "",
      "position": "Director",
      "status": "Active"
    },
    {
      "active": true,
      "activity": {
        "branch": "Guayaquil",
        "device": "Desktop / Chrome",
        "lastLogin": "2026-09-08 09:40 UTC−05:00",
        "location": "Guayaquil, Ecuador",
        "session": "Signed out"
      },
      "address": "Sample address — Guayaquil",
      "branch": "Guayaquil",
      "email": "pedro@example.com",
      "firstName": "Pedro",
      "id": "pedro",
      "job": "Branch operations",
      "lastName": "Vera",
      "permissions": {
        "Logistics": [
          "Read",
          "Approve"
        ],
        "Orders": [
          "Read",
          "Approve"
        ],
        "Overview": [
          "Read"
        ],
        "Reports": [
          "Read"
        ]
      },
      "phone": "",
      "position": "Manager",
      "status": "Active"
    },
    {
      "active": true,
      "activity": {
        "branch": "Guayaquil",
        "device": "Tablet / Chrome",
        "lastLogin": "2026-09-08 09:45 UTC−05:00",
        "location": "Guayaquil, Ecuador",
        "session": "Active"
      },
      "address": "Sample address — Guayaquil",
      "branch": "Guayaquil",
      "email": "rosa@example.com",
      "firstName": "Rosa",
      "id": "rosa",
      "job": "Dispatch supervision",
      "lastName": "Castro",
      "permissions": {
        "Logistics": [
          "Read",
          "Write",
          "Approve"
        ],
        "Orders": [
          "Read"
        ]
      },
      "phone": "",
      "position": "Supervisor",
      "status": "Active"
    },
    {
      "active": false,
      "activity": {
        "branch": "Quito",
        "device": null,
        "lastLogin": null,
        "location": null,
        "session": "No session"
      },
      "address": "Sample address — Quito",
      "branch": "Quito",
      "email": "mateo@example.com",
      "firstName": "Mateo",
      "id": "mateo",
      "job": "Time-limited technical support",
      "lastName": "Ruiz",
      "permissions": {},
      "phone": "",
      "position": "IT SuperUser",
      "status": "Pending approval"
    },
    {
      "active": false,
      "activity": {
        "branch": "Quito",
        "device": null,
        "lastLogin": null,
        "location": null,
        "session": "No session"
      },
      "address": "Sample address — Quito",
      "branch": "Quito",
      "email": "sofia@example.com",
      "firstName": "Sofía",
      "id": "sofia",
      "job": "Access administration",
      "lastName": "León",
      "permissions": {},
      "phone": "",
      "position": "Management Admin",
      "status": "Pending approval"
    }
  ],
  "sample": true
};
