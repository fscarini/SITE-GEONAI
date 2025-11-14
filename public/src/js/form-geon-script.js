// Arquivo: form-geon-script.js (Lógica de Verificação no Passo 4)

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('geon-form');
    const steps = document.querySelectorAll('.form-step');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progressBar = document.getElementById('progress-bar');
    const floatingError = document.getElementById('floating-error');
    const floatingErrorText = document.getElementById('floating-error-text');
    
    const API_SEND_CODE_ENDPOINT = '/api/send-verification.js'; 
    const API_VERIFY_ENDPOINT = '/api/verify-and-submit.js'; 
    
    let currentStep = 1;
    const questionSteps = Array.from(steps).filter(step => !step.classList.contains('success-step'));
    const totalQuestionSteps = questionSteps.length; // Agora é 8
    
    let completeFormData = {};

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
            
            const stepCounter = activeStepElement.querySelector('.step-counter');
            if (stepCounter) {
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

        if (currentStep > totalQuestionSteps) { // Se for o Passo 9 (Sucesso)
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'none';
            return;
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
        
        // MUDANÇA: O texto do botão muda no Passo 4 (E-mail)
        if (currentStep === 4) { 
             nextBtn.textContent = 'Enviar Código';
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
        
        if (inputField.id === 'phone' && value.length < 8) {
            showFloatingError('Por favor, insira um telefone válido.');
            return false;
        }
        
        // Validação do código (Passo 5)
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
                throw new Error('Falha ao enviar o código de verificação.');
            }

            // Sucesso: Atualiza o texto do Passo 5 e avança
            document.getElementById('verification-email-display').textContent = email;
            currentStep++; // Avança para o Passo 5 (Verificação)
            updateStep();

        } catch (error) {
            console.error('Erro ao enviar código:', error);
            showFloatingError('Não foi possível enviar o código. Verifique o e-mail e tente novamente.');
        } finally {
            nextBtn.disabled = false;
            // O texto será redefinido para 'Continuar' pelo updateStep()
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
        // MUDANÇA: Lógica de envio de código no Passo 4
        if (currentStep === 4) { 
            handleSendVerificationCode();
        } 
        // Lógica normal para todos os outros passos (1-3, 5-7)
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
                if (response.status === 400 || response.status === 401) { 
                     throw new Error(errorData.error || 'Código inválido. Tente novamente.');
                }
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

    // Inicializa o formulário no primeiro passo
    updateStep();
});