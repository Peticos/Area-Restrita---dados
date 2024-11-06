from flask import Flask, request, jsonify, render_template, redirect, url_for
import pickle
from script import predict

app = Flask(__name__)
rename_map = {'idade': 'age', 'genero': 'gender', 'tempoRedesSociais': 'time_in_social_media', 'pessoasEmCasa': 'people_living_together', 'rendaFamiliar': 'social_class', 'temPets': 'has_pets', 'quantidadePets': 'number_of_pets', 'temCachorro': 'has_dog', 'temGato': 'has_cat', 'temOutros': 'has_others', 'esqueceTarefas': 'forgets', 'reportaria': 'report_abandoned', 'sentimento': 'feeling'}

@app.route('/possiveis-users')
def possiveis_users():
    return render_template('dash-possiveis-users.html')

@app.route('/publico-alvo')
def publico_alvo():
    return render_template('dash-publico-alvo.html')

@app.route('/previsao-user')
def home():
    return render_template('index.html')  # Renders the HTML page

@app.route('/')
def index():
    return redirect(url_for("home"))

@app.route('/previsao-user', methods=['POST'])
def receber_dados():
    dados = request.json.get('dados')
    print("Dados recebidos:", dados)  # Adicione para depuração
    if not dados:
        return jsonify({'error': 'Nenhum dado recebido'}), 400
    for old_key, new_key in rename_map.items():
        if old_key in dados:
            dados[new_key] = dados.pop(old_key)
    result = predict(dados)
    print("Resultado da previsão:", result)
    return jsonify({'percentage': result[0], 'would_use': int(result[1])})


if __name__ == '__main__':
    app.run(debug=True, port=5000, host="0.0.0.0")
