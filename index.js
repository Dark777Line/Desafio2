async function getAddressByCep() {
   // Obtém o valor do campo de entrada
   const cep = document.getElementById('inputCep').value;

   // Valida o CEP
   if (!cep || cep.length !== 8) {
       alert('Por favor, insira um CEP válido com 8 dígitos.');
       return;
   }

   try {
       // Faz a requisição à API do ViaCEP
       const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

       // Verifica se a resposta foi bem-sucedida
       if (!response.ok) {
           throw new Error('Erro ao buscar o CEP. Verifique se o CEP está correto.');
       }

       // Converte a resposta em JSON
       const data = await response.json();

       // Verifica se houve erro na API
       if (data.erro) {
           alert('CEP não encontrado. Tente novamente.');
           return;
       }

       // Preenche os campos de resultado
       document.getElementById('cep').value = data.logradouro || '';
       document.getElementById('bairro').value = data.bairro || '';
       document.getElementById('cidade').value = `${data.localidade || ''} - ${data.uf || ''}`;
   } catch (error) {
       // Lida com erros de requisição ou processamento
       console.error('Erro ao consumir a API:', error);
       alert('Ocorreu um erro ao buscar o CEP. Tente novamente mais tarde.');
   }

     // Obtém os valores dos campos de latitude e longitude
     const latitude = document.getElementById('inputLatitude').value;
     const longitude = document.getElementById('inputLongitude').value;
 
     // Valida se latitude e longitude foram preenchidas
     if (!latitude || !longitude) {
         alert('Por favor, insira valores válidos para latitude e longitude.');
         return;
     }
 
     try {
        // URL da API da Open Meteo com os parâmetros
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m`;

        // Faz a requisição à API
        const response = await fetch(apiUrl);

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao buscar a previsão do tempo. Verifique os valores de latitude e longitude.');
        }

        // Converte a resposta em JSON
        const data = await response.json();

        // Extrai as informações relevantes
        const hourlyWeather = data.hourly;
        const temperature = hourlyWeather.temperature_2m[0]; // Primeira previsão de temperatura
        const humidity = hourlyWeather.relative_humidity_2m[0]; // Primeira previsão de umidade relativa

        // Exibe os resultados na página
        document.getElementById('clima').value = `Temperatura: ${temperature}°C, Umidade: ${humidity}%`;
    } catch (error) {
        // Lida com erros de requisição ou processamento
        console.error('Erro ao consumir a API:', error);
        alert('Ocorreu um erro ao buscar a previsão do tempo. Tente novamente mais tarde.');
    }

    function validateForm(event) {
        event.preventDefault(); // Impede o envio do formulário até que seja validado
    
        // Obtém os valores dos campos
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const cep = document.getElementById('inputCep').value.trim();
        const latitude = document.getElementById('inputLatitude').value.trim();
        const longitude = document.getElementById('inputLongitude').value.trim();
    
        // Verifica se os campos obrigatórios estão preenchidos
        if (!nome) {
            alert('Por favor, insira seu nome.');
            return false;
        }
        if (!email) {
            alert('Por favor, insira um e-mail válido.');
            return false;
        }
        if (!cep || cep.length !== 8 || isNaN(cep)) {
            alert('Por favor, insira um CEP válido com 8 dígitos.');
            return false;
        }
        if (!latitude || isNaN(latitude)) {
            alert('Por favor, insira um valor numérico para a latitude.');
            return false;
        }
        if (!longitude || isNaN(longitude)) {
            alert('Por favor, insira um valor numérico para a longitude.');
            return false;
        }
    }
}
