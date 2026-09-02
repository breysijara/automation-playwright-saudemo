import { Config } from '../config/environment';

export interface UserCredentials {
  username: string;
  password?: string;
  description: string;
}

export class UserFactory {
  /**
   * Resuelve el usuario estándar usando las variables de entorno centralizadas en Config.
   */
  static getStandardUser(): UserCredentials {
    return {
      username: Config.credentials.standardUser,
      password: Config.credentials.defaultPassword,
      description: 'Standard active user with full permissions',
    };
  }

  /**
   * Resuelve el usuario bloqueado desde las variables de entorno.
   */
  static getLockedOutUser(): UserCredentials {
    return {
      username: Config.credentials.lockedUser,
      password: Config.credentials.defaultPassword,
      description: 'Locked out user to validate security/auth rejection',
    };
  }

  /**
   * Resuelve el usuario problemático desde las variables de entorno.
   */
  static getProblemUser(): UserCredentials {
    return {
      username: Config.credentials.problemUser,
      password: Config.credentials.defaultPassword,
      description: 'User with UI state/image rendering defects for edge testing',
    };
  }

  /**
   * Resuelve el usuario con glitch de rendimiento desde las variables de entorno.
   */
  static getPerformanceGlitchUser(): UserCredentials {
    return {
      username: Config.credentials.performanceUser,
      password: Config.credentials.defaultPassword,
      description: 'User with intentional backend response latency',
    };
  }

  /**
   * Genera dinámicamente escenarios de prueba de error sin exponer credenciales reales.
   */
  static getInvalidScenario(criterion: string): UserCredentials {
    switch (criterion.toLowerCase()) {
      case 'password_incorrecto':
      case 'wrong_password':
        return {
          username: Config.credentials.standardUser,
          password: 'incorrect_password_xyz',
          description: 'Valid username with invalid password',
        };
      case 'usuario_vacio':
      case 'empty_username':
        return {
          username: '',
          password: Config.credentials.defaultPassword,
          description: 'Empty username with valid password',
        };
      case 'password_vacio':
      case 'empty_password':
        return {
          username: Config.credentials.standardUser,
          password: '',
          description: 'Valid username with empty password',
        };
      case 'usuario_no_registrado':
      case 'unregistered_user':
        return {
          username: 'unregistered_user_qa_123',
          password: Config.credentials.defaultPassword,
          description: 'Non-existent username in service',
        };
      default:
        throw new Error(`Invalid authentication criterion [${criterion}] not supported in UserFactory.`);
    }
  }

  static getUserByRole(role: string): UserCredentials {
    switch (role.toLowerCase()) {
      case 'standard':
      case 'standard_user':
      case 'valido':
      case 'usuario_valido':
        return this.getStandardUser();
      case 'locked_out':
      case 'locked_out_user':
      case 'bloqueado':
      case 'usuario_bloqueado':
        return this.getLockedOutUser();
      case 'problem':
      case 'problem_user':
        return this.getProblemUser();
      case 'performance_glitch':
      case 'performance_glitch_user':
        return this.getPerformanceGlitchUser();
      default:
        return this.getInvalidScenario(role);
    }
  }
}
