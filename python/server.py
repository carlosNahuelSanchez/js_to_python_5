from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__, static_folder='public')

@app.route('/')
def serve_index():
    return send_from_directory('public', 'index.html')

@app.route('/multiplicar', methods=['POST'])
def multiplicar_matrices():
    data = request.get_json()
    matriz1 = data['matriz1']
    matriz2 = data['matriz2']
    
    filas1 = len(matriz1)
    columnas1 = len(matriz1[0])
    filas2 = len(matriz2)
    columnas2 = len(matriz2[0])
    
    if columnas1 != filas2:
        return jsonify({"error": "El número de columnas de la primera matriz debe ser igual al número de filas de la segunda matriz."}), 400
    
    matriz_resultado = [[0 for _ in range(columnas2)] for _ in range(filas1)]
    
    for i in range(filas1):
        for j in range(columnas2):
            for k in range(columnas1):
                matriz_resultado[i][j] += matriz1[i][k] * matriz2[k][j]
    
    return jsonify({"matrizResultado": matriz_resultado})

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('public', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4500, debug=True)
