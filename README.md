# SUI → afSUI Staking Page

This application allows users to stake SUI tokens and receive afSUI using the Aftermath SDK.

## Features

- ✅ Sui wallet connection via @mysten/dapp-kit
- ✅ SUI amount input for staking
- ✅ Real-time blockchain data fetching (exchange rate)
- ✅ Preview of expected afSUI amount
- ✅ Staking transaction execution
- ✅ Error handling and loading states
- ✅ Modern UI with Tailwind CSS and shadcn/ui

## Technologies

- **React 19** with TypeScript
- **@mysten/dapp-kit** for wallet connection
- **@mysten/sui** for blockchain interaction
- **aftermath-ts-sdk** for staking functionality
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Webpack** for building

## Installation and Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser at http://localhost:8080

## Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check for code quality issues
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is properly formatted
- `npm run type-check` - Run TypeScript type checking

## Code Quality

This project uses ESLint and Prettier for code quality and formatting:

- **ESLint**: Lints TypeScript and React code for potential issues
- **Prettier**: Automatically formats code for consistency
- **TypeScript**: Provides type checking and better development experience

## Production Build

```bash
npm run build
```

## Environment Variables

The application doesn't require additional environment variables. It uses the Sui mainnet by default.

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── WalletConnect.tsx
│   └── StakePage.tsx
├── hooks/
│   ├── useAftermath.ts
│   ├── useStakingData.ts
│   └── useStake.ts
├── lib/
│   └── utils.ts      # shadcn/ui utilities
├── App.tsx
├── index.tsx
└── index.css
```

## How to Use

1. Connect your Sui wallet
2. Enter the amount of SUI to stake
3. Review the expected afSUI amount
4. Click "Stake" to execute the transaction
5. Confirm the transaction in your wallet

## Implementation Features

- **Real Data**: The application fetches live data from the blockchain
- **Proper Decimal Handling**: Converts SUI to MIST (minimal units)
- **Logic Separation**: Business logic is separated into custom hooks
- **Error Handling**: Comprehensive error handling with clear messages
- **Loading States**: Loading indicators for all async operations
