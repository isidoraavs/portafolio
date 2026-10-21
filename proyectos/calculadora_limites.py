"""
--------------------------------------------------
EVALUACIÓN INTEGRADA DE DESEMPEÑO (EID)

Proyecto:
Calculadora y Visualizadora de Límites

Integrantes:
- Benjamín Aedo
- Joaquín Baeza
- Emily Jara
- Isidora Valverde

Carrera: Ingeniería Civil Informática
Asignatura: Cálculo básico  
--------------------------------------------------
"""

import customtkinter as ctk
import sympy as sp
from matplotlib.figure import Figure
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

# Configuracion y estado compartido por la interfaz y el grafico.
x = sp.symbols('x')
canvas = None


# Calcula el limite y presenta el resultado exacto, decimal o lateral.
def calcular_limite(): #función principal del calculo de límites  
    global canvas
    lbl_error.configure(text="")
    lbl_exacto.configure(text="Límite Exacto: ")
    lbl_decimal.configure(text="Valor Decimal: ")
    
    if canvas is not None: #elimina el gráfico anterior  
        canvas.get_tk_widget().destroy()
        canvas = None

    texto_funcion = entrada_funcion.get().strip() #obtiene el texto de la función
    texto_h = entrada_h.get().strip() #obtiene el texto del valor de h

    if not texto_funcion or not texto_h: #validación de campos vacíos
        lbl_error.configure(text="Error: Por favor complete ambos campos.")
        return
    try:
        texto_funcion = texto_funcion.replace("sen", "sin") #reemplaza sen por sin  
        funcion = sp.sympify(texto_funcion)
        
        direccion_usuario = None # Detecta si el usuario pide un límite lateral específico 
        if texto_h.endswith("+"):
            direccion_usuario = "+"
            texto_h = texto_h[:-1].strip() #elimina el signo lateral para procesar el valor de h
        elif texto_h.endswith("-") and texto_h != "-":
            direccion_usuario = "-"
            texto_h = texto_h[:-1].strip() #elimina el signo lateral para procesar el valor de h

        if texto_h in ["inf", "-inf", "oo", "-oo"]: #maneja casos de infinito
            texto_h_fijo = texto_h.replace("inf", "oo")
            h = sp.sympify(texto_h_fijo)
        else:
            texto_h_fijo = texto_h
            h = sp.sympify(texto_h_fijo)

        #calculo si se especifica un lado  
        if direccion_usuario == "+":
            #calcula solo el límite por la derecha
            limite = sp.limit(funcion, x, h, dir="+")
            lbl_exacto.configure(text=f"Límite por la Derecha (+): {limite}")
            try:
                valor_decimal = float(limite.evalf())
                lbl_decimal.configure(text=f"Valor Decimal: {valor_decimal:.4f}")
            except:
                lbl_decimal.configure(text="Valor Decimal: No aplica")
                
        elif direccion_usuario == "-":
            #calcula solo el límite por la izquierda
            limite = sp.limit(funcion, x, h, dir="-")
            lbl_exacto.configure(text=f"Límite por la Izquierda (-): {limite}")
            try:
                valor_decimal = float(limite.evalf())
                lbl_decimal.configure(text=f"Valor Decimal: {valor_decimal:.4f}")
            except:
                lbl_decimal.configure(text="Valor Decimal: No aplica")
                
        else: 
            limite_derecha = sp.limit(funcion, x, h, dir="+") # Caso normal:calculo de límites laterales 
            limite_izquierda = sp.limit(funcion, x, h, dir="-")

            if limite_derecha == limite_izquierda: #existencia del límite exacto
                lbl_exacto.configure(text=f"Límite Exacto: {limite_derecha}")
                
                #resultado decimal (si es posible)
                try:
                    valor_decimal = float(limite_derecha.evalf())
                    lbl_decimal.configure(text=f"Valor Decimal: {valor_decimal:.4f}")
                except:
                    lbl_decimal.configure(text="Valor Decimal: No aplica")
            else:
                lbl_exacto.configure(text="Límite Exacto: No existe") # si son distintos, no existe el límite exacto pero se muestran los laterales
                lbl_decimal.configure(text=f"Límites laterales distintos (L+ = {limite_derecha} | L- = {limite_izquierda})")

        #genera el gráfico de la función usando el valor de h limpio
        generar_grafico(funcion, texto_h_fijo)

    except Exception:
        lbl_error.configure(text="Error: Revise la escritura de la función o el valor de h.")


# Dibuja la funcion en un rango alrededor del punto indicado.
def generar_grafico(funcion, texto_h):
    global canvas
    puntos_x = []
    puntos_y = []
    
    #determina el rango de x para graficar basado en h 
    if texto_h in ["inf", "-inf", "oo", "-oo"]:
        inicio = -10
        final = 10
    else:
        try:
            h_numero = float(sp.sympify(texto_h).evalf())
            inicio = h_numero - 5
            final = h_numero + 5
        except:
            inicio = -5
            final = 5

    #evalúa la función en puntos cercanos a h para graficar 
    valor_actual = inicio
    while valor_actual <= final:
        try:
            resultado_y = funcion.subs(x, valor_actual).evalf()
            # Guardamos solo números reales válidos
            if resultado_y.is_real and not resultado_y.is_infinite:
                puntos_x.append(valor_actual)
                puntos_y.append(float(resultado_y))
        except:
            pass
        valor_actual = valor_actual + 0.05 

    figura = Figure(figsize=(6, 3.5), dpi=100) #crea la figura y los ejes para graficar
    ejes = figura.add_subplot(111)
    
    if puntos_x and puntos_y: #si hay puntos válidos, hace la gráfica
        ejes.plot(puntos_x, puntos_y, color="blue", linewidth=2)
        
    ejes.axhline(0, color="black", linewidth=1)
    ejes.axvline(0, color="black", linewidth=1)
    ejes.set_title("Visualización de la Función f(x)")
    ejes.grid(True, linestyle="--", alpha=0.5)
    
    canvas = FigureCanvasTkAgg(figura, master=marco_grafico) #dibuja el gráfico en el marco   
    canvas.draw()
    canvas.get_tk_widget().pack(fill="both", expand=True, padx=5, pady=5)

# Construccion de la ventana y sus controles.
ctk.set_appearance_mode("light") #configuración de el tema y colores de la interfaz
ctk.set_default_color_theme("blue")

ventana = ctk.CTk()
ventana.title("Analizador de Límites Matemáticos")
ventana.geometry("750x800")
ventana.resizable(False, False)

lbl_titulo = ctk.CTkLabel(ventana, text="Analizador y Visualizador de Límites Matemáticos", font=("Arial", 16, "bold")) #titulo principal  
lbl_titulo.pack(pady=15)

marco_entradas = ctk.CTkFrame(master=ventana, fg_color="#F0F0F0") #marco para las entradas de función y h
marco_entradas.pack(pady=10, padx=30, fill="x")

#entrada de la función f(x)
lbl_fun = ctk.CTkLabel(master=marco_entradas, text="Ingrese f(x):", font=("Arial", 12, "bold"))
lbl_fun.grid(row=0, column=0, padx=15, pady=15, sticky="w")

entrada_funcion = ctk.CTkEntry(master=marco_entradas, width=400, placeholder_text="Ejemplo: (x**2 - 4) / (x - 2)")
entrada_funcion.grid(row=0, column=1, padx=15, pady=15)

lbl_val_h = ctk.CTkLabel(master=marco_entradas, text="Ingrese h:", font=("Arial", 12, "bold")) #entrada del valor de h
lbl_val_h.grid(row=1, column=0, padx=15, pady=15, sticky="w")

entrada_h = ctk.CTkEntry(master=marco_entradas, width=400, placeholder_text="Ejemplo: 2, 0, inf, pi")
entrada_h.grid(row=1, column=1, padx=15, pady=15)

#recordatorio de formato para la función
lbl_nota = ctk.CTkLabel(ventana, text="Recuerde usar '*' para multiplicación (ej: 5*x), '**' para potencias (ej: x**2), 'abs()' para valor absoluto y 'sqrt()' para raíces", font=("Arial", 11, "italic"), text_color="gray")
lbl_nota.pack(pady=2)

btn_calcular = ctk.CTkButton(ventana, text="Calcular Límite", font=("Arial", 12, "bold"), command=calcular_limite)   
btn_calcular.pack(pady=10)

lbl_exacto = ctk.CTkLabel(ventana, text="Límite Exacto: ", font=("Arial", 14, "bold")) #etiquetas para mostrar resultados y errores
lbl_exacto.pack(pady=4)

lbl_decimal = ctk.CTkLabel(ventana, text="Valor Decimal: ", font=("Arial", 12)) #etiqueta para mostrar el valor decimal del límite (si es posible)
lbl_decimal.pack(pady=2)

lbl_error = ctk.CTkLabel(ventana, text="", font=("Arial", 12, "bold"), text_color="red") #etiqueta para mostrar errores de entrada o cálculo
lbl_error.pack(pady=2)

marco_grafico = ctk.CTkFrame(master=ventana, fg_color="#E0E0E0") #marco para el gráfico de la función
marco_grafico.pack(pady=15, padx=30, fill="both", expand=True)

ventana.mainloop() #inicia la ventana principal del programa