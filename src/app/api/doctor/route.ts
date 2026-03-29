import { NextResponse } from 'next/server';
import { DOCTOR_CHECKS, calculateHealthScore, DoctorCheckResult } from '@/lib/doctor/doctor-checks';

export async function GET() {
  // Simulate running all diagnostic checks
  const results: DoctorCheckResult[] = DOCTOR_CHECKS.map((check) => ({
    ...check,
    checked: true,
    timestamp: new Date(),
    status: Math.random() > 0.9 ? (Math.random() > 0.5 ? 'warn' : 'fail') : 'pass',
  }));

  // Override specific checks for demo
  const gatewayRunningCheck = results.find((r) => r.id === 'gateway-running');
  if (gatewayRunningCheck) {
    gatewayRunningCheck.status = 'pass';
  }

  const healthScore = calculateHealthScore(results);
  
  const summary = {
    score: healthScore,
    passed: results.filter((r) => r.status === 'pass').length,
    warnings: results.filter((r) => r.status === 'warn').length,
    failures: results.filter((r) => r.status === 'fail').length,
    total: results.length,
    fixable: results.filter((r) => r.status !== 'pass' && r.fixAvailable).length,
  };

  return NextResponse.json({
    results,
    summary,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { checkId, action } = body;

  if (action === 'fix' && checkId) {
    // Simulate applying a fix
    return NextResponse.json({
      success: true,
      message: `Fix applied for check ${checkId}`,
      checkId,
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
}
