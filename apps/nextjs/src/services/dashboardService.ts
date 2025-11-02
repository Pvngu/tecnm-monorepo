const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
const apiBaseURL = `${baseURL}/api/v1/`;

export interface Periodo {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface DashboardStats {
  totalEstudiantes: number;
  reprobacionPromedio: number;
  desercionEstimada: number;
  desercionPorSemestre: Array<{
    semestre: string;
    estudiantes: number;
  }>;
  periodos: Periodo[];
  periodoSeleccionado: number | null;
}

export const dashboardService = {
  getStats: async (periodoId?: number): Promise<DashboardStats> => {
    const url = periodoId 
      ? `${apiBaseURL}dashboard/stats?periodo_id=${periodoId}`
      : `${apiBaseURL}dashboard/stats`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error fetching dashboard stats');
    }

    return response.json();
  }
};
