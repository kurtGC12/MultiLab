
export const environment = {
  // Dirección base del backend (Spring Boot)
  apiBaseUrlUser: 'http://localhost:8081/api',
  apiBaseUrlabs: 'http://localhost:8080/api',

  production: false
};


// =========================================================
// Ejemplo de uso más adelante:
//  this.http.get(`${environment.apiBaseUrl}/libros`);
// Resultado real: GET http://localhost:8080/api/libros
// =========================================================
