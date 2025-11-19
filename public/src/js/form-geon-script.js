// Arquivo: form-geon-script.js (Lógica de Verificação no Passo 4)

// ===== FUNÇÃO DE MÁSCARA DE TELEFONE (NOVA) =====
function maskPhone(value) {
    // 1. Remove tudo que não for dígito
    let cleaned = value.replace(/\D/g, ''); 

    // 2. Limita o número a 11 dígitos (incluindo o DDD e o 9 extra)
    cleaned = cleaned.substring(0, 11);

    // 3. Aplica a máscara: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    let masked = '';

    if (cleaned.length > 0) {
        // (XX
        masked += '(' + cleaned.substring(0, 2);
    }
    if (cleaned.length > 2) {
        // ) X
        masked += ') ' + cleaned.substring(2, 7);
    } else {
        // Garante que o parênteses seja fechado se o usuário parar no DDD
        if (cleaned.length === 2) {
             masked += ') ';
        }
    }
    if (cleaned.length > 7) {
        // XXXXX-XXXX
        masked += '-' + cleaned.substring(7, 11);
    }
    // Lógica para números de 8 dígitos (sem o 9) - Não interfere na lógica principal de 11 dígitos.
    else if (cleaned.length > 6 && cleaned.length < 11) {
        // (XX) XXXX-XX
        masked = '(' + cleaned.substring(0, 2) + ') ' + cleaned.substring(2, 6) + '-' + cleaned.substring(6, 10);
    }
    
    // Retorna a string mascarada
    return masked;
}
// ===== FIM DA FUNÇÃO DE MÁSCARA =====


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('geon-form');
    const steps = document.querySelectorAll('.form-step');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progressBar = document.getElementById('progress-bar');
    const floatingError = document.getElementById('floating-error');
    const floatingErrorText = document.getElementById('floating-error-text');
    
    // CORREÇÃO: Remoção da extensão .js e adição do novo endpoint de validação
    const API_SEND_CODE_ENDPOINT = '/api/send-verification'; 
    const API_VERIFY_ENDPOINT = '/api/verify-and-submit'; 
    const API_VALIDATE_CODE_ENDPOINT = '/api/validate-code';
    
    let currentStep = 1;
    const questionSteps = Array.from(steps).filter(step => !step.classList.contains('success-step'));
    const totalQuestionSteps = questionSteps.length; // Agora é 8
    
    let completeFormData = {};
    
    // NOVO: Adiciona o Event Listener para a máscara de telefone
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (event) => {
            event.target.value = maskPhone(event.target.value);
        });
    }

    function showFloatingError(message) {
        floatingErrorText.textContent = message;
        floatingError.classList.add('visible');
        setTimeout(() => {
            floatingError.classList.remove('visible');
        }, 3000); 
    }

    /**
     * Atualiza a visualização do passo atual, botões e barra de progresso.
     */
    function updateStep() {
        steps.forEach(step => {
            step.classList.remove('active');
        });

        const activeStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        if (activeStepElement) {
            activeStepElement.classList.add('active');
            
            // Verifica se é a tela de sucesso (Passo 9)
            if (currentStep > totalQuestionSteps) {
                // Se for a tela de sucesso, não foca.
                const stepCounter = activeStepElement.querySelector('.step-counter');
                if (stepCounter) stepCounter.style.display = 'none'; // Esconde o contador
                
                // Esconde a navegação
                const formNavigation = document.querySelector('.form-navigation');
                if (formNavigation) {
                    formNavigation.style.display = 'none';
                }
                return; 
            }

            const stepCounter = activeStepElement.querySelector('.step-counter');
            if (stepCounter) {
                stepCounter.style.display = 'block'; // Garante que o contador apareça
                stepCounter.textContent = `Pergunta ${currentStep} de ${totalQuestionSteps}`;
            }
            
            const inputField = activeStepElement.querySelector('input, textarea, select');
            if(inputField) {
                 setTimeout(() => inputField.focus(), 100);
            }
        }
        
        if (floatingError.classList.contains('visible')) {
            floatingError.classList.remove('visible');
        }

        // --- Lógica da Barra de Progresso e Botões ---
        
        const progress = (currentStep - 1) / (totalQuestionSteps - 1) * 100;
        progressBar.style.width = `${currentStep > totalQuestionSteps ? 100 : progress}%`;

        // Garante que a navegação esteja visível nos passos de pergunta
        const formNavigation = document.querySelector('.form-navigation');
        if (formNavigation) {
            formNavigation.style.display = 'flex';
        }

        prevBtn.style.display = 'inline-block';
        prevBtn.disabled = currentStep === 1;

        // MUDANÇA: O botão 'Enviar' (submit) só aparece no último passo (8)
        if (currentStep === totalQuestionSteps) { // Se for o Passo 8 (Problema)
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-block';
        } else {
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        }
        
        // MUDANÇA: O texto do botão muda nos passos de verificação
        if (currentStep === 4) { 
             nextBtn.textContent = 'Enviar Código';
        } else if (currentStep === 5) {
             nextBtn.textContent = 'Verificar Código'; // NOVO: Texto para o Passo 5
        } else {
             nextBtn.textContent = 'Continuar';
        }
    }

    /**
     * Valida o campo de input do passo atual.
     * @returns {boolean} True se o campo for válido e preenchido.
     */
    function validateStep() {
        const activeStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        const inputField = activeStepElement.querySelector('input, textarea, select');
        
        if (!inputField || !inputField.hasAttribute('required')) {
            if (inputField && inputField.id === 'website') {
                const value = inputField.value.trim();
                // Verifica se há pelo menos um ponto se o campo for preenchido
                if (value !== '' && !value.includes('.')) { 
                    showFloatingError('Por favor, insira um website válido (ex: site.com)');
                    return false;
                }
            }
            return true; 
        }

        const value = inputField.value.trim();

        if (value === '') {
            showFloatingError('Este campo é obrigatório.'); 
            return false;
        }

        if (inputField.id === 'email' && (!value.includes('@') || !value.includes('.'))) {
            showFloatingError('Por favor, insira um e-mail válido.');
            return false;
        }
        
        // MUDANÇA: Validação do telefone usa o número limpo
        if (inputField.id === 'phone') {
            const cleanPhone = value.replace(/\D/g, ''); // Remove todos os caracteres não-dígitos
            // Verifica se tem 10 (DDD + 8 dig) ou 11 (DDD + 9 dig) dígitos
            if (cleanPhone.length < 10) { 
                showFloatingError('Por favor, insira um telefone válido (mínimo DDD + 8 dígitos).');
                return false;
            }
        }
        
        // Validação básica do código (Passo 5)
        if (inputField.id === 'code' && value.length < 4) {
             showFloatingError('O código parece ser inválido.');
             return false;
        }
        
        return true;
    }
    
    /**
     * Envia o código de verificação (Chamada no Passo 4)
     */
    async function handleSendVerificationCode() {
        if (!validateStep()) {
            return;
        }

        nextBtn.disabled = true;
        nextBtn.textContent = 'Enviando...';

        // Pega *apenas* o e-mail para enviar
        const email = document.getElementById('email').value;
        
        try {
            const response = await fetch(API_SEND_CODE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email }) 
            });

            if (!response.ok) {
                // Se a API retornar 500, o erro é no Resend ou KV
                const errorData = await response.json(); 
                throw new Error(errorData.error || 'Falha ao enviar o código de verificação.');
            }

            // Sucesso: Atualiza o texto do Passo 5 e avança
            document.getElementById('verification-email-display').textContent = email;
            currentStep++; // Avança para o Passo 5 (Verificação)
            updateStep();

        } catch (error) {
            console.error('Erro ao enviar código:', error);
            showFloatingError(error.message || 'Não foi possível enviar o código. Verifique o e-mail e tente novamente.');
        } finally {
            nextBtn.disabled = false;
            // O texto será redefinido pelo updateStep()
        }
    }

    /**
     * Valida o código de verificação (Chamada no Passo 5)
     */
    async function handleVerifyCode() {
        if (!validateStep()) {
            return;
        }

        nextBtn.disabled = true;
        nextBtn.textContent = 'Verificando...';
        
        // Pega o email e o código
        const email = document.getElementById('email').value;
        const code = document.getElementById('code').value;
        
        try {
            // Chama o novo endpoint de validação
            const response = await fetch(API_VALIDATE_CODE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }) 
            });

            if (!response.ok) {
                // Captura a mensagem de erro da API (e.g., Código inválido, Código expirado)
                const errorData = await response.json(); 
                throw new Error(errorData.error || 'Falha ao validar o código.');
            }

            // SUCESSO: Avança para o Passo 6
            currentStep++; 
            updateStep();

        } catch (error) {
            console.error('Erro ao validar código:', error);
            // Mostra o erro exato retornado pelo backend
            showFloatingError(error.message || 'Erro de conexão ou código inválido.');
        } finally {
            // CORREÇÃO UX: Redefine o botão (texto e estado) em caso de sucesso OU falha
            nextBtn.disabled = false;
            if (currentStep === 5) {
                nextBtn.textContent = 'Verificar Código';
            } else if (currentStep === 4) {
                 nextBtn.textContent = 'Enviar Código';
            } else {
                 nextBtn.textContent = 'Continuar';
            }
        }
    }


    // --- EVENT LISTENERS ---

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStep();
        }
    });

    nextBtn.addEventListener('click', () => {
        // Lógica de envio de código no Passo 4
        if (currentStep === 4) { 
            handleSendVerificationCode();
        } 
        // Lógica de validação do código no Passo 5
        else if (currentStep === 5) {
            handleVerifyCode();
        }
        // Lógica normal para todos os outros passos (1-3, 6-7)
        else if (currentStep < totalQuestionSteps) { 
            if (validateStep()) {
                currentStep++;
                updateStep();
            }
        }
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateStep()) { // Valida o último campo (Problema)
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Verificando...';
        
        // Coleta TODOS os dados do formulário de uma vez
        const formData = new FormData(form);
        const finalData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(API_VERIFY_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                // O backend final agora retorna 500 para falhas de Resend
                if (response.status === 500) { 
                     throw new Error(errorData.error || 'Erro interno ao finalizar a solicitação.');
                }
                // Captura qualquer outro erro de Bad Request ou falha genérica
                throw new Error(errorData.error || 'Falha ao enviar sua solicitação.');
            }

            // SUCESSO! Avança para o passo final (Step 9)
            currentStep = 9; 
            updateStep();
            
        } catch (error) {
            console.error('Erro de envio final:', error);
            showFloatingError(error.message || 'Erro de conexão. Tente novamente.');
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Solicitação';
        }
    });
    
    // NOVO: Adiciona suporte à tecla 'Enter' para avançar e enviar
    document.addEventListener('keydown', (e) => {
        // 1. Verifica se a tecla pressionada é 'Enter'
        if (e.key === 'Enter') {
            // 2. Previne a ação padrão (enviar o formulário inteiro ou nova linha em textarea)
            e.preventDefault(); 
            
            // 3. Obtém o elemento ativo para verificar se é um campo de entrada
            const activeElement = document.activeElement;

            // 4. Se o foco estiver em um <textarea> (Passo 8), permite o Enter para nova linha.
            if (activeElement && activeElement.tagName.toLowerCase() === 'textarea') {
                return; 
            }

            // 5. Lógica de avanço/envio
            if (currentStep < totalQuestionSteps) {
                // Simula o clique no botão 'Continuar' / 'Verificar Código' / 'Enviar Código'
                nextBtn.click();
            } else if (currentStep === totalQuestionSteps) {
                // ACIONA O ENVIO DO FORMULÁRIO QUANDO ESTAMOS NO ÚLTIMO PASSO
                form.requestSubmit(submitBtn);
            }
        }
    });

    // Inicializa o formulário no primeiro passo
    updateStep();
});