src/
├── app/                        # Dedicated Routes & Pages Only
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── customers/
│   │   └── page.tsx
│   └── orders/
│       └── page.tsx
│
├── components/                 # UI Components Layer
│   ├── common/                 # Reusable (Har jagah use hone wale)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Table.tsx
│   │
│   ├── layout/                 # Main App Structure Components
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   │
│   └── modules/                # Page-Specific Components (Feature wise)
│       ├── customers/
│       │   ├── CustomerTable.tsx
│       │   ├── CustomerForm.tsx
│       │   └── CustomerFilter.tsx
│       └── orders/
│           ├── OrderList.tsx
│           ├── OrderCard.tsx
│           └── OrderDetailsModal.tsx
│
├── services/                   # API Call Services
│   ├── customerService.ts
│   └── orderService.ts
│
├── types/                      # TypeScript Interfaces/Types
│   ├── customer.ts
│   └── order.ts
│
└── utils/                      # Helper Functions (Formatters, Validators)
    ├── formatDate.ts
    └── constants.ts