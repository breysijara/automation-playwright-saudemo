export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
  scenarioType?: string;
}

export class CheckoutDataFactory {
  /**
   * Retorna datos válidos y representativos de un comprador típico.
   */
  static getValidCustomer(): CustomerInfo {
    const timestamp = Date.now();
    return {
      firstName: `John_${timestamp}`,
      lastName: `Doe_${timestamp}`,
      postalCode: '110111',
      scenarioType: 'Valid Standard Data',
    };
  }

  /**
   * Retorna partición de equivalencia: campo First Name faltante.
   */
  static getMissingFirstNameCustomer(): CustomerInfo {
    return {
      firstName: '',
      lastName: 'Doe',
      postalCode: '110111',
      scenarioType: 'Missing First Name',
    };
  }

  /**
   * Retorna partición de equivalencia: campo Last Name faltante.
   */
  static getMissingLastNameCustomer(): CustomerInfo {
    return {
      firstName: 'John',
      lastName: '',
      postalCode: '110111',
      scenarioType: 'Missing Last Name',
    };
  }

  /**
   * Retorna partición de equivalencia: campo Postal Code faltante.
   */
  static getMissingPostalCodeCustomer(): CustomerInfo {
    return {
      firstName: 'John',
      lastName: 'Doe',
      postalCode: '',
      scenarioType: 'Missing Postal Code',
    };
  }

  /**
   * Valores límite y de frontera (longitudes mínimas, caracteres especiales, cadenas largas).
   */
  static getBoundaryCustomer(type: 'min_length' | 'max_length' | 'special_chars' | 'numeric_names'): CustomerInfo {
    switch (type) {
      case 'min_length':
        return {
          firstName: 'A',
          lastName: 'B',
          postalCode: '1',
          scenarioType: 'Minimum Length (1 char)',
        };
      case 'max_length':
        return {
          firstName: 'A'.repeat(50),
          lastName: 'B'.repeat(50),
          postalCode: '9'.repeat(20),
          scenarioType: 'Maximum String Length',
        };
      case 'special_chars':
        return {
          firstName: 'José-María',
          lastName: "O'Connor #$%&",
          postalCode: 'AB-1234!',
          scenarioType: 'Special Characters & Accents',
        };
      case 'numeric_names':
        return {
          firstName: '12345',
          lastName: '67890',
          postalCode: '90210',
          scenarioType: 'Numeric Values in Name Fields',
        };
      default:
        return this.getValidCustomer();
    }
  }
}
