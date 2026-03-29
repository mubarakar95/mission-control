import { NextResponse } from 'next/server';

export async function GET() {
  // Simulated system resources
  const resources = {
    cpu: Math.floor(Math.random() * 60) + 20,
    memory: Math.floor(Math.random() * 50) + 30,
    disk: Math.floor(Math.random() * 40) + 20,
    network: {
      in: Math.floor(Math.random() * 200000) + 50000,
      out: Math.floor(Math.random() * 150000) + 30000,
    },
    loadAverage: [
      parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
      parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
      parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
    ],
    uptime: Math.floor(Math.random() * 864000) + 86400,
    platform: process.platform,
    arch: process.arch,
    hostname: 'openclaw-server',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(resources);
}
