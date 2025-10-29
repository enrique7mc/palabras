# Palabras

Un clon de Wordle en español, con vocabulario de Latinoamérica.

## Características

- Juego de palabras de 5 letras con 6 intentos
- Vocabulario en español de Latinoamérica
- Las tildes se ignoran (á = a, é = e, etc.)
- Incluye la letra Ñ como letra distinta
- Una palabra nueva cada día
- **Modo Práctica**: Juega partidas ilimitadas sin afectar tus estadísticas
- **Tutorial Interactivo**: Guía paso a paso para nuevos jugadores
- Estadísticas locales guardadas en el navegador
- Diseño responsivo para móvil y escritorio
- Totalmente localizado en español

## Cómo jugar

### Modo Diario
1. Abre `index.html` en tu navegador
2. Adivina la palabra del día en 6 intentos
3. Después de cada intento, los colores de las letras cambian:
   - **Verde**: La letra está en la posición correcta
   - **Amarillo**: La letra está en la palabra pero en otra posición
   - **Gris**: La letra no está en la palabra

### Modo Práctica
- Haz clic en "🎮 Práctica" para jugar partidas ilimitadas
- Usa palabras aleatorias para mejorar tus habilidades
- No afecta tus estadísticas del modo diario
- Perfecto para aprender estrategias sin presión

### Tutorial
- Los nuevos jugadores reciben una guía interactiva
- Pistas paso a paso durante tu primer juego
- Aprende los controles y la mecánica del juego
- Puedes saltarlo si ya conoces el juego

## Tecnologías

- HTML5
- CSS3
- JavaScript (Vanilla, sin frameworks)

## Instalación

### Para Jugar
No requiere instalación. Simplemente clona el repositorio y abre `index.html` en tu navegador:

```bash
git clone https://github.com/enrique7mc/palabras.git
cd palabras
open index.html
```

### Para Desarrollo
Si quieres ejecutar tests o contribuir al proyecto:

```bash
git clone https://github.com/enrique7mc/palabras.git
cd palabras
npm install       # Instala dependencias de desarrollo
npm test          # Ejecuta tests unitarios
npm run test:e2e  # Ejecuta tests E2E
```

## Testing

This project includes comprehensive test coverage using modern testing tools:

### Test Stack
- **Vitest**: Fast unit tests for core game logic
- **Playwright**: Cross-browser E2E tests for user flows
- **Testing Library**: DOM testing utilities

### Running Tests

#### Unit Tests
Run unit tests for core functions (normalize, word selection, validation):

```bash
npm test              # Watch mode
npm test -- --run     # Run once
npm run test:coverage # With coverage report
```

#### E2E Tests
Run end-to-end tests across Chromium, Firefox, and Safari:

```bash
npm run test:e2e           # Run all E2E tests
npm run test:e2e:ui        # Run with Playwright UI
npm run test:e2e:debug     # Debug mode
```

### Test Coverage

**Unit Tests** (17 tests):
- String normalization (accent removal, uppercase conversion)
- Word length validation
- Word-of-day algorithm
- Random word selection
- Tutorial word selection

**E2E Tests** (36 tests across 3 browsers):
- Typing letters with on-screen keyboard
- Deleting letters with backspace
- Submitting words and validation
- Color feedback system
- Keyboard state updates
- Mode switching (Daily/Practice)
- Show/hide answer functionality
- New game functionality

### Test Structure

```
tests/
├── unit/           # Pure function tests
│   ├── normalize.test.js
│   ├── wordValidation.test.js
│   └── wordSelection.test.js
└── e2e/            # Browser-based tests
    ├── gameplay.spec.js
    └── modes.spec.js
```

## Mantenimiento de las listas de palabras

Este proyecto usa [keep-sorted](https://github.com/google/keep-sorted) para mantener las listas de palabras ordenadas alfabéticamente.

### Uso local

Para mantener las palabras ordenadas localmente:

1. Instala keep-sorted:
   ```bash
   go install github.com/google/keep-sorted@latest
   ```

   (Opcional) Agrega Go bin a tu PATH para usar `keep-sorted` sin la ruta completa:
   ```bash
   echo 'export PATH="$HOME/go/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

2. Ordena las palabras:
   ```bash
   ~/go/bin/keep-sorted --mode fix words.js
   ```

   O si tienes `~/go/bin` en tu PATH:
   ```bash
   keep-sorted --mode fix words.js
   ```

### Automático en GitHub

Las palabras se ordenan automáticamente mediante GitHub Actions cuando se hace push a la rama `main`. Si intentas hacer un pull request con palabras desordenadas, el CI fallará y te pedirá que las ordenes localmente.

### Agregar nuevas palabras

1. Abre `words.js`
2. Agrega nuevas palabras de 5 letras en cualquier lugar dentro de las secciones marcadas con `// keep-sorted`
3. Ejecuta `~/go/bin/keep-sorted --mode fix words.js` para ordenarlas
4. Haz commit de los cambios

El juego automáticamente valida que todas las palabras tengan exactamente 5 letras.

## Desarrollo futuro

Posibles mejoras:
- Compartir resultados en redes sociales
- Más categorías de palabras
- Modo difícil
- Tema claro/oscuro
- Estadísticas más detalladas
- Soporte para palabras de diferentes longitudes

## Licencia

MIT
