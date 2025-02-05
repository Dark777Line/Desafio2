document.addEventListener("DOMContentLoaded", function () {
    // Adiciona o ouvinte de evento para o envio do formulário
    document.getElementById("Formulario").addEventListener("submit", async function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Valida o formulário
        if (!validateForm()) {
            return;
        }

        // Obtém o endereço pelo CEP
        await getAddressByCep();

        // Obtém a previsão do tempo
        await getWeatherByCoordinates();

        // Envia os dados para o Google Sheets
        await sendDataToGoogleSheets();
    });
});

// Validação do formulário
function validateForm() {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const cep = document.getElementById('inputCep').value.trim();
    const latitude = document.getElementById('inputLatitude').value.trim();
    const longitude = document.getElementById('inputLongitude').value.trim();

    if (!nome || !email || !cep || !latitude || !longitude) {
        alert('Por favor, preencha todos os campos corretamente.');
        return false;
    }

    return true;
}

// Função para buscar o endereço pelo CEP
async function getAddressByCep() {
    const cep = document.getElementById('inputCep').value.trim();
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            alert('CEP não encontrado.');
            return;
        }

        document.getElementById('cep').value = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('cidade').value = `${data.localidade || ''} - ${data.uf || ''}`;
    } catch (error) {
        console.error('Erro ao buscar o CEP:', error);
        alert('Erro ao buscar o CEP. Tente novamente mais tarde.');
    }
}

// Função para buscar a previsão do tempo
async function getWeatherByCoordinates() {
    const latitude = document.getElementById('inputLatitude').value.trim();
    const longitude = document.getElementById('inputLongitude').value.trim();

    try {
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.hourly) {
            const temperature = data.hourly.temperature_2m[0];
            const humidity = data.hourly.relative_humidity_2m[0];
            document.getElementById('clima').value = `Temperatura: ${temperature}°C, Umidade: ${humidity}%`;
        } else {
            alert('Erro ao obter dados climáticos.');
        }
    } catch (error) {
        console.error('Erro ao buscar a previsão do tempo:', error);
        alert('Erro ao buscar a previsão do tempo. Tente novamente mais tarde.');
    }
}

// Função para enviar os dados para o Google Sheets
async function sendDataToGoogleSheets() {
    const formData = new FormData(document.getElementById("Formulario"));
    const jsonData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbxRO-yz0CVpn0FmX442kPl6cV03OjITbNFYkYu5DyAcTsaTJ49xm_0EFio3vFDcKA/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",  // Definir tipo como JSON
            },
            body: JSON.stringify(jsonData)  // Enviar os dados como JSON
        });

        if (!response.ok) {
            throw new Error("Erro ao enviar os dados para o Google Sheets.");
        }

        const responseData = await response.json();
        if (responseData.result === "success") {
            alert("Dados enviados com sucesso!");
        } else {
            throw new Error("Erro no Google Apps Script: " + responseData.message);
        }

    } catch (error) {
        alert("Erro ao enviar os dados. Tente novamente.");
        console.error(error);
    }
}


    function doPost(e) {
        try {
          // Verifique se os dados realmente chegaram no corpo da requisição
          if (e && e.postData && e.postData.contents) {
            var data = JSON.parse(e.postData.contents); // Converta os dados JSON em um objeto
      
            // Acesse os dados recebidos
            var nome = data.Nome;
            var email = data['E-mail'];
            var cep = data.CEP;
            var latitude = data.Latitude;
            var longitude = data.Longitude;
      
            // Registre os dados na planilha
            var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
            sheet.appendRow([nome, email, cep, latitude, longitude]);
      
            // Retorne uma resposta de sucesso
            return ContentService.createTextOutput(
              JSON.stringify({ "result": "success" })
            ).setMimeType(ContentService.MimeType.JSON);
          } else {
            throw new Error("Dados não recebidos corretamente.");
          }
        } catch (error) {
          // Caso ocorra um erro, envie uma mensagem de erro
          return ContentService.createTextOutput(
            JSON.stringify({ "result": "error", "message": error.message })
          ).setMimeType(ContentService.MimeType.JSON);
        }
      }      
      
document.addEventListener("DOMContentLoaded", function () {
    // Seleciona todos os links internos do menu de navegação
    const links = document.querySelectorAll("#menu a");

    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Previne a navegação padrão

            const targetId = this.getAttribute("href").substring(1); // Obtém o ID do destino
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY;

                // Animação de rolagem suave
                window.scrollTo({
                    top: offsetTop - 50, // Ajuste para evitar sobreposição com cabeçalhos fixos
                    behavior: "smooth"
                });
            }
        });
    });
});
