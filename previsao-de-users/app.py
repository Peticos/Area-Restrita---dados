from flask import Flask, request, jsonify, render_template
from script import predict

app = Flask(__name__)
rename_map = {'idade': 'age', 'genero': 'gender', 'tempoRedesSociais': 'time_in_social_media', 'pessoasEmCasa': 'people_living_together', 'rendaFamiliar': 'social_class', 'temPets': 'has_pets', 'quantidadePets': 'number_of_pets', 'temCachorro': 'has_dog', 'temGato': 'has_cat', 'temOutros': 'has_others', 'esqueceTarefas': 'forgets', 'reportaria': 'report_abandoned', 'sentimento': 'feeling'}

@app.route('/')
def home():
    return render_template('index.html')  # Renders the HTML page

@app.route('/', methods=['POST'])
def receber_dados():
    dados = request.json.get('dados')
    print(dados)
    for old_key, new_key in rename_map.items():
        dados[new_key] = dados.pop(old_key)
    result = predict(dados)
    print(result)
    
    return f'''
           <div style="width: 50vw; height: 50vh; background-color: white; postition:absolute">{result}</div>
           '''

if __name__ == '__main__':
    app.run(debug=True)