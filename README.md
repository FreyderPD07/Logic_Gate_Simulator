

## Propósito y Motivación

Este proyecto nace con el objetivo de evolucionar las herramientas tradicionales de enseñanza en electrónica digital y lógica de sistemas (muchas veces desarrolladas en entornos de escritorio como Python/Tkinter) hacia una **plataforma web moderna, intuitiva y accesible desde cualquier dispositivo**.

### ¿Qué problema resuelve?
- **Accesibilidad:** Elimina la necesidad de instalar software local para simular circuitos básicos.
- **Comprensión Académica:** Facilita el aprendizaje de álgebra booleana al conectar visualmente el comportamiento gráfico del circuito con su ecuación matemática ($F$) y su tabla de verdad en tiempo real.
- **Herramienta Open Source:** Proporciona una base sólida y extensible para que estudiantes y desarrolladores puedan aportar nuevas compuertas, exportación de datos o análisis más avanzados.

#  Simulador de Compuertas Lógicas (Logic Gate Simulator)

Un simulador interactivo de circuitos lógicos web desarrollado con **React**, **@xyflow/react** y **Vite**. Diseñado para estudiantes, educadores e ingenieros que buscan construir, visualizar y analizar circuitos digitales en tiempo real.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)
![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red)

---

##  Características Principales

-  **Lienzo Interactivo:** Arrastra, suelta y conecta compuertas lógicas mediante un sistema de nodos y cables dinámicos.
-  **Compuertas y Componentes:**
  - **Entradas:** Interruptores (*Switches*) etiquetados dinámicamente ($A, B, C...$).
  - **Salidas:** Indicadores LED de estado (ON/OFF).
  - **Compuertas Lógicas:** AND, OR, NOT.
-  **Entradas Múltiples Flexibles:** Soporte para conectar múltiples señales a las compuertas.
-  **Generador de Ecuaciones Booleanas:** Analiza automáticamente la topología del circuito construido y extrae su fórmula matemática equivalente (ej. $F = (A \cdot B) + C$).
-  **Tabla de Verdad Automática:** Evalúa $2^N$ combinaciones posibles con un modal interactivo y encabezados fijos.
-  **Modo Claro / Oscuro:** Interfaz adaptable según las preferencias del usuario.
-  **Herramientas del Lienzo:** Limpieza completa de la hoja y eliminación selectiva con teclas de acceso rápido (`Supr` / `Backspace`).

---

## Tecnologías Utilizadas

- **React 18** - Librería para la interfaz de usuario.
- **@xyflow/react (React Flow)** - Motor gráfico para el manejo de diagramas de flujo y redes de nodos.
- **Lucide React** - Iconografía moderna y limpia.
- **Vite** - Build tool ultra rápido para aplicaciones web frontend.

---

## Instalación y Configuración Local

Si deseas ejecutar este proyecto localmente en tu equipo:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/FreyderPD07/Logic_Gate_Simulator.git](https://github.com/FreyderPD07/Logic_Gate_Simulator.git)
   cd Logic_Gate_Simulator


** Instalar dependencias **
- npm install

** Iniciar el entorno de desarrollo **
- npm run dev



*Guia de Contribución (Open Source):**
Las contribucuones son bien recibidas! Si deseas colaborar añadiendo nuevas compuertas (XORD, NAND, NOR) u otras funcionalidaes:

1. Haz un Fork de este repositorio.
2. create una rama para tu función( git checkout -b feature/nueva-funcion ).
3. Realixa cambios y haz un commit (git commit -m 'feat: añadir copuerta XOR' ).
4. Sube los cambios a tu repositorio ( git push origin feature/nueva-funcion )

Licencia 
Este proyecto se distribuye bajo la Licencia MIT. COnsulta el archivo LICENSE para más detalles.







# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
