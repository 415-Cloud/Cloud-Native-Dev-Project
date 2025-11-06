import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export interface Workout {
  id: number;
  userId: string;
  type: string;
  distance?: number;
  duration: number; // in minutes
  calories?: number;
  notes?: string;
  createdAt: string;
}

export interface CreateWorkoutRequest {
  userId: string;
  type: string;
  distance?: number;
  duration: number;
  calories?: number;
  notes?: string;
}

export interface UpdateWorkoutRequest {
  type?: string;
  distance?: number;
  duration?: number;
  calories?: number;
  notes?: string;
}

class WorkoutService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      console.log(`Making request to: ${url}`);
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(error.error || 'Request failed');
      }

      return await response.json();
    } catch (error: any) {
      console.error(`API Error (${endpoint}):`, error);
      if (error.message?.includes('Network request failed') || error.message?.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to ${this.baseUrl}. Make sure:\n1. The workout service is running\n2. Both devices are on the same Wi-Fi network\n3. Your firewall allows connections on port 3001`);
      }
      throw error;
    }
  }

  async checkHealth(): Promise<{ status: string; service: string }> {
    return this.request<{ status: string; service: string }>(
      API_ENDPOINTS.health
    );
  }

  async getWorkouts(userId: string): Promise<Workout[]> {
    const response = await this.request<{ workouts: Workout[] }>(
      API_ENDPOINTS.userWorkouts(userId)
    );
    return response.workouts;
  }

  async getWorkoutById(id: number): Promise<Workout> {
    const response = await this.request<{ workout: Workout }>(
      API_ENDPOINTS.workoutById(id)
    );
    return response.workout;
  }

  async createWorkout(data: CreateWorkoutRequest): Promise<Workout> {
    const response = await this.request<{ success: boolean; workout: Workout }>(
      API_ENDPOINTS.workouts,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return response.workout;
  }

  async updateWorkout(
    id: number,
    data: UpdateWorkoutRequest
  ): Promise<Workout> {
    const response = await this.request<{ success: boolean; workout: Workout }>(
      API_ENDPOINTS.workoutById(id),
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
    return response.workout;
  }

  async deleteWorkout(id: number): Promise<void> {
    await this.request<{ success: boolean; message: string }>(
      API_ENDPOINTS.workoutById(id),
      {
        method: 'DELETE',
      }
    );
  }
}

export const workoutService = new WorkoutService();

