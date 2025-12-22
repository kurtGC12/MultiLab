
export const environment = {
  // Dirección base del backend (Spring Boot)
  apiBaseUrlUser: 'http://ip172-18-0-4-d548p7c69qi000d6ti0g-8081.direct.labs.play-with-docker.com/api',
  apiBaseUrlabs: 'http://ip172-18-0-15-d548p7c69qi000d6ti0g-8080.direct.labs.play-with-docker.com/api',
  apiBaseUrlRult: 'http://ip172-18-0-25-d548p7c69qi000d6ti0g-8082.direct.labs.play-with-docker.com/api',
  production: false
};


// =========================================================
// Ejemplo de uso más adelante:
//  this.http.get(`${environment.apiBaseUrl}/libros`);
// Resultado real: GET http://localhost:8080/api/libros
// =========================================================
