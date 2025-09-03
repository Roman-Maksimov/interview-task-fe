# SUI → afSUI Staking Application

A modern web application that allows users to stake SUI tokens and receive afSUI (Aftermath Finance liquid staking tokens) using the Aftermath SDK.

## Features

- ✅ **Wallet Integration**: Sui wallet connection via @mysten/dapp-kit
- ✅ **Real-time Data**: Live blockchain data fetching (exchange rate, APY, validators, TVL)
- ✅ **Smart Validation**: Comprehensive form validation with balance checking
- ✅ **Fee Calculation**: External fee (1%) deducted from staking amount
- ✅ **Transaction Preview**: Real-time preview of expected afSUI and fee breakdown
- ✅ **Debounced Calculations**: Optimized performance with 300ms debounce
- ✅ **Transaction Execution**: Secure staking transaction with proper error handling
- ✅ **Modern UI**: Beautiful interface with Tailwind CSS and shadcn/ui components
- ✅ **Loading States**: Skeleton loaders and loading indicators
- ✅ **Success/Error Messages**: Clear feedback for all operations

## Technologies

- **React 19** with TypeScript
- **@mysten/dapp-kit** for wallet connection and transaction signing
- **@mysten/sui** for blockchain interaction
- **aftermath-ts-sdk** for Aftermath Finance staking functionality
- **React Hook Form** for form management and validation
- **Decimal.js** for precise decimal calculations
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Vite** for building and development

## Installation and Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser at http://localhost:5173

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check for code quality issues
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run type-check` - Run TypeScript type checking

## Code Quality

This project uses ESLint for code quality and formatting:

- **ESLint**: Lints TypeScript and React code for potential issues
- **TypeScript**: Provides type checking and better development experience
- **Strict Type Checking**: Full type safety throughout the application

## Production Build

```bash
npm run build
```

## Environment Variables

The application doesn't require additional environment variables. It uses the Sui mainnet by default and connects to Aftermath Finance protocol.

## Project Structure

```
src/
├── components/
│   ├── StakingForm/          # Main staking form components
│   │   ├── StakingForm.tsx   # Main form component
│   │   ├── StakingFormPreview.tsx  # Transaction preview
│   │   └── useStakingForm.ts # Staking business logic hook
│   ├── ConnectWallet.tsx     # Wallet connection component
│   └── ui/                   # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── skeleton.tsx
├── hooks/
│   └── useDebounce.ts        # Debounce utility hook
├── lib/
│   └── constants.ts          # Application constants
├── pages/
│   └── StakingPage.tsx       # Main staking page
├── providers/
│   └── AccountProvider.tsx   # Account context provider
├── utils/
│   ├── amountToDecimal.ts    # SUI amount conversion utilities
│   ├── cn.ts                 # shadcn/ui utilities
│   └── fn.ts                 # General utility functions
├── App.tsx
├── main.tsx
└── index.css
```

## How to Use

1. **Connect Wallet**: Click "Connect Wallet" and select your Sui wallet
2. **Enter Amount**: Input the amount of SUI you want to stake
3. **Review Details**: Check the transaction preview showing:
   - Expected afSUI amount you'll receive
   - Current exchange rate
   - Fee breakdown (1% external fee)
   - Total amount to be spent
4. **Validate**: Ensure you have sufficient balance and the amount meets requirements
5. **Stake**: Click "Stake SUI" to execute the transaction
6. **Confirm**: Approve the transaction in your wallet
7. **Success**: Receive confirmation and see your new afSUI balance

## Key Implementation Features

### 🔗 **Blockchain Integration**
- **Real-time Data**: Fetches live exchange rates, APY, validators, and TVL from Aftermath Finance
- **Precise Calculations**: Uses Decimal.js for accurate decimal arithmetic
- **Proper Unit Conversion**: Converts SUI to MIST (minimal units) for blockchain transactions

### 🎯 **User Experience**
- **Smart Validation**: Real-time form validation with balance checking
- **Debounced Calculations**: 300ms debounce prevents excessive API calls
- **Loading States**: Skeleton loaders and loading indicators for all operations
- **Error Handling**: Comprehensive error messages with clear explanations

### 🏗️ **Architecture**
- **Custom Hooks**: Business logic separated into reusable hooks
- **Type Safety**: Full TypeScript coverage with strict type checking
- **Component Separation**: Modular components for maintainability
- **Context Management**: React Context for wallet state management

### 💰 **Fee Structure**
- **External Fee**: 1% fee deducted from staking amount
- **Transparent Pricing**: Clear breakdown of fees and amounts
- **Balance Validation**: Ensures sufficient funds for total transaction cost

## Constants Configuration

Key constants defined in `src/lib/constants.ts`:
- `EXTERNAL_FEE_PERCENTAGE`: 0.01 (1%)
- `MIN_STAKING_AMOUNT`: 1 SUI
- `MAX_STAKING_AMOUNT`: 1,000,000 SUI
- `NETWORK`: Sui mainnet configuration

## Example Usage

### Staking 100 SUI:
- **Input**: 100 SUI
- **External Fee**: 1 SUI (1%)
- **Actual Staking Amount**: 99 SUI
- **Expected afSUI**: 99 × exchange rate
- **Total Spent**: 100 SUI

### Validation Examples:
- ✅ **Valid**: 1.02 SUI → 1.0098 SUI staking (above minimum)
- ❌ **Invalid**: 1.01 SUI → 0.9999 SUI staking (below minimum)
- ❌ **Invalid**: Insufficient balance for total amount

## Development

### Adding New Features:
1. Create components in `src/components/`
2. Add business logic to custom hooks
3. Update types in component files
4. Add constants to `src/lib/constants.ts`

### Testing:
- Use browser developer tools to test wallet integration
- Check console for validation messages
- Verify transaction execution on Sui mainnet
