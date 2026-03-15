import { getDashboardStats } from '@/lib/controllers/dashboardController';

export async function GET() {
  return getDashboardStats();
}

