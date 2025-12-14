export interface User{
    id:string;
    email: string;
    name: string;
    role: 'student' | 'teacher' | 'admin';
    profilePicture? : string;
    createdAt: string;
    updatedAt:string;
}

export interface Student extends User{
    role : 'student';
    matrixNumber: string;
}

export interface Teacher extends User{
    role : 'teacher';
}

export interface Admin extends User{
    role : 'admin';
}

export interface AuthState{
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    token: string | null;
}

export interface LoginCredentials{
    email:string;
    password: string;
    role: 'student' | 'teacher' | 'admin';
    rememberMe?: boolean;
}

export interface DutyAssignment{
    id:string;
    studentId: string;
    teacherId: string;
    date: string;
    time: string;
    location: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T>{
    success: boolean;
    data: T;
    message: string;
    errors?: string[];
}