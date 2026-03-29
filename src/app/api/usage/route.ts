import { NextResponse } from 'next/server';

// Generate usage data for the past N days
function generateUsageData(days: number) {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      tokens: Math.floor(Math.random() * 100000) + 50000,
      cost: parseFloat((Math.random() * 20 + 5).toFixed(2)),
      requests: Math.floor(Math.random() * 1000) + 200,
      models: {
        'gpt-4-turbo': {
          tokens: Math.floor(Math.random() * 50000) + 20000,
          cost: parseFloat((Math.random() * 10 + 2).toFixed(2)),
        },
        'claude-3-opus': {
          tokens: Math.floor(Math.random() * 30000) + 10000,
          cost: parseFloat((Math.random() * 8 + 2).toFixed(2)),
        },
        'gpt-4o': {
          tokens: Math.floor(Math.random() * 20000) + 5000,
          cost: parseFloat((Math.random() * 3 + 1).toFixed(2)),
        },
      },
    });
  }
  
  return data;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '7d';
  
  let days = 7;
  switch (period) {
    case '24h': days = 1; break;
    case '30d': days = 30; break;
    case '90d': days = 90; break;
    default: days = 7;
  }

  const dailyUsage = generateUsageData(days);
  
  const totals = dailyUsage.reduce(
    (acc, day) => ({
      tokens: acc.tokens + day.tokens,
      cost: acc.cost + day.cost,
      requests: acc.requests + day.requests,
    }),
    { tokens: 0, cost: 0, requests: 0 }
  );

  const byModel = {
    'gpt-4-turbo': {
      tokens: Math.floor(Math.random() * 500000) + 200000,
      cost: parseFloat((Math.random() * 100 + 50).toFixed(2)),
      requests: Math.floor(Math.random() * 10000) + 5000,
    },
    'claude-3-opus': {
      tokens: Math.floor(Math.random() * 300000) + 100000,
      cost: parseFloat((Math.random() * 80 + 40).toFixed(2)),
      requests: Math.floor(Math.random() * 5000) + 2000,
    },
    'gpt-4o': {
      tokens: Math.floor(Math.random() * 200000) + 50000,
      cost: parseFloat((Math.random() * 30 + 10).toFixed(2)),
      requests: Math.floor(Math.random() * 3000) + 1000,
    },
    'gemini-pro': {
      tokens: Math.floor(Math.random() * 100000) + 20000,
      cost: parseFloat((Math.random() * 15 + 5).toFixed(2)),
      requests: Math.floor(Math.random() * 1500) + 500,
    },
  };

  const byAgent = {
    'agent-primary': {
      tokens: Math.floor(Math.random() * 400000) + 200000,
      cost: parseFloat((Math.random() * 80 + 40).toFixed(2)),
      requests: Math.floor(Math.random() * 8000) + 4000,
    },
    'agent-research': {
      tokens: Math.floor(Math.random() * 200000) + 100000,
      cost: parseFloat((Math.random() * 40 + 20).toFixed(2)),
      requests: Math.floor(Math.random() * 3000) + 1500,
    },
    'agent-codegen': {
      tokens: Math.floor(Math.random() * 150000) + 50000,
      cost: parseFloat((Math.random() * 30 + 15).toFixed(2)),
      requests: Math.floor(Math.random() * 2500) + 1000,
    },
  };

  return NextResponse.json({
    period,
    daily: dailyUsage,
    totals,
    byModel,
    byAgent,
    timestamp: new Date().toISOString(),
  });
}
