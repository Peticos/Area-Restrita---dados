document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll(".formulario");
    const nextButtons = document.querySelectorAll(".btnForm");
    const finalizeButton = document.getElementById("finalizeButton"); // ID do botão "Finalizar"
    
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

        const inputs = button.closest(".formulario").querySelectorAll(".input");
        const selects = button.closest(".formulario").querySelectorAll("select");
        
        [...inputs, ...selects].forEach((element) => {
            element.addEventListener("input", () => {
                button.disabled = !checkInputs(currentForm);
            });
        });
    });

    // Função para salvar todas as respostas no localStorage ao clicar em "Finalizar"
    finalizeButton.addEventListener("click", (event) => {
        event.preventDefault();
        
        // Aqui você pode adicionar uma lógica para exibir uma mensagem ou redirecionar o usuário
        alert("Respostas salvas com sucesso!");
    });

    // Exibir respostas ao clicar no título
    document.getElementById('perguntasFinais').addEventListener('click', function() {
        const respostasSalvas = JSON.parse(localStorage.getItem('respostas'));

        if (respostasSalvas) {
            const respostasContainer = document.getElementById('respostasContainer');
            respostasContainer.innerHTML = ''; // Limpa o conteúdo anterior

            for (const [key, value] of Object.entries(respostasSalvas)) {
                const respostaDiv = document.createElement('div');
                respostaDiv.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
                respostasContainer.appendChild(respostaDiv);
            }

            // Mostra a seção de respostas
            document.getElementById('respostas').style.display = 'block';
        } else {
            alert("Nenhuma resposta encontrada.");
        }
    });
});

// script.js

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

// Adicionando um evento ao botão de finalizar
document.getElementById('btnFim').addEventListener('click', function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário
    salvarDados(); // Chama a função para salvar os dados
});
