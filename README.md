# Portafolio académico · Isidora Valverde

Portafolio personal desarrollado para la evaluación P2 de ICINF1107, Desarrollo de Frontend. Presenta el perfil académico de Isidora Valverde Santibáñez, proyectos de su recorrido académico y sus áreas de interés en frontend y ciberseguridad.

## Tecnologías

- HTML5 semántico
- CSS3, Flexbox y CSS Grid
- JavaScript nativo para animaciones al desplazarse
- Google Fonts (Manrope y DM Mono)
- Python, CustomTkinter, SymPy y Matplotlib en el proyecto de cálculo de límites

## Diseño y experiencia

La propuesta visual combina una portada azul petróleo con secciones claras y acentos medidos de amarillo cálido, ocre, rojo y burdeo. Los gráficos abstractos están creados en CSS. El diseño se adapta a móviles, tabletas y escritorio; las tarjetas distinguen el proyecto realizado de las áreas que siguen en aprendizaje.

La fotografía de perfil se encuentra en `img/isidora-valverde.jpeg`. Las animaciones incluyen entrada del contenido, órbitas decorativas y aparición progresiva de secciones y tarjetas al desplazarse. Si el sistema tiene activada la opción de movimiento reducido, las animaciones se desactivan.

## Prompts técnicos utilizados

Se utilizaron asistentes de inteligencia artificial como apoyo para comprender, documentar y publicar el proyecto. Estos son resúmenes de los prompts utilizados:

- Explicar la estructura del portafolio y la función de sus secciones y tecnologías para presentarlo en una evaluación.
- Reducir el CSS eliminando reglas sin uso o repetidas, sin modificar la apariencia ni el comportamiento responsive de la página.
- Explicar la sintaxis de los selectores CSS, por ejemplo, qué significan `.skip-link:focus` y el punto antes de una clase.
- Describir los pasos para publicar un sitio estático desde un repositorio de GitHub usando GitHub Pages.

## Accesibilidad

- Estructura semántica con encabezado, navegación, contenido principal, secciones, artículos y pie de página.
- Enlace para saltar directamente al contenido, navegación por teclado y estilos de foco visibles.
- Jerarquía de encabezados y etiquetas de navegación descriptivas.
- Las ilustraciones decorativas se ocultan de tecnologías de asistencia.
- Respeto por la preferencia de movimiento reducido del sistema.
- Texto alternativo descriptivo en la fotografía de perfil.

## Ejecutar localmente

1. Clona o descarga el repositorio.
2. Abre `index.html` en un navegador moderno. No se requiere proceso de compilación.

Las fuentes tipográficas se cargan desde Google Fonts; si no hay conexión, se usan fuentes de respaldo del sistema.

## Archivos del repositorio

- `.gitignore` excluye archivos temporales del sistema y del editor, carpetas de salida y archivos locales de entorno.
- `img/` contiene los recursos visuales del sitio.
- `proyectos/ivora-nails/` contiene la primera página web creada en el curso de Desarrollo de Frontend, con sus archivos HTML, CSS y JavaScript.
- `proyectos/calculadora_limites.py` contiene el código fuente de la calculadora de límites desarrollada en Cálculo Básico.
- `proyectos/requirements.txt` lista las dependencias necesarias para ejecutar esa aplicación de escritorio.

Para ejecutar la calculadora, instala sus dependencias con `pip install -r proyectos/requirements.txt` y luego ejecuta `python proyectos/calculadora_limites.py`. La calculadora requiere un entorno de escritorio compatible con Tkinter.

## Contacto

La sección de contacto incluye un botón para redactar un mensaje en Gmail con el destinatario `ivalverde2026@alu.uct.cl` ya completado, un enlace `mailto:` alternativo para la aplicación de correo configurada en el dispositivo y un enlace al perfil de GitHub. Las ilustraciones de las tarjetas son gráficas decorativas y no capturas de pantalla de los proyectos.