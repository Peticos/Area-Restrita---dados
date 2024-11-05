document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll(".formulario");
    const nextButtons = document.querySelectorAll(".btnForm");
    const finalizeButton = document.getElementById("btnFim"); // ID do botão "Finalizar"
    
    // Oculta todos os formulários, exceto o primeiro
    for (let i = 1; i < forms.length; i++) {
        forms[i].classList.add('invisivel');
    }
    

    const checkInputs = (form) => {
        const inputs = form.querySelectorAll(".input");
        const selects = form.querySelectorAll("select");
        let valid = true;

        inputs.forEach(input => {
            if (!input.value) {
                valid = false;
            }
        });

        selects.forEach(select => {
            if (!select.value) {
                valid = false;
            }
        });

        return valid;
    };

    nextButtons.forEach((button, index) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const currentForm = forms[index];

            if (checkInputs(currentForm)) {
                // Exibe o próximo formulário
                if (index + 1 < forms.length) {
                    forms[index + 1].classList.remove('.invisivel');
                }
            } else {
                const camposVazios = [];
                const inputs = currentForm.querySelectorAll(".input");
                const selects = currentForm.querySelectorAll("select");

                inputs.forEach(input => {
                    if (!input.value) camposVazios.push(input.placeholder || 'campo sem nome');
                });

                selects.forEach(select => {
                    if (!select.value) camposVazios.push(select.options[select.selectedIndex].text || 'campo sem nome');
                });

                const message = "Por favor, preencha os seguintes campos: " + camposVazios.join(', ');
                if (Notification.permission === "granted") {
                    new Notification("Campos não preenchidos", {
                        body: message,
                        icon: 'https://example.com/icon.png' 
                    });
                } else {
                    alert(message);
                }
            }
        });
    });

    // Função para salvar todas as respostas no localStorage ao clicar em "Finalizar"
    finalizeButton.addEventListener("click", (event) => {
        event.preventDefault();
    });
});
// Função para salvar dados no localStorage
function salvarDados() {
    // Capturando os valores dos campos
    const idade = document.querySelector('input[placeholder="Idade"]').value;
    const genero = document.querySelector('#genero').value;
    const tempoRedesSociais = document.querySelector('input[placeholder="Tempo médio em redes sociais"]').value;
    const pessoasEmCasa = document.querySelector('input[placeholder="Quantidade de pessoas que vivem em sua casa"]').value;
    const rendaFamiliar = document.querySelector('#renda').value;
    const temPets = document.querySelector('#temPets').value;
    
    const quantidadePets = document.querySelector('input[placeholder="Quantidade de pets"]').value;
    const temCachorro = document.querySelector('#cachorro').value;
    const temGato = document.querySelector('#gato').value;
    const temOutros = document.querySelector('#outros').value;
    const esqueceTarefas = document.querySelector('#esquece').value;
    
    const reportaria = document.querySelector('#reportaria').value;
    const sentimento = document.querySelector('#sentimento').value;

    // Criando um objeto com os dados
    const dados = {
        idade,
        genero,
        tempoRedesSociais,
        pessoasEmCasa,
        rendaFamiliar,
        temPets,
        quantidadePets,
        temCachorro,
        temGato,
        temOutros,
        esqueceTarefas,
        reportaria,
        sentimento
    };

    // Salvando os dados no localStorage
    localStorage.setItem('dadosPessoais', JSON.stringify(dados));
    
    // Exibindo um alerta de sucesso
    window.alert('Dados salvos com sucesso!');
}

function enviarDadosAoServidor() {
    const dados = localStorage.getItem('dadosPessoais');
    
    if (dados) {
        console.log(dados)
        fetch('http://localhost:5000/previsao-user', { // Altere para o endereço correto do servidor
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dados: JSON.parse(dados) }) // Aqui você envia os dados
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na rede');
            }
            return response.json(); // Espera o JSON da resposta
        })
        .then(data => {
            if(data.would_use == 1){
                window.alert("o entrevistado é um potencial usuário do aplicativo! Ele tem "+data.percentage+"% de chance de usá-lo!"); 
            }else{
                window.alert("E entrevistado não é um potencial usuário do aplicativo! Ele tem "+data.percentage+"% de chance de usá-lo!"); 
            }
           // Exibe o resultado da IA
        })
        .catch((error) => {
            console.error("Erro ao enviar dados:", error);
            console.log("dados:" + JSON.parse(dados))
        });
    } else {
        console.error("Nenhum dado encontrado no localStorage.");
    }
}


function toggleMenu() {
    const menu = document.querySelector('.menu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

// Chame essa função ao clicar no botão finalizar ou em outro evento relevante
document.getElementById('btnFim').addEventListener('click', function(event) {
    event.preventDefault();
    salvarDados(); // Primeiro, salva os dados no localStorage
    enviarDadosAoServidor(); // Depois, envia os dados ao servidor
});