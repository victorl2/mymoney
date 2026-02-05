# MyMoney

An all-in-one expense and investment portfolio tracker. Track your daily expenses, manage investment portfolios, and visualize your financial health through an intuitive dashboard.

## Features

### Expense Tracking
- Add, edit, and delete expenses with categories
- Filter by category, date range, amount, or search text
- Support for recurring expenses (daily, weekly, monthly, etc.)
- Paginated expense list with sorting options

### Investment Portfolio
- Create multiple portfolios (e.g., Retirement, Trading)
- Track assets: stocks, crypto, ETFs, bonds, funds
- Automatic gain/loss calculations per asset and portfolio
- Support for fractional shares (crypto)

### Dashboard
- Net worth overview with portfolio P&L
- Month-over-month expense comparison
- 6-month expense trend chart
- Portfolio allocation by asset type (pie chart)
- Top spending categories with percentages
- Recent transactions feed

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance Python web framework |
| **Strawberry GraphQL** | Type-safe GraphQL with Python annotations |
| **SQLAlchemy 2.0** | ORM with `Mapped[]` type annotations |
| **Alembic** | Database migrations |
| **SQLite** | Lightweight file-based database |
| **Pydantic** | Settings and validation |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Fast development server and bundler |
| **Apollo Client** | GraphQL client with caching |
| **Tailwind CSS v4** | Utility-first styling |
| **Recharts** | Charts (area, pie) |
| **React Router** | Client-side routing |
| **date-fns** | Date formatting |

### API
- **GraphQL** schema as the contract between frontend and backend
- Schema exported to `schema/schema.graphql`
- GraphQL Codegen for TypeScript type generation

## Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/victorl2/mymoney.git
   cd mymoney
   ```

2. **Install dependencies**
   ```bash
   make install
   ```
   This installs both backend (Python) and frontend (npm) dependencies.

3. **Set up the database**
   ```bash
   make migrate   # Run database migrations
   make seed      # Add default expense categories
   ```

4. **Start the development servers**
   ```bash
   make dev
   ```
   - Backend: http://localhost:8000 (GraphQL Playground at `/graphql`)
   - Frontend: http://localhost:5173

## Usage

### Adding Expenses
1. Navigate to **Expenses** in the sidebar
2. Click **Add Expense**
3. Fill in amount, description, date, and category
4. Optionally mark as recurring and set frequency

### Managing Investments
1. Navigate to **Investments** in the sidebar
2. Click **New Portfolio** to create a portfolio
3. Click **Add Asset** to add stocks, crypto, etc.
4. Enter symbol, quantity, purchase price, and optionally current price
5. View gain/loss calculations automatically

### Viewing Dashboard
1. Navigate to **Dashboard** (default landing page)
2. See net worth, monthly expenses, and trends
3. Review top spending categories and recent transactions

## Development

### Available Commands

```bash
# Installation
make install           # Install all dependencies
make install-backend   # Install Python dependencies only
make install-frontend  # Install npm dependencies only

# Development
make dev               # Start both backend and frontend
make run-backend       # Start backend only (port 8000)
make run-frontend      # Start frontend only (port 5173)

# Database
make migrate           # Run pending migrations
make new-migration msg="description"  # Create new migration
make seed              # Seed default categories

# Code Generation
make export-schema     # Export GraphQL schema to SDL
make codegen           # Generate TypeScript types from schema

# Testing
make test              # Run backend tests
make test-backend      # Run backend tests (same as above)
```

### Project Structure

```
mymoney/
├── Makefile                 # Dev commands
├── schema/
│   └── schema.graphql       # GraphQL schema (API contract)
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── models/          # SQLAlchemy models
│   │   ├── graphql/         # Strawberry types, resolvers, inputs
│   │   └── services/        # Business logic
│   ├── alembic/             # Database migrations
│   └── tests/               # Pytest tests
└── frontend/
    └── src/
        ├── components/      # React components
        ├── pages/           # Route pages
        ├── graphql/         # Queries and mutations
        └── apollo.ts        # Apollo Client config
```

### Running Tests

```bash
make test
```

Tests use an in-memory SQLite database. Current coverage:
- 39 tests covering expense, investment, and dashboard services

## Default Categories

The seed script creates these expense categories:
- Food, Transport, Housing, Utilities, Entertainment
- Health, Education, Shopping, Other

## API Reference

Access the GraphQL Playground at http://localhost:8000/graphql when the backend is running.

### Key Queries
- `dashboard(month?)` - Aggregated financial summary
- `expenses(filter, sort, pagination)` - List expenses with filtering
- `portfolios` - All portfolios with assets and computed totals
- `categories` - All expense categories

### Key Mutations
- `createExpense` / `updateExpense` / `deleteExpense`
- `createPortfolio` / `deletePortfolio`
- `createAsset` / `updateAsset` / `deleteAsset`
- `updateAssetPrice` - Quick price update for an asset

## License

MIT
