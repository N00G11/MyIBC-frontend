import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/components/request/reques';
import { 
  parseAuthError, 
  validateAuthResponse, 
  saveAuthData, 
  getRedirectPath,
  validateEmail,
  validatePassword,
  validateUsername,
  validatePersonalCode,
  getUserCode,
  clearAuthData,
  AuthError
} from '@/lib/auth-utils';

interface LoginCredentials {
  email?: string;
  password?: string;
  personalCode?: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearError = () => setError(null);

  const login = async (credentials: LoginCredentials) => {
    setError(null);
    setIsLoading(true);

    try {
      // Validation côté client
      if (credentials.email && credentials.password) {
        const emailValidation = validateEmail(credentials.email);
        if (!emailValidation.isValid) {
          setError(emailValidation.message!);
          return false;
        }

        const passwordValidation = validatePassword(credentials.password);
        if (!passwordValidation.isValid) {
          setError(passwordValidation.message!);
          return false;
        }
      } else if (credentials.personalCode) {
        const codeValidation = validatePersonalCode(credentials.personalCode);
        if (!codeValidation.isValid) {
          setError(codeValidation.message!);
          return false;
        }
      } else {
        setError("Veuillez fournir soit l'email/mot de passe, soit le code personnel.");
        return false;
      }

      let response;
      
      if (credentials.email && credentials.password) {
        response = await axiosInstance.post('/auth/login', {
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password,
        });
      } else if (credentials.personalCode) {
        response = await axiosInstance.post(`/auth/login/${credentials.personalCode.trim()}`);
      }

      // Validation et normalisation de la réponse
      const authData = validateAuthResponse(response!.data);

      // Sauvegarde sécurisée
      saveAuthData(authData, credentials.personalCode);

      // Redirection basée sur le rôle
      const redirectPath = getRedirectPath(authData.role);
      router.push(redirectPath);
      
      return true;
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      const authError = parseAuthError(err);
      setError(authError.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setError(null);
    setIsLoading(true);

    try {
      // Validation côté client
      const usernameValidation = validateUsername(data.username);
      if (!usernameValidation.isValid) {
        setError(usernameValidation.message!);
        return false;
      }

      const emailValidation = validateEmail(data.email);
      if (!emailValidation.isValid) {
        setError(emailValidation.message!);
        return false;
      }

      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.message!);
        return false;
      }

      const response = await axiosInstance.post('/auth/register', {
        username: data.username.trim(),
        password: data.password,
        email: data.email.trim().toLowerCase(),
      });

      // Validation et normalisation de la réponse
      const authData = validateAuthResponse(response.data);

      // Sauvegarde sécurisée
      saveAuthData(authData);

      // Redirection basée sur le rôle
      const redirectPath = getRedirectPath(authData.role || "ROLE_UTILISATEUR");
      router.push(redirectPath);
      
      return true;
    } catch (err: any) {
      console.error("Erreur d'inscription:", err);
      const authError = parseAuthError(err);
      
      // Gestion spéciale pour les erreurs de conflit
      if (err.response?.status === 409) {
        const message = err.response.data;
        if (typeof message === 'string' && (message.includes("nom d'utilisateur") || message.includes("username"))) {
          setError("Ce nom d'utilisateur est déjà utilisé. Veuillez en choisir un autre.");
        } else {
          setError("Cette adresse email est déjà associée à un compte existant.");
        }
      } else {
        setError(authError.message);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      clearAuthData();
      router.push('/auth/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const getCurrentUserCode = (role?: string) => {
    return getUserCode(role);
  };

  return {
    login,
    register,
    logout,
    getCurrentUserCode,
    isLoading,
    error,
    clearError
  };
}
